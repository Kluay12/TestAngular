var runAgainByKeyword = false;
var runAgainIntervalByKeyword;
var timeStartGetPostIntervalByKeyword;

$(`[name="runAgainByKeyword"]`).change(function (e) { 
    e.preventDefault();
    console.log($(this).is(':checked'));
    if ($(this).is(':checked')) {
        runAgainByKeyword = true;
        $('[name="timeRunAgainByKeyword"]').prop(`disabled`, false);
        $('[name="timeStartGetPostByKeyword"]').prop(`disabled`, false);
    } else {
        runAgainByKeyword = false;
        $('[name="timeRunAgainByKeyword"]').prop(`disabled`, true);
        $('[name="timeStartGetPostByKeyword"]').prop(`disabled`, true);
    }
});

function runAgainLoopByKeyword() {
    clearInterval(runAgainIntervalByKeyword);
    if (!runAgainByKeyword) {
        return;
    }
    var timeRunAgain = $('[name="timeRunAgainByKeyword"]').val();
    // var timeRunAgainSecond = timeRunAgain * 3600000; // hour
    var timeRunAgainSecond = timeRunAgain * 60000; // minute
    runAgainIntervalByKeyword = setInterval(() => {
        console.log(`Run Again`);
        beforeGetPostByKeyword();
    }, timeRunAgainSecond);
}

function waitStartGetPostByKeyword() {
    console.log(`waitStartGetPost`);
    clearInterval(timeStartGetPostIntervalByKeyword);
    if (!runAgainByKeyword) {
        return;
    }
    var timeStartGetPost = $('[name="timeStartGetPostByKeyword"]').val();
    timeStartGetPostIntervalByKeyword = setInterval(() => {

        var date_time = new Date().toString();
        if (Date.parse(date_time) >= Date.parse(timeStartGetPost)) {
            beforeGetPostByKeyword();
            clearInterval(timeStartGetPostIntervalByKeyword);
        }

    }, 1000);
}

$('#formGetKeyword').submit(function (e) { 
    e.preventDefault();
    console.log('submit!!');

    if ($('#formGetKeyword').valid()) {
        getKeyword();
    }
});

$('#formGetKeyword').validate({
    groupId: true,
});

var keyword_selected = [];
function getKeyword() {

    var html = 
    `<div class="col-lg-12 loading">
        <img src="images/loading.svg" alt="loading" style="width: 20px;">
        <span>กำลังโหลดคีย์เวิร์ด</span>
    </div>`;
    $(`#keyword`).find('.loading').remove();
    $(`#keyword`).empty().append(html);
    $(`#divFormGetPostByKeyword`).show();

    chrome.cookies.getAll({url: `https://www.facebook.com`}, function(cookie) {
        // console.log(`cookie: `, cookie);

        var cookie_str = ``;
        for (let i = 0; i < cookie.length; i++) {
            if (cookie_str) {
                cookie_str += ` `
            }
            cookie_str += `${cookie[i].name}=${cookie[i].value};`;
        }
        // console.log(cookie_str);
    
        var data = {
            action: 'GET_KEYWORD',
            group_id: $('#formGetKeyword').find('[name="groupId"]').val(),
            cookie: cookie_str,
        }
        
        $.ajax({
            type: "POST",
            // url: "http://localhost/devasjeans_dev/ajax/facebook_tool/manage_group",
            url: "https://ajax.devasjeans.com/facebook_tool/manage_group",
            data: data,
            dataType: "json",
            success: function (response) {
                console.log('response: ', response);
    
                for (let i = 0; i < response.result.length; i++) {
                    const item = response.result[i];
                    if (item) {
                        var html = ``;
                        if ($('.keyword-select-all').length == 0) {
                            html = `<p><input type="checkbox" class="keyword-select-all" name="keyword" value="select_all" required> <b>เลือกทั้งหมด</b> &nbsp;<span class="error-text"></span></p>`;    
                        }
                        html += `<p><input type="checkbox" class="keyword-choice" name="keyword" value="${item}" required> ${item} &nbsp;<span class="error-text"></span></p>`;
                        
                        $(`#keyword`).find('.loading').remove();
                        $(`#keyword`).append(html);

                        $('.keyword-select-all').unbind('change').bind('change', function(e) {
                            if ($(this).is(':checked')) {
                                $('.keyword-choice').prop('checked', true).trigger('change');
                            } else {
                                $('.keyword-choice').prop('checked', false).trigger('change');
                            }
                        });

                        $('.keyword-choice').unbind('change').bind('change', function(e) {
                            // console.log($(this));
                            var this_val = $(this).val();
                            var index_keyword = keyword_selected.indexOf(this_val); 

                            if ($(this).is(':checked')) {
                                if (index_keyword == -1) {
                                    keyword_selected.push(this_val);
                                }
                            } else {
                                if (index_keyword != -1) {
                                    keyword_selected.splice(index_keyword, 1);
                                }
                            }

                            console.log(`keyword_selected: `, keyword_selected);
                        });
                    }
                }
                
            }
        });
        
    });
}

var count_post = 0;
var cursor_last = '';
$('#formGetPostByKeyword').submit(function (e) { 
    e.preventDefault();
    console.log('submit!!');

    if ($('#formGetPostByKeyword').valid() && $('#formGetKeyword').valid()) {
        if (runAgainByKeyword) {
            waitStartGetPostByKeyword();
        } else {
            beforeGetPostByKeyword();
        }
    }
});

$('#formGetPostByKeyword').validate({
    groupId: true,
    errorPlacement: function (error, element) {
        // console.log(error);
        if (element.attr("type") == "checkbox") {
            $(element).parent().find(`.error-text`).html(error);
        } else {
            error.insertAfter(element);
        }
    }
});

function beforeGetPostByKeyword() {
    runAgainLoopByKeyword();

    count_post = 0;
    cursor_last = '';

    $('#tableGetPostByKeyword').find('tbody').empty();
    
    if ($('#tableGetPostByKeyword').find('tfoot').find('.loading').length == 0) {
        $('#tableGetPostByKeyword').find('tfoot').html(
            `<tr>
                <td colspan="5" style="text-align: center;">
                    <div class="col-lg-12 loading">
                        <img src="images/loading.svg" alt="loading" style="width: 20px;">
                        <span>กำลังโหลดโพสต์</span>
                        <br>
                        <span class="countPost">0</span>
                        <br>
                        <span class="dateTimePost"></span>
                    </div>
                </td>
            </tr>`
        );   
    }

    $('#divTableGetPostByKeyword').show();
    getPostByKeyword();
}

function getPostByKeyword() {
    chrome.cookies.getAll({url: `https://www.facebook.com`}, function(cookie) {
        // console.log(`cookie: `, cookie);

        var cookie_str = ``;
        for (let i = 0; i < cookie.length; i++) {
            if (cookie_str) {
                cookie_str += ` `
            }
            cookie_str += `${cookie[i].name}=${cookie[i].value};`;
        }
        // console.log(cookie_str);
    
        var data = {
            action: 'GET_POST_BY_KEYWORD',
            group_id: $('#formGetKeyword').find('[name="groupId"]').val(),
            cookie: cookie_str,
            fb_dtsg: localStorage.getItem('fb_dtsg'),
            cursor: cursor_last,
        }
        
        $.ajax({
            type: "POST",
            // url: "http://localhost/devasjeans_dev/ajax/facebook_tool/manage_group",
            url: "https://ajax.devasjeans.com/facebook_tool/manage_group",
            data: data,
            dataType: "json",
            success: function (response) {
                console.log('response: ', response);

                if (response.result.error) {
                    return;
                }

                var response_result = JSON.parse(response.result.result.replace('for (;;);', ''));
                console.log(`response_result: `, response_result);

                // // response_result.jsmods.instances[0][2][2].cursor
                // if (response_result.jsmods) {
                //     if (response_result.jsmods.instances[0]) {
                //         if (response_result.jsmods.instances[0][2]) {
                //             if (response_result.jsmods.instances[0][2][2]) {
                //                 if (response_result.jsmods.instances[0][2][2].cursor) {
                //                     if (response_result.jsmods.instances[0][2][2].cursor != cursor_last) {
                //                         cursor_last = response_result.jsmods.instances[0][2][2].cursor;
                //                         getPostByKeyword();
                //                     }
                //                 }
                //             }
                //         }
                //     }
                // }

                var html_str = response_result.payload;
                var html = $(html_str);
                var feed = $('div[role="feed"]', html);

                // $('#pagelet_alerted_queue').find('div[role="feed"]').each(function (index, element) {
                $(feed).each(function (index, element) {
                    // element == this
                    $(element).children().each(function (index2, element2) {
                        // element == this

                        // function getPostId(url_string='') {
                        //     var url = new URL(url_string);
                        //     if (url.searchParams.get('reply_comment_id')) {
                        //         return url.searchParams.get('reply_comment_id');

                        //     } else if (url.searchParams.get('comment_id')) {
                        //         return url.searchParams.get('comment_id');

                        //     } else if (url.searchParams.get('sale_post_id')) {
                        //         return url.searchParams.get('sale_post_id');
                        //     }
                        // }
                        
                        var id_element = $(element2).attr('id');
                        var story_id = id_element.split('mall_post_').join('');
                        var url = `https://www.facebook.com${$(element2).find('.c_x6qx1e1dd').find('.fwb a').attr('href')}`;
                        var post_id = story_id.split(':')[0];
                        var keyword_detected = $(element2).find('.c_x6qx1e1dd').text();
                        var keyword_detected_clean = keyword_detected.substring(
                            keyword_detected.lastIndexOf(":") + 1, 
                            keyword_detected.lastIndexOf("\"")
                        );
                        keyword_detected_clean = keyword_detected_clean.split(' "').join('');
                        keyword_detected_clean = keyword_detected_clean.split('",').join(',');
                        var keyword_detected_arr = keyword_detected_clean.split(',');

                        var fb_name_element = $($(element2).find('.fwb')[1]).find('a[title][data-hovercard]');
                        var fullname = $(fb_name_element).attr('title');
                        var data_hovercard = $(fb_name_element).attr('data-hovercard');
                        var member_id = data_hovercard.match(/user.php\?id=([^\&]+)/)[1];

                        var timestamp_element = $(element2).find('abbr[data-utime]');
                        var data_utime = $(timestamp_element).attr('data-utime');
                        var timestamp = parseInt(data_utime) * 1000;
                        var date_time = new Date(timestamp).toLocaleString();
                        
                        var user = {
                            picture: `https://graph.facebook.com/${member_id}/picture?type=large&width=720&height=720`,
                            fullname: fullname,
                            url: `https://www.facebook.com/${member_id}`,
                        }

                        var dataObj = {
                            url: url,
                            post_id: post_id,
                            story_id: story_id,
                            keyword_detected: keyword_detected,
                            keyword_detected_arr: keyword_detected_arr,
                            timestamp: timestamp,
                            date_time: date_time,
                            user: user,
                        }
                        // console.log(dataObj);
                        count_post += 1;
                        console.log(`count_post: `, count_post);
                        $('.countPost').text(count_post);

                        for (let i = 0; i < dataObj.keyword_detected_arr.length; i++) {
                            const item = dataObj.keyword_detected_arr[i];
                            if (keyword_selected.indexOf(item) != -1) {
                                appendHtmlByKeyword(dataObj);
                                break;       
                            }   
                        }
                    });
                });

                try {
                    if (response_result.jsmods.instances[0][2][2].cursor != cursor_last) {
                        cursor_last = response_result.jsmods.instances[0][2][2].cursor;
                        getPostByKeyword();
                    } else {
                        console.log(`Finish. (1)`);
                        setTfoot();
                        checkAutoDelete();
                    }
                } catch (error) {
                    console.log(`Finish. (2)`);
                    setTfoot();
                    checkAutoDelete();
                }

                function setTfoot() {
                    $('#tableGetPostByKeyword').find('tfoot').empty();

                    if ($('#tableGetPostByKeyword').find('tbody').find('tr').length == 0) {
                        var html = 
                        `<tr>
                            <td colspan="5" style="text-align: center;">
                                <span>ไม่มีโพสต์</span>
                            </td>
                        </tr>`;
                        
                        $('#tableGetPostByKeyword').find('tfoot').html(html);
                    }
                }

                function checkAutoDelete() {
                    if ($('#autoDeletePostByKeyword').is(':checked')) {
                        console.log('Waiting 5 second for auto delete.');
                        setTimeout(() => {
                            console.log('setTimeout deleteAll click!');
                            $('#deleteAllByKeyword').click();
                        }, 5000);
                    }
                }
                
            }
        });
        
    });
}

function appendHtmlByKeyword(dataObj = {}) {
    if (dataObj) {
        var html = 
        `<tr>
            <td></td>
            <td>
                <button class="btn btn-danger deletePostByKeyword" post-id="${dataObj.post_id}" post-info="${htmlToString(JSON.stringify(dataObj))}" style="width: 40px;">ลบ</button>
            </td>
            <td>${dataObj.keyword_detected_arr.join(', ')}</td>
            <td><a href="${dataObj.url}" target="_blank">${dataObj.url}</a></td>
            <td>${dataObj.date_time}</a></td>
        </tr>`;

        $('#tableGetPostByKeyword').find('tbody').append(html);

        $('.deletePostByKeyword').unbind('click').bind('click', function(e) {
            var post_info = JSON.parse($(this).attr('post-info'));
    
            console.log(`post_info: `, post_info);
            deletePostByKeyword(post_info);
        });

        $('#deleteAllByKeyword').unbind('click').bind('click', function(e) {
            console.log('deleteAllByKeyword click!')
            $('.deletePostByKeyword').click();
        });
    }

    function htmlToString(str='') {
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }
}

function deletePostByKeyword(post_info) {

    var html = 
    `<div class="col-lg-12 loading">
        <img src="images/loading.svg" alt="loading" style="width: 12px;"></img>
    </div>`;
    $(`[post-id="${post_info.post_id}"]`).parents('td').find('.loading').remove();
    $(`[post-id="${post_info.post_id}"]`).parents('td').append(html);

    chrome.cookies.getAll({url: `https://www.facebook.com`}, function(cookie) {
        // console.log(`cookie: `, cookie);

        var cookie_str = ``;
        for (let i = 0; i < cookie.length; i++) {
            if (cookie_str) {
                cookie_str += ` `
            }
            cookie_str += `${cookie[i].name}=${cookie[i].value};`;
        }
        // console.log(cookie_str);

        var data = {
            action: 'DELETE_POST_BY_KEYWORD',
            group_id: $('#formGetKeyword').find('[name="groupId"]').val(),
            reported_id: post_info.post_id,
            story_id: post_info.story_id,
            fb_dtsg: localStorage.getItem('fb_dtsg'),
            cookie: cookie_str,
        }
        
        console.log(`data: `, data);
    
        $.ajax({
            type: "POST",
            // url: "http://localhost/devasjeans_dev/ajax/facebook_tool/manage_group",
            url: "https://ajax.devasjeans.com/facebook_tool/manage_group",
            data: data,
            dataType: "json",
            success: function (response) {
                console.log('response: ', response);

                if (response.result.error) {
                    $(`[post-id="${post_info.post_id}"]`).parents('td').find('.loading').remove();
                    $(`[post-id="${post_info.post_id}"]`).parents('td').find('.deleteFail').remove();
                    $(`[post-id="${post_info.post_id}"]`).parents('td').append(`<span class="deleteFail"><br><span style="font-size: 14px;color: red;">เกิดข้อผิดพลาด</span></span>`);
                    return;
                } else {
                    $(`[post-id="${post_info.post_id}"]`).parents('tr').remove();
                }
    
                try {
                    var result = JSON.parse(response.result.result.replace(`for (;;);`, ``));
                    console.log('result: ', result);
                } catch (error) {
                    console.log(`error: `, error);
                }
                
            }
        });
        
    });

}


// ===========================================================================================================================
// ===========================================================================================================================
// ===========================================================================================================================
// ===========================================================================================================================
// ===========================================================================================================================
// ===========================================================================================================================
// ===========================================================================================================================


// get_idfacebook_from_url();
function get_idfacebook_from_url() {

    adverra_id_extractor();
    function adverra_id_extractor() {
        text = '';
        // iziToast.info({
        //     title: 'รอสักครู่',
        //     position: 'topCenter',
        //     timeout: 2000,
        //     message: 'กำลังเช็ค ID...',
        // });


        // original_url = $('#adverra_id_extractor_url').val();
        // original_url = `https://www.facebook.com/DevasBrightmoon/videos/171934840819450/?v=171934840819450`;
        // original_url = `https://www.facebook.com/pg/ETD.ERRORTODAY`;
        original_url = `https://www.facebook.com/groups/dmts.g/permalink/2177334155612192/`;
        url = original_url;
        var url_process = url.match(/([a-z]+\:\/+)([^\/\s]*)([a-z0-9\-@\^=%&;\/~\+]*)[\?]?([^ \#]*)#?([^ \#]*)/ig);
        if (url_process) {

            url = url.replace("https\:\/\/", "").replace("http\:\/\/", "").replace("\:\/\/", "");
            url = url.split("\/");
            if (url[0].match(".facebook.com")) {
                if (url[1].split("?")) {
                    if (url[1] && url[1] != "") {


                        /////////////////////////////////////////	 
                        var url_array_collect = [];
                        for (temp_var = 1; url[temp_var]; temp_var++) {
                            console.log("url[" + temp_var + "]=" + url[temp_var].split("\?")[0]);
                            if (url[temp_var].split("\?")[0] && url[temp_var].split("\?")[0] != "") {
                                url_array_collect.push(url[temp_var].split("\?")[0]);
                            }
                            if (url[temp_var].split("\?")[1] && url[temp_var].split("\?")[1] != "") {
                                var location_search = "\?" + url[temp_var].split("\?")[1];
                            }
                        }


                        var post_id = getParam('fbid', location_search);

                        var set = getParam('set', location_search);
                        var story_fbid = getParam('story_fbid', location_search);
                        var account_id = getParam('id', location_search);
                        //to detect facebook notes
                        if (url[1] == "notes") {
                            if (!isNaN(url[4])) {
                                title = "Note ID";
                                console.log(title + "=" + url[4]);
                                append_html_code(title, url[4]);
                            }
                            if (!isNaN(url[3])) {
                                title = "Note ID";
                                console.log(title + "=" + url[3]);
                                append_html_code(title, url[3]);
                            }
                        }
                        if (account_id) {
                            if (!isNaN(account_id)) {
                                title = "Account ID";
                                console.log(title + "=" + account_id);
                                append_html_code(title, account_id);
                            }
                        }
                        if (story_fbid) {
                            if (!isNaN(story_fbid)) {
                                title = "Post ID";
                                console.log(title + "=" + story_fbid);
                                append_html_code(title, story_fbid);
                            }
                        }
                        if (post_id != "") {
                            var photo_post_id = post_id;
                            if (!isNaN(photo_post_id)) {
                                title = "Post ID/Photo ID:";
                                types = '2';
                            }
                            append_html_code(title, photo_post_id);
                        }
                        if (set) {
                            set = set.split(".");
                            if (set) {
                                var account_id = set[3];
                                if (!isNaN(account_id)) {
                                    title = "Account ID:";
                                    console.log(title + "=" + account_id);
                                    append_html_code(title, account_id);
                                }
                            }
                        }
                        //extract account id from https://www.facebook.com/profile.php?id=100009125604149
                        if (original_url.match("profile\.php")) { }
                        if (original_url.match("\/photos\/")) {
                            splited = original_url.split("/");
                            photo_id = splited[splited.length - 2];
                            if (!isNaN(photo_id)) {
                                title = "Photo ID:";
                                console.log(title + "=" + photo_id);
                                append_html_code(title, photo_id);
                            }
                        }
                        console.log(url_array_collect);
                        extraction_process_url_params(url_array_collect);






                        /////////////////////////	 



                    }
                    else {


                        console.log('เกิดข้อผิดพลาด', 'ไม่สามารถดึง ID กรุณากรอก URL อื่น', 'error');


                    }
                }
            }
            else {

                console.log('เกิดข้อผิดพลาด', 'URL ที่ใส่ ต้องเป็น URL ของ Facebook', 'error');
            }
        }
        else {

            console.log('นี่ไม่ใช่ URL ', 'กรุณากรอก URL ของ Facebook', 'error');

        }


    }







    function extract_page_id(page_id) {
        if (!isNaN(page_id)) {
            console.log("page id=" + page_id);
            title = "Page id:";
            append_html_code(title, page_id);
        } else {
            alert("URL is tampered.");
        }
    }
    function extract_post_id(post_id) {
        if (!isNaN(post_id)) {
            console.log("post_id=" + post_id);
            title = "Post id:";
            append_html_code(title, post_id);
        } else {
            alert("URL is tampered.");
        }
    }
    function event_post_id_append(post_id) {
        if (!isNaN(post_id)) {
            console.log("event_post_id=" + post_id);
            title = "Event post id:";
            append_html_code(title, post_id);
        } else {
            alert("URL is tampered.");
        }
    }
    function group_post_id_append(post_id) {
        if (!isNaN(post_id)) {
            console.log("group_post_id=" + post_id);
            title = "Group post id:";
            append_html_code(title, post_id);
        } else {
            alert("URL is tampered.");
        }
    }
    function id_extract_event(account_username) {
        if (!isNaN(account_username)) {
            console.log("Event id is:" + account_username);
            title = "Event ID:";
            append_html_code(title, account_username);
        } else {
            alert("URL is tampered.");
        }
    }
    function extract_video_id(video_id) {
        if (!isNaN(video_id)) {
            console.log("video id is=" + video_id);
            title = "Post ID/ Video id:";
            append_html_code(title, video_id);
        }
    }
    function id_extract_group(account_username) {

        if (isNaN(account_username)) {
            pageurl = "https://mbasic.facebook.com/groups/" + account_username;
            dinesh = new XMLHttpRequest();
            dinesh.open("GET", pageurl, true);
            dinesh.onreadystatechange = function () {
                console.log(`dinesh.readyState: `, dinesh.readyState);
                console.log(`dinesh.status: `, dinesh.status);
                if (dinesh.readyState == 4 && dinesh.status == 200) {
                    var responsa = dinesh.responseText.match(/\/groups\/\d+/g)[0];
                    responsa = responsa.replace("\/groups\/", "");
                    title = "Group ID:";
                    console.log(title + responsa);
                    append_html_code(title, responsa);
                }
            }
            dinesh.send();
        } else {
            title = "Group ID:";
            console.log(title + account_username);
            append_html_code(title, account_username);
        }
    }





    function append_html_code(title, id) {
        title = '<b style="font-size:20px;font-weight:bold">' + title;
        text = text + '<p>' + title + '<input class="copytext' + id + '" type="text" value="' + id + '" style="font-size:30px; text-align:center;width:90%;"  ><a datashow="copytext' + id + '" class="copyto btn-floating mb-1 btn-flat waves-effect waves-light pink accent-2 white-text">  <i class="material-icons">content_copy</i></a><p></b>';

        console.log({
            title: 'Copy ตัวเลขไปใช้ได้เลยค่ะ',
            type: 'success',
            html: text,
        })
        // iziToast.success({
        //     title: 'เรียบร้อย',
        //     position: 'topCenter',
        //     timeout: 3000,
        //     message: 'พบ ID แล้ว Copy ไปใช้ได้เลย',
        // });
    }






    function extraction_process_url_params(url_array_collect) {
        console.log(url_array_collect);


        if (url_array_collect[2]) {
            if (url_array_collect[2] == "permalink") {
                if (url_array_collect[0] == "groups") {
                    id_extract_group(url_array_collect[1]);
                    if (!isNaN(url_array_collect[3])) {
                        group_post_id_append(url_array_collect[3]);
                    }
                }
                if (url_array_collect[0] == "events") {
                    id_extract_event(url_array_collect[1]);
                    if (!isNaN(url_array_collect[3])) {
                        event_post_id_append(url_array_collect[3]);
                    }
                }
            }
            if (url_array_collect[1] == "videos") {
                extract_video_id(url_array_collect[2]);
            }
            if (url_array_collect[0] == "pages") {
                if (!isNaN(url_array_collect[2])) {
                    extract_page_id(url_array_collect[2]);
                }
            }
            if (url_array_collect[1] == "posts") {
                if (url_array_collect[0]) {
                    id_extract_account(url_array_collect[0]);
                }
                if (!isNaN(url_array_collect[2])) {
                    extract_post_id(url_array_collect[2]);
                }
            } else {
                id_extract_account(url_array_collect[0]);
            }
        } else {
            if (url_array_collect[1]) {
                if (url_array_collect[0] == "groups") {
                    id_extract_group(url_array_collect[1]);
                }
                if (url_array_collect[0] == "events") {
                    id_extract_event(url_array_collect[1]);
                }
                if (url_array_collect[0] == "pg") {
                    id_extract_account(url_array_collect[1]);
                }
            } else {
                id_extract_account(url_array_collect[0]);
            }
        }
    }









    function id_extract_account(account_username) {

        function error_msgs() {
            //toastr.error("Unable to retrieve account ID");
        }

        if (isNaN(account_username)) {
            responsa = '';
            pageurl = "https://m.facebook.com/" + account_username + "";

            dinesh = new XMLHttpRequest();
            dinesh.open("GET", pageurl, true);
            dinesh.onreadystatechange = function () {
                if (dinesh.readyState == 4 && dinesh.status == 200) {
                    var responsa = dinesh.responseText;
                    responsa = responsa.replace(/&quot;/g, '"');
                    if (responsa.match(/"profile_id":\d+/g)) {

                        var last_array = (responce_id = responsa.match(/"profile_id":\d+/g).length - 1);

                        var responce_id = responsa.match(/"profile_id":\d+/g)[last_array];
                        responce_id = responce_id.replace('"profile_id":', "");
                        if (!isNaN(responce_id)) {
                            title = "Account ID:";
                            console.log(title + "=" + responce_id);
                            append_html_code(title, responce_id);


                        } else {
                            error_msgs();
                        }
                    }

                    else

                        if (responsa.match(/page_id:\"\d+/g)) {

                            var last_array = responsa.match(/page_id:\"\d+/g)[0];
                            responce_id = last_array.replace('page_id:\"', "");
                            if (!isNaN(responce_id)) {
                                title = "Page ID:";
                                console.log(title + responce_id);
                                append_html_code(title, responce_id);


                            } else {
                                error_msgs();
                            }
                        }




                }
            }
            dinesh.send();
        } else {
            alert("account id is:" + responsa.id);
            //document.getElementById("fst789_id_extractor_result").innerText = account_username;
        }
    }









    function getParam(sname, location_search) {
        if (location_search && sname) {

            var params = location_search.substr(location_search.indexOf("?") + 1);
            var sval = "";
            params = params.split("&");
            // split param and value into individual pieces
            for (var i = 0; i < params.length; i++) {
                temp = params[i].split("=");
                if ([temp[0]] == sname) { sval = temp[1]; }
            }

            return sval;
        } else {
            return '';
        }
    }

}