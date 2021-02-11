function section_group_delete_report() {

    var runAgain = false;
    var runAgainInterval;
    var timeStartGetPostInterval;

    $(`[name="runAgainReport"]`).change(function (e) { 
        e.preventDefault();
        console.log($(this).is(':checked'));
        if ($(this).is(':checked')) {
            runAgain = true;
            $('[name="timeRunAgainReport"]').prop(`disabled`, false);
            $('[name="timeStartGetReport"]').prop(`disabled`, false);
        } else {
            runAgain = false;
            $('[name="timeRunAgainReport"]').prop(`disabled`, true);
            $('[name="timeStartGetReport"]').prop(`disabled`, true);
        }
    });

    var checkCountUserReport = false;
    $(`[name="checkCountUserReport"]`).change(function (e) { 
        e.preventDefault();
        console.log($(this).is(':checked'));
        if ($(this).is(':checked')) {
            checkCountUserReport = true;
            $('[name="numCountUserReport"]').prop(`disabled`, false);
        } else {
            checkCountUserReport = false;
            $('[name="numCountUserReport"]').prop(`disabled`, true);
        }
    });
    
    function runAgainLoop() {
        clearInterval(runAgainInterval);
        if (!runAgain) {
            return;
        }
        var timeRunAgain = $('[name="timeRunAgainReport"]').val();
        // var timeRunAgainSecond = timeRunAgain * 3600000; // hour
        var timeRunAgainSecond = timeRunAgain * 60000; // minute
        runAgainInterval = setInterval(() => {
            console.log(`Run Again`);
            beforeGetReport();
        }, timeRunAgainSecond);
    }

    function waitStartGetPost() {
        console.log(`waitStartGetPost`);
        clearInterval(timeStartGetPostInterval);
        if (!runAgain) {
            return;
        }
        var timeStartGetPost = $('[name="timeStartGetReport"]').val();
        timeStartGetPostInterval = setInterval(() => {
    
            var date_time = new Date().toString();
            if (Date.parse(date_time) >= Date.parse(timeStartGetPost)) {
                beforeGetReport();
                clearInterval(timeStartGetPostInterval);
            }
    
        }, 1000);
    }

    var count_post = 0;
    var cursor_last = '';
    $('#formGetReport').submit(function (e) { 
        e.preventDefault();
        console.log('submit!!');
    
        if ($('#formGetReport').valid()) {
            if (runAgain) {
                waitStartGetPost();
            } else {
                beforeGetReport();
            }
        }
    });
    
    $('#formGetReport').validate({
        groupId: true,
    });
    
    function beforeGetReport() {
        runAgainLoop();
    
        count_post = 0;
        cursor_last = '';
    
        $('#tableGetReport').find('tbody').empty();
        
        if ($('#tableGetReport').find('tfoot').find('.loading').length == 0) {
            $('#tableGetReport').find('tfoot').html(
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
    
        $('#divTableGetReport').show();
        getReport();
    }

    function getReport() {
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
                action: 'GET_REPORT',
                group_id: $('#formGetReport').find('[name="groupId"]').val(),
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
                    // console.log(`response_result.payload: `, response_result.payload);
    
                    var html_str = response_result.payload;
                    var html = $(html_str);
                    var feed = $('div[role="feed"]', html);
    
                    $(feed).each(function (index, element) {
                        // element == this
                        $(element).children().each(function (index2, element2) {
                            // element == this

                            var user_report_list = [];
                            var simple_user_report_element = $(element2).find('div[class=""]').find('.profileLink[data-hovercard-prefer-more-content-show]');
                            var count_user_report = $(simple_user_report_element).length;

                            $(simple_user_report_element).each(function (index3, element3) {
                                // element == this
                                var fullname = $(element3).text();
                                var data_hovercard = $(element3).attr('data-hovercard');
                                var id = data_hovercard.match(/user.php\?id=([^\&]+)/)[1];

                                user_report_list.push({
                                    fullname: fullname,
                                    id: id,
                                });
                            });
                            
                            var count_user_report_element = $(element2).find('[data-tooltip-content][data-tooltip-position]');
                            if (count_user_report_element.length > 0) {
                                var count_user_report_full_text = $(count_user_report_element).text();
                                var count_user_report_split_number = count_user_report_full_text.replace(/^\D+/g, '').split(' ');
    
                                if (count_user_report_split_number.length > 0) {
                                    count_user_report += parseInt(count_user_report_split_number[0].replace(',', ''));
                                }

                                var ajaxify = $(count_user_report_element).attr('ajaxify');
                                var q = getUrlParam(`https://www.facebook.com${ajaxify}`, `q`);
                                var data = {
                                    action: 'GET_USER_REPORT_LIST',
                                    q: q,
                                    cookie: cookie_str,
                                    fb_dtsg: localStorage.getItem('fb_dtsg'),
                                }
                                
                                $.ajax({
                                    type: "POST",
                                    // url: "http://localhost/devasjeans_dev/ajax/facebook_tool/manage_group",
                                    url: "https://ajax.devasjeans.com/facebook_tool/manage_group",
                                    data: data,
                                    dataType: "json",
                                    success: function (response2) {
                                        console.log('response2: ', response2);
                        
                                        if (response2.result.error) {
                                            return;
                                        }
                        
                                        var response2_result = JSON.parse(response2.result.result.replace('for (;;);', ''));
                                        console.log(`response2_result: `, response2_result);

                                        var html_str2 = '';
                                        try {
                                            var html_str2 = response2_result.jsmods.markup[0][1].__html;
                                        } catch (error) {
                                            console.log(`error: `, error);
                                        }
                                        
                                        if (html_str2) {
                                            var html2 = $(html_str2);
                                            var feed2 = $('.fbProfileBrowser', html2);
                                            
                                            // var fullname_element = $(feed2).find('.fbProfileBrowserListItem').find('.uiProfileBlockContent').find('[data-gt][data-hovercard]');
                                            var fullname_element = $(feed2).find('.fbProfileBrowserListItem').find('[data-gt][data-hovercard]');

                                            $(fullname_element).each(function (index3, element3) {
                                                // element == this
                                                var fullname = $(element3).text();
                                                var data_gt = JSON.parse($(element3).attr('data-gt'));
                                                var id = data_gt.engagement.eng_tid;
    
                                                user_report_list.push({
                                                    fullname: fullname,
                                                    id: id,
                                                }); 
                                            });
                                        }

                                        afterGetUserReportList();
                                    }
                                });
                                
                            } else {
                                afterGetUserReportList();
                            }

                            function afterGetUserReportList() {
                                
                                console.log(`count_user_report_element: `, count_user_report_element);
                                console.log(`count_user_report_full_text: `, count_user_report_full_text);
                                console.log(`count_user_report_split_number: `, count_user_report_split_number);
                                console.log(`count_user_report: `, count_user_report);
                                console.log(`user_report_list: `, user_report_list);
    
                                var id_element = $(element2).attr('id');
                                var story_id = id_element.split('mall_post_').join('');
                                var post_id = story_id.split(':')[0];
                                // var url = `https://www.facebook.com${$(element2).find('.w_bg84s64wl').find('.fwb a[data-ft]').attr('href')}`;
                                var url = `https://www.facebook.com${$(element2).find('.fwb a[data-ft]').attr('href')}`;
        
                                console.log(`id_element: `, id_element);
                                console.log(`story_id: `, story_id);
                                console.log(`url: `, url);
                                console.log(`post_id: `, post_id);
                                
                                var fb_name_element = $(element2).find('.fcg .fwb').find('a[title][data-hovercard]');
                                var fullname = '';
                                var data_hovercard = '';
                                var member_id = '';
                                var user = {
                                    picture: ``,
                                    fullname: ``,
                                    url: ``,
                                }
                                if ($(fb_name_element).length > 0) {
                                    fullname = $(fb_name_element).attr('title');
                                    data_hovercard = $(fb_name_element).attr('data-hovercard');
                                    member_id = data_hovercard.match(/user.php\?id=([^\&]+)/)[1];
                                    
                                    user = {
                                        id: member_id,
                                        picture: `https://graph.facebook.com/${member_id}/picture?type=large&width=720&height=720`,
                                        fullname: fullname,
                                        url: `https://www.facebook.com/${member_id}`,
                                    }
    
                                } else {
                                    fb_name_element = $(element2).find('.fwb.fcg[data-ft] span[title]');
                                    fullname = $(fb_name_element).attr('title');
                                }
                                
                                var timestamp_element = $(element2).find('abbr[data-utime]');
                                var data_utime = $(timestamp_element).attr('data-utime');
                                var timestamp = parseInt(data_utime) * 1000;
                                var date_time = new Date(timestamp).toLocaleString();
        
                                var delete_btn_element = $($(element2).find('._2xw3 ._51xa').children('[role="button"][ajaxify]')[1]);
                                var delete_btn_ajaxify = $(delete_btn_element).attr('ajaxify');
                                var source = getUrlParam(`https://www.facebook.com${delete_btn_ajaxify}`, 'source');
        
                                var dataObj = {
                                    url: url,
                                    post_id: post_id,
                                    story_id: story_id,
                                    timestamp: timestamp,
                                    date_time: date_time,
                                    source: source,
                                    user: user,
                                    count_user_report: count_user_report,
                                    user_report_list: user_report_list,
                                }
                                console.log(`dataObj: `, dataObj);
                                count_post += 1;
                                console.log(`count_post: `, count_post);
                                $('.countPost').text(count_post);
    
                                if (checkCountUserReport) {
                                    var numCountUserReport = parseInt($('[name="numCountUserReport"]').val());

                                    var user_allow_report = [
                                        {
                                            fullname: "Weerayut V Khaichuay",
                                            id: "100013375692638"
                                        },
                                        {
                                            fullname: "Korndanai Ruangtragool",
                                            id: "100001081922378"
                                        },
                                        {
                                            fullname: "นอนคือไีร ไร้สาระ",
                                            id: "100003225051931"
                                        },
                                        // {
                                        //     fullname: "Liw Saki",
                                        //     id: "100012608053161"
                                        // },
                                    ];

                                    var hasUserAllowReport = false;
                                    dataObj.user_report_list.forEach(item_user_report_list => {
                                        for (let i = 0; i < user_allow_report.length; i++) {
                                            if (item_user_report_list.id == user_allow_report[i].id) {
                                                hasUserAllowReport = true;
                                                break;
                                            }
                                        }

                                        if (hasUserAllowReport) {
                                            return;
                                        }
                                    });

                                    if (dataObj.count_user_report >= numCountUserReport || hasUserAllowReport) {
                                        appendHtml(dataObj);
                                    }

                                } else {
                                    appendHtml(dataObj);
                                }
                            }
                            
                            function getUrlParam(url_string='', param='') {
                                var url = new URL(url_string);
                                return url.searchParams.get(param);
                            }
                        });
                    });

                    try {
                        var cursor_new = response_result.jsmods.instances[0][2][2].cursor;
                        console.log(`cursor_new: `, cursor_new);
                        if ((cursor_new) && cursor_new != cursor_last) {
                            cursor_last = cursor_new;
                            getReport();
                        } else {
                            console.log(`Finish. (1)`);
                            setTfoot();
                            checkAutoDelete();
                        }   
                    } catch (error) {
                        console.log(`error: `, error);

                        console.log(`Finish. (2)`);
                        setTfoot();
                        checkAutoDelete();
                    }
    
                    function setTfoot() {
                        $('#tableGetReport').find('tfoot').empty();
    
                        if ($('#tableGetReport').find('tbody').find('tr').length == 0) {
                            var html = 
                            `<tr>
                                <td colspan="5" style="text-align: center;">
                                    <span>ไม่มีโพสต์</span>
                                </td>
                            </tr>`;
                            
                            $('#tableGetReport').find('tfoot').html(html);
                        }
                    }
    
                    function checkAutoDelete() {
                        if ($('#autoDeleteReport').is(':checked')) {
                            console.log('Waiting 5 second for auto delete.');
                            setTimeout(() => {
                                console.log('setTimeout deleteAll click!');
                                $('#deleteAllReport').click();
                            }, 5000);
                        }
                    }
                }
            });
            
        });
    }

    function appendHtml(dataObj = {}) {
        if (dataObj) {
            var html = 
            `<tr>
                <td></td>
                <td>
                    <button class="btn btn-danger deleteReport" post-id="${dataObj.post_id}" post-info="${htmlToString(JSON.stringify(dataObj))}" style="width: 40px;">ลบ</button>
                </td>
                <td><a href="${dataObj.user.url}" target="_blank" style="color: #385898"><b>${dataObj.user.fullname}</b></a></td>
                <td><a href="${dataObj.url}" target="_blank">${dataObj.url}</a></td>
                <td>${dataObj.date_time}</a></td>
            </tr>`;
    
            $('#tableGetReport').find('tbody').append(html);
    
            $('.deleteReport').unbind('click').bind('click', function(e) {
                var post_info = JSON.parse($(this).attr('post-info'));
        
                console.log(`post_info: `, post_info);
                deleteReport(post_info);
            });
    
            $('#deleteAllReport').unbind('click').bind('click', function(e) {
                console.log('deleteAllReport click!');
                $('.deleteReport').click();
            });
        }
    
        function htmlToString(str='') {
            return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        }
    }

    function deleteReport(post_info) {

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

            checkJoinGroupDate();
            function checkJoinGroupDate() {
                var data = {
                    action: 'SEARCH_MEMBER_GROUP',
                    fb_dtsg: localStorage.getItem('fb_dtsg'),
                    group_id: $('#formGetReport').find('[name="groupId"]').val(),
                    search_keyword: post_info.user.fullname,
                    // search_keyword: ' ',
                    cookie: cookie_str,
                    user: post_info.user,
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

                        var result;
                        try {
                            var result = JSON.parse(response.result.result.replace(`for (;;);`, ``));
                            console.log('result: ', result);
                            
                        } catch (error) {
                            console.log(`error: `, error);
                        }

                        if (result) {
                            var html_str = result.domops[0][3].__html;
                            var html = $(html_str);
                            var uiList = $('.uiList', html);

                            // console.log(`html_str: `, html_str);
                            // console.log(`html: `, html);
                            // console.log(`uiList: `, uiList);
                            // console.log(`$(uiList).children(): `, $(uiList).children());
            
                            $(uiList).children().each(function (index, element) {
                                // element == this
                                var id = $(element).attr('id');
                                var user_id = id.split('_')[1];
                                var user_fullname = $(element).find('.lfloat[title]').attr('title');
                                var timestamp_element = $(element).find('.timestamp');
                                var data_utime = parseInt($(timestamp_element).attr('data-utime'));
                                var join_group_date = data_utime * 1000;
                                // var join_group_date = Date.parse("2020-01-08T02:30:35.000Z");

                                console.log(`timestamp_element: `, timestamp_element);
                                console.log(`data_utime: `, data_utime);
                                console.log(`join_group_date: `, join_group_date);
                                console.log(`user_id: `, user_id);
                                console.log(`user_fullname: `, user_fullname);

                                console.log(`checkPastDate: `, checkPastDate(join_group_date));
                                console.log(`===============`);

                                // post_info.user.join_group_date = join_group_date;

                                if (user_id == response.POST.user.id) {
                                    post_info.user.join_group_date = join_group_date;
                                }
                            });
                        }

                        console.log(`post_info: `, post_info);
                        deleteReport();

                    }
                });
            }

            function deleteReport() {

                var data = {};

                if (post_info.user.join_group_date && checkPastDate(post_info.user.join_group_date).day <= 30) {
                    data = {
                        action: 'DELETE_MEMBER_AND_POST_7DAY',
                        group_id: $('#formGetReport').find('[name="groupId"]').val(),
                        post_id: post_info.post_id,
                        removing_user_id: post_info.user.id,
                        fb_dtsg: localStorage.getItem('fb_dtsg'),
                        cookie: cookie_str,
                    }
                } else {
                    data = {
                        action: 'DELETE_REPORT',
                        group_id: $('#formGetReport').find('[name="groupId"]').val(),
                        reported_id: post_info.post_id,
                        story_id: post_info.story_id,
                        source: post_info.source,
                        fb_dtsg: localStorage.getItem('fb_dtsg'),
                        cookie: cookie_str,
                    }
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
            }
            
        });
    
    }

    function checkPastDate(time) {
        var date1 = new Date(time);
        var date2 = new Date();
        var diffTime = Math.abs(date2 - date1);
        var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return {
            second: diffTime,
            day: diffDays,
        }
    }

}