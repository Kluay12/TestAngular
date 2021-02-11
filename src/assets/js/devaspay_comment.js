function section_devaspay_comment() {

    function addZero(num) {
        return (num >= 10) ? `${num}` : `0${num}`;
    }

    function setDateStartFB(dateParam) {
        if (!dateParam) {
            return;
        }

        var date_time = new Date(new Date(dateParam).setSeconds('00')).toString();
        var date_time_ISO = new Date(date_time).toISOString();
        var data_date_time = {
            date_time: date_time,
            date_time_ISO: date_time_ISO,
            date_time_fb: date_time_ISO.replace('.000Z', '+0000'),
        }
        return data_date_time;
    }

    function setDateEndFB(dateParam) {
        if (!dateParam) {
            return;
        }

        var date_time = new Date(new Date(dateParam).setSeconds('59')).toString();
        var date_time_ISO = new Date(date_time).toISOString();
        var data_date_time = {
            date_time: date_time,
            date_time_ISO: date_time_ISO,
            date_time_fb: date_time_ISO.replace('.000Z', '+0000'),
        }
        return data_date_time;
    }

    function fomatDateTimeFB(dateParam) {
        if (!dateParam) {
            return;
        }
        var date_time_ISO = new Date(dateParam).toISOString();
        // var date_time_FB = date_time_ISO.replace('.000Z', '+0000');
        return date_time_ISO;
    }

    function changeDateTime(changeDT) {
        var date_time = new Date(changeDT.date_time);

        if (changeDT.year) {
            switch (changeDT.year.type) {
                case 'add':
                    date_time.setFullYear(date_time.getFullYear() + changeDT.year.amout);
                    break;
                case 'cut':
                    date_time.setFullYear(date_time.getFullYear() - changeDT.year.amout);
                    break;
            }
        }

        if (changeDT.month) {
            switch (changeDT.month.type) {
                case 'add':
                    date_time.setMonth(date_time.getMonth() + changeDT.month.amout);
                    break;
                case 'cut':
                    date_time.setMonth(date_time.getMonth() - changeDT.month.amout);
                    break;
            }
        }

        if (changeDT.date) {
            switch (changeDT.date.type) {
                case 'add':
                    date_time.setDate(date_time.getDate() + changeDT.date.amout);
                    break;
                case 'cut':
                    date_time.setDate(date_time.getDate() - changeDT.date.amout);
                    break;
            }
        }

        if (changeDT.hours) {
            switch (changeDT.hours.type) {
                case 'add':
                    date_time.setHours(date_time.getHours() + changeDT.hours.amout);
                    break;
                case 'cut':
                    date_time.setHours(date_time.getHours() - changeDT.hours.amout);
                    break;
            }
        }

        if (changeDT.minutes) {
            switch (changeDT.minutes.type) {
                case 'add':
                    date_time.setMinutes(date_time.getMinutes() + changeDT.minutes.amout);
                    break;
                case 'cut':
                    date_time.setMinutes(date_time.getMinutes() - changeDT.minutes.amout);
                    break;
            }
        }

        if (changeDT.seconds) {
            switch (changeDT.seconds.type) {
                case 'add':
                    date_time.setSeconds(date_time.getSeconds() + changeDT.seconds.amout);
                    break;
                case 'cut':
                    date_time.setSeconds(date_time.getSeconds() - changeDT.seconds.amout);
                    break;
            }
        }

        if (changeDT.milliseconds) {
            switch (changeDT.milliseconds.type) {
                case 'add':
                    date_time.setMilliseconds(date_time.getMilliseconds() + changeDT.milliseconds.amout);
                    break;
                case 'cut':
                    date_time.setMilliseconds(date_time.getMilliseconds() - changeDT.milliseconds.amout);
                    break;
            }
        }

        return date_time.toString();
    }

    var countGetPost = 0;
    var countRespondPost = 0;
    var countPost = 0;
    var postType = [];
    var runAgain = false;
    var runAgainInterval;
    var timeStartGetPostInterval;
    var dateStart;
    var dateEnd;

    var comment_post_pending = false;


    $(`[name="runAgain"]:visible`).change(function (e) { 
        e.preventDefault();
        console.log($(this).is(':checked'));
        if ($(this).is(':checked')) {
            runAgain = true;
            $('[name="timeRunAgain"]:visible').prop(`disabled`, false);
            $('[name="timeStartGetPost"]:visible').prop(`disabled`, false);
        } else {
            runAgain = false;
            $('[name="timeRunAgain"]:visible').prop(`disabled`, true);
            $('[name="timeStartGetPost"]:visible').prop(`disabled`, true);
        }
    });

    // $(`#test`).click(function (e) { 
    //     e.preventDefault();
    //     console.log(`click`);

    //     // var group_id = "760208803991408"
    //     var post_id = "3531390233539904";
    //     commentPost(post_id);
    // });

    setInputAuto();
    function setInputAuto() {

        function getRndInteger(min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
        }

        var groupId = `760208803991408`;
        var timeRunAgainAuto = getRndInteger(10, 10);
        var time_now = new Date();
        var y = new Date(time_now).getFullYear();
        var m = new Date(time_now).getMonth() + 1;
        var d = new Date(time_now).getDate();
        var hh = new Date(time_now).getHours();
        var mm = new Date(time_now).getMinutes();

        var dateEnd_auto = `${y}-${addZero(m)}-${addZero(d)}T${addZero(hh)}:${addZero(mm)}`;

        time_now = new Date(time_now).setMinutes(new Date(time_now).getMinutes()-timeRunAgainAuto);
        y = new Date(time_now).getFullYear();
        m = new Date(time_now).getMonth() + 1;
        d = new Date(time_now).getDate();
        hh = new Date(time_now).getHours();
        mm = new Date(time_now).getMinutes();

        var dateStart_auto = `${y}-${addZero(m)}-${addZero(d)}T${addZero(hh)}:${addZero(mm)}`;
        
        $(`[name="dateStart"]:visible`).val(dateStart_auto).trigger('change');
        $(`[name="dateEnd"]:visible`).val(dateEnd_auto).trigger('change');
        $(`[name="groupId"]:visible`).val(groupId).trigger('change');
        $(`[name="runAgain"]:visible`).prop('checked', true).trigger('change');
        $(`[name="timeRunAgain"]:visible`).val(timeRunAgainAuto).trigger('change');
        $(`[name="timeStartGetPost"]:visible`).val(dateEnd_auto).trigger('change');

        setTimeout(() => {
            $('.getPosts:visible').click();
        }, 3000);
    }

    function commentPost(post_id) {

        comment_post_pending = true;

        var fb_dtsg = localStorage.getItem('fb_dtsg');
        var time_now = new Date();
        var y = new Date(time_now).getFullYear();
        var m = new Date(time_now).getMonth() + 1;
        var d = new Date(time_now).getDate();
        var hh = new Date(time_now).getHours();
        var mm = new Date(time_now).getMinutes();

        var ref = `${y}${addZero(m)}${addZero(d)}${addZero(hh)}${addZero(mm)}`;

        // var message = `ประกาศจากข้อความอัตโนมัติ: กรุณาแอดไลน์ @devaspay (มี @) เพื่อขอลิงค์ลงทะเบียน ผู้ขาย ผู้ซื้อ ในแอพ Deva's Pay (ตัวกลางฟรี ง่าย ดี ไม่มีค่าธรรมเนียม) ให้เรียบร้อย`;
        // var message = `Android / iOS / PC สามารถลงทะเบียนได้แล้ว : กรุณาแอดไลน์ @devaspay (มี @) เพื่อขอลิงค์ลงทะเบียน สมาชิก / ผู้ขาย / ผู้ซื้อ ในแอพ Deva's Pay (ตัวกลางฟรี ง่าย ดี ไม่มีค่าธรรมเนียม) / ให้เรียบร้อย / เมื่อได้ QR Code แล้ว ให้นำรูปมาแนบในการทำกิจกรรมทุกครั้ง / *ประกาศจากข้อความอัตโนมัติ`;
        var message = `ให้อัพเดตหน้า QR ใหม่ เพื่อแสดง : Level + สถานะ ของผู้ใช้งานแบบ เรียลไทม์ และให้นำมาใช้พร้อมกับการโพสต์ทุกครั้ง // ใครยังไม่มี แอดไลน์ @devaspay (มี@) เพื่อขอลิงค์ดาวน์โหลด // (ข้อความจากระบบอัตโนมัติ)`;

        var form = new FormData();
        form.append("ft_ent_identifier", post_id);
        form.append("comment_text", message);
        form.append("source", "1");
        form.append("client_id", "1");
        form.append("av", "508651332517533");
        form.append("__a", "1");
        form.append("fb_dtsg", fb_dtsg);

        var settings = {
            "url": "https://www.facebook.com/ufi/add/comment/",
            "method": "POST",
            "timeout": 0,
            "processData": false,
            "mimeType": "multipart/form-data",
            "contentType": false,
            "data": form
        };

        $.ajax(settings).done(function (response) {

            try {
             
                response = response.replace(`for (;;);`, ``);
                response_json = JSON.parse(response);
                console.log(response_json);

                if (!response_json.error) {

                    var post_id_comment_finish = response_json.jsmods.require[1][3][1].comments[0].ftentidentifier;
                    var post_id_comment_finish_localstorage = localStorage.getItem(`post_id_comment_finish`);

                    if (post_id_comment_finish_localstorage) {
                        var post_id_comment_finish_localstorage_json = JSON.parse(post_id_comment_finish_localstorage);
                        post_id_comment_finish_localstorage_json.push(post_id_comment_finish);

                        if (post_id_comment_finish_localstorage_json.length == 500) {
                            post_id_comment_finish_localstorage_json.splice(0, 1);
                        }

                        localStorage.setItem(`post_id_comment_finish`, JSON.stringify(post_id_comment_finish_localstorage_json));

                    } else {
                        var post_id_comment_finish_localstorage_json = [post_id_comment_finish];
                        localStorage.setItem(`post_id_comment_finish`, JSON.stringify(post_id_comment_finish_localstorage_json));
                    }

                    // =================================

                    var comment_id = response_json.jsmods.require[1][3][1].comments[0].id;
                    var url_comment = `https://www.facebook.com/${comment_id}`;
                    console.log(`url_comment: `, url_comment);

                    var comment_finish_localstorage = localStorage.getItem(`comment_finish`);

                    if (comment_finish_localstorage) {
                        var comment_finish_localstorage_json = JSON.parse(comment_finish_localstorage);
                        comment_finish_localstorage_json.push(comment_id);

                        if (comment_finish_localstorage_json.length == 500) {
                            comment_finish_localstorage_json.splice(0, 1);
                        }

                        localStorage.setItem(`comment_finish`, JSON.stringify(comment_finish_localstorage_json));

                    } else {
                        var comment_finish_localstorage_json = [comment_id];
                        localStorage.setItem(`comment_finish`, JSON.stringify(comment_finish_localstorage_json));
                    }
                    
                }
  
            } catch (error) {
                console.log(`error: `, error);
            }
            
        });

        // ==========================================================================

        var form = new FormData();
        form.append("ft_ent_identifier", post_id);
        form.append("reaction_type", "1");
        form.append("source", "1");
        form.append("av", "508651332517533");
        form.append("__a", "1");
        form.append("fb_dtsg", fb_dtsg);

        var settings = {
            "url": "https://www.facebook.com/ufi/reaction/",
            "method": "POST",
            "timeout": 0,
            "processData": false,
            "mimeType": "multipart/form-data",
            "contentType": false,
            "data": form
        };

        $.ajax(settings).done(function (response) {
            try {
             
                response = response.replace(`for (;;);`, ``);
                response_json = JSON.parse(response);
                console.log(response_json);
  
            } catch (error) {
                console.log(`error: `, error);
            }
        });

    }

    function runAgainLoop() {
        console.log(`runAgainLoop`);
        clearInterval(runAgainInterval);
        if (!runAgain) {
            return;
        }
        var timeRunAgain = $('[name="timeRunAgain"]:visible').val();
        console.log(`timeRunAgain: `, timeRunAgain);
        // var timeRunAgainSecond = timeRunAgain * 3600000; // hour
        var timeRunAgainSecond = timeRunAgain * 60000; // minute
        runAgainInterval = setInterval(() => {

            var date_time = new Date().toString();
            dateStart = new Date(new Date(date_time).setHours(new Date(date_time).getHours() - 1)).toString();
            dateEnd = date_time;
        
            console.log(`dateStart: `, dateStart);
            console.log(`dateEnd: `, dateEnd);

            // beforeGetPost();
            window.location.reload();

        }, timeRunAgainSecond);
    }

    function waitStartGetPost() {
        console.log(`waitStartGetPost`);
        clearInterval(timeStartGetPostInterval);
        if (!runAgain) {
            return;
        }
        var timeStartGetPost = $('[name="timeStartGetPost"]:visible').val();
        timeStartGetPostInterval = setInterval(() => {

            var date_time = new Date().toString();
            if (Date.parse(date_time) >= Date.parse(timeStartGetPost)) {
                beforeGetPost();
                clearInterval(timeStartGetPostInterval);
            }

        }, 1000);
    }

    $('.formGetPost:visible').submit(function (e) { 
        e.preventDefault();
        console.log('submit!!');

        if ($('.formGetPost:visible').valid()) {
            dateStart = $(`[name="dateStart"]:visible`).val();
            dateEnd = $(`[name="dateEnd"]:visible`).val();
            
            if (runAgain) {
                waitStartGetPost();
            } else {
                beforeGetPost();
            }
        }
    });

    $('.formGetPost:visible').validate({
        dateStart: true,
        dateEnd: true,
        postType: true,
        timeRunAgain: {
            required: `.runAgain`
        },
        errorPlacement: function (error, element) {
            // console.log(error);
            if (element.attr("name") == "postType" || element.attr("name") == "timeRunAgain") {
                $(element).parent().find(`.error-text`).html(error);
            } else {
                error.insertAfter(element);
            }
        }
    });

    function beforeGetPost() {
        runAgainLoop();

        comment_post_pending = false;

        countGetPost = 0;
        countRespondPost = 0;
        countPost = 0;
        postType = [];

        $('.tableGetPost:visible').find('tbody').empty();
        
        if ($('.tableGetPost:visible').find('tfoot').find('.loading').length == 0) {
            $('.tableGetPost:visible').find('tfoot').html(
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

        $('.divTableGetPost:visible').show();

        var dateStartNew = setDateStartFB(dateStart);
        var dateEndNew = setDateEndFB(dateEnd);
        var groupId = $(`[name="groupId"]:visible`).val();

        $(`[name="postType"]:checked`).each(function (index, element) {
            postType.push($(this).val());
        });

        console.log('dateStart: ', dateStart);
        console.log('dateEnd: ', dateEnd);
        console.log('dateStartNew: ', dateStartNew);
        console.log('dateEndNew: ', dateEndNew);
        console.log('groupId: ', groupId);
        console.log('postType: ', postType);

        var dataParam = {
            dateStart: dateStart,
            dateEnd: dateEnd,
            dateStartNew: dateStartNew,
            dateEndNew: dateEndNew,
            groupId: groupId,
            postType: postType,
        }

        getPost(dataParam);
    }

    var data_set_filter = [];
    function getPost(dataParam) {
        console.log(`dataParam: `, dataParam);

        countGetPost += 1;
        
        var dtp = dataParam;
        var dateStartQuery;
        var dateEndQuery;
        var dateStartQueryFB;
        var dateEndQueryFB;

        if (dtp.dateEndNew.dateEndQueryFB) {
            dateStartQuery = changeDateTime({
                date_time: setDateStartFB(dtp.dateEndNew.dateEndQueryFB).date_time,
                minutes: {
                    type: 'add',
                    amout: 1,
                },
            });
        } else {
            dateStartQuery = setDateStartFB(dtp.dateStartNew.date_time).date_time;
        }

        dateStartQueryFB = setDateStartFB(dateStartQuery).date_time_ISO;

        // =================================

        if (dtp.dateStartNew.dateStartQueryFB) {
            dateEndQuery = changeDateTime({
                date_time: setDateEndFB(dateStartQueryFB).date_time,
                minutes: {
                    type: 'add',
                    amout: 9,
                },
            });
        } else {
            dateEndQuery = changeDateTime({
                date_time: setDateEndFB(dtp.dateStartNew.date_time).date_time,
                minutes: {
                    type: 'add',
                    amout: 10,
                },
            });
        }

        dateEndQueryFB = setDateEndFB(dateEndQuery).date_time_ISO;

        if (new Date(dateEndQueryFB) >= new Date(dtp.dateEndNew.date_time) ) {
            dateEndQuery = dtp.dateEndNew.date_time;
            dateEndQueryFB = setDateEndFB(dateEndQuery).date_time_ISO;

            dtp.dateStartNew.dateStartQueryFB = dateStartQueryFB;
            dtp.dateEndNew.dateEndQueryFB = dateEndQueryFB;

        } else {

            if (new Date(dateEndQueryFB) < new Date(dtp.dateEndNew.date_time) ) {
                dtp.dateStartNew.dateStartQueryFB = dateStartQueryFB;
                dtp.dateEndNew.dateEndQueryFB = dateEndQueryFB;
        
                setTimeout(() => {
                    getPost(dtp);
                }, 50);   
            }
        }

        console.log(`dateStartQuery: `, dateStartQuery);
        console.log(`dateEndQuery: `, dateEndQuery);
        console.log(`dateStartQueryFB: `, dateStartQueryFB);
        console.log(`dateEndQueryFB: `, dateEndQueryFB);
        console.log(`===========================`);

        // return;
        
        var access_token = localStorage.getItem('access_token');
        // var url = `https://graph.facebook.com/v4.0/${dtp.groupId}?fields=feed.limit(500)%7Bcaption%2Cpermalink_url%2Cdescription%2Cid%2Cmessage%2Cparent_id%2Cobject_id%2Cproperties%2Cstatus_type%2Cstory%2Ctype%2Cupdated_time%2Ccreated_time%2Cname%2Cfrom%2Cattachments%7D&access_token=${access_token}`;
        var url = `https://graph.facebook.com/v4.0/${dtp.groupId}?fields=feed.since(${dtp.dateStartNew.dateStartQueryFB.replace('.000Z', '')}).until(${dtp.dateEndNew.dateEndQueryFB.replace('.000Z', '')}).limit(200)%7Bcaption%2Cpermalink_url%2Cdescription%2Cid%2Cmessage%2Cparent_id%2Cobject_id%2Cproperties%2Cstatus_type%2Cstory%2Ctype%2Cupdated_time%2Ccreated_time%2Cname%2Cfrom%2Cattachments%7D&access_token=${access_token}`;

        // 1407695292801905?fields=feed.since(2020-01-27T02:01).until(2020-01-27T03:00).limit(500){caption,permalink_url,description,id,message,parent_id,object_id,properties,status_type,story,type,updated_time,created_time,name,from,attachments}
        // 760208803991408?fields=feed.since(2020-01-27T02:01).until(2020-01-27T03:00).limit(500){caption,permalink_url,description,id,message,parent_id,object_id,properties,status_type,story,type,updated_time,created_time,name,from,attachments}

        $.ajax({
            type: "GET",
            url: url,
            dataType: "json",
            success: function (response) {
                console.log('response: ', response);

                countRespondPost += 1;

                console.log('countGetPost: ', countGetPost);
                console.log('countRespondPost: ', countRespondPost);

                // var data_set_filter = [];

                if (!response.feed || !response.feed.data) {
                    console.log('countPost: ', countPost);
                    appendHtml(data_set_filter);
                    return;
                } 

                countPost += response.feed.data.length;
                $('.countPost:visible').text(countPost);
                $('.dateTimePost:visible').text(new Date(dtp.dateEndNew.dateEndQueryFB).toLocaleString());

                console.log('countPost: ', countPost);
                
                for (let i = 0; i < response.feed.data.length; i++) {
                    var dataObj = response.feed.data[i];
                    var type = null;

                    if (dataObj.parent_id) {
                        if (dataObj.story) {
                            if (dataObj.story.includes('ปาร์ตี้')) {
                                type = 'party';
                            }
                        } else {
                            if (postType.includes('share_post')) {
                                type = 'share_post';  
                            }
                        }
                    } else if (dataObj.story) {
                        if (dataObj.story.includes('ปาร์ตี้')) {
                            type = 'party';
                        }
                    } else if (dataObj.status_type == 'shared_story') {
                        if (dataObj.type == 'link') {
                            type = 'share_link';
                        }
                    } else if (dataObj.attachments && dataObj.attachments.data) {
                        if (dataObj.attachments.data[0].title == 'ไม่สามารถดูเนื้อหานี้ได้ในขณะนี้') {
                            type = 'can_not_viewed';
                        }
                    }

                    data_set_filter.push({
                        data: dataObj,
                        type: type,
                    });

                }

                console.log(`data_set_filter: `, data_set_filter);

                appendHtml(data_set_filter);

                for (let i = 0; i < data_set_filter.length; i++) {

                    if (!comment_post_pending) {
                        var group_id = $(`[name="groupId"]:visible`).val();
                        var post_id = data_set_filter[i].data.id.split('_')[1];

                        var post_id_comment_finish_localstorage = localStorage.getItem(`post_id_comment_finish`);
                        var post_id_comment_finish_localstorage_json = JSON.parse(post_id_comment_finish_localstorage);
                        
                        if (!post_id_comment_finish_localstorage_json || post_id_comment_finish_localstorage_json.indexOf(post_id) == -1) {
                            commentPost(post_id);
                            break;
                        }
                        
                    }
                    
                }
            }
        });
    }

    function appendHtml(data_set_filter = []) {

        if (data_set_filter.length > 0) {

            for (let i = 0; i < data_set_filter.length; i++) {
                var dataObj = data_set_filter[i];
                var post_id = dataObj.data.id;
                var type = dataObj.type;
                var permalink_url = dataObj.data.permalink_url;
                var updated_time = dataObj.data.updated_time;
                
                var html = 
                `<tr>
                    <td></td>
                    <td>
                        <!-- <button class="btn btn-danger deletePost" post-id="${post_id}">ลบโพสต์</button> -->
                    </td>
                    <td>${type}</td>
                    <td><a href="${permalink_url}" target="_blank">${permalink_url}</a></td>
                    <td>${new Date(updated_time).toLocaleString()}</a></td>
                </tr>`;
        
                $('.tableGetPost:visible').find('tbody').append(html);
            }

        }

        $('.deletePost:visible').unbind('click').bind('click', function(e) {
            var post_id = $(this).attr('post-id');

            console.log(`post_id: `, post_id);

            deletePost(post_id);
        });

        $('.deleteAll:visible').unbind('click').bind('click', function(e) {
            console.log('deleteAll click!')
            $('.deletePost:visible').click();
        });

        if (countRespondPost >= countGetPost) {
            console.log(`countRespondPost >= countGetPost`);

            if ($('.tableGetPost:visible').find('tbody').find('tr').length == 0) {
                var html = 
                `<tr>
                    <td colspan="5" style="text-align: center;">
                        <span>ไม่มีโพสต์</span>
                    </td>
                </tr>`;
                
                $('.tableGetPost:visible').find('tfoot').html(html);
            } else {
                $('.tableGetPost:visible').find('tfoot').empty();
            }

            if (runAgain) {
                setTimeout(() => {
                    console.log('setTimeout deleteAll click!');
                    $('.deleteAll:visible').click();
                }, 5000);
            }
        }
        
    }

    // deletePost('760208803991408_3054678607877738');
    function deletePost(post_id) {

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
                action: 'DELETE_POST',
                group_id: post_id.split('_')[0],
                post_id: post_id.split('_')[1],
                data_facebook: {
                    user_id: localStorage.getItem('user_id'),
                    fb_dtsg: localStorage.getItem('fb_dtsg'),
                    __rev: localStorage.getItem('__rev'),
                    access_token: localStorage.getItem('access_token'),
                    fb_name: localStorage.getItem('fb_name'),
                    cookie: cookie_str,
                },
            }
            
            // console.log(`data: `, data);
        
            $.ajax({
                type: "POST",
                // url: "http://localhost/devasjeans_dev/dev/manage_group",
                url: "https://ajax.devasjeans.com/facebook_tool/manage_group",
                data: data,
                dataType: "json",
                success: function (response) {
                    console.log('response: ', response);
        
                    var result = JSON.parse(response.result.replace(`for (;;);`, ``));
                    console.log('result: ', result);
        
                    if (result.error) {
                        $(`[post-id="${post_id}"]`).parents('td').find('.deleteFail').remove();
                        $(`[post-id="${post_id}"]`).parents('td').append(`<span class="deleteFail"><br><span style="font-size: 14px;color: red;">เกิดข้อผิดพลาด</span></span>`);
                    } else {
                        $(`[post-id="${post_id}"]`).parents('tr').remove();
                    }
        
                    if ($(`[post-id]`).length == 0) {
                        appendHtml();
                    }
                }
            });
            
        });
        
    }
}

