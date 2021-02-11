function section_group_delete_post() {

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

    $(`[name="runAgain"]`).change(function (e) { 
        e.preventDefault();
        console.log($(this).is(':checked'));
        if ($(this).is(':checked')) {
            runAgain = true;
            $('[name="timeRunAgain"]').prop(`disabled`, false);
            $('[name="timeStartGetPost"]').prop(`disabled`, false);
        } else {
            runAgain = false;
            $('[name="timeRunAgain"]').prop(`disabled`, true);
            $('[name="timeStartGetPost"]').prop(`disabled`, true);
        }
    });

    function runAgainLoop() {
        clearInterval(runAgainInterval);
        if (!runAgain) {
            return;
        }
        var timeRunAgain = $('[name="timeRunAgain"]').val();
        // var timeRunAgainSecond = timeRunAgain * 3600000; // hour
        var timeRunAgainSecond = timeRunAgain * 60000; // minute
        runAgainInterval = setInterval(() => {

            var date_time = new Date().toString();
            dateStart = new Date(new Date(date_time).setHours(new Date(date_time).getHours() - 1)).toString();
            dateEnd = date_time;
        
            console.log(`dateStart: `, dateStart);
            console.log(`dateEnd: `, dateEnd);

            beforeGetPost();

        }, timeRunAgainSecond);
    }

    function waitStartGetPost() {
        console.log(`waitStartGetPost`);
        clearInterval(timeStartGetPostInterval);
        if (!runAgain) {
            return;
        }
        var timeStartGetPost = $('[name="timeStartGetPost"]').val();
        timeStartGetPostInterval = setInterval(() => {

            var date_time = new Date().toString();
            if (Date.parse(date_time) >= Date.parse(timeStartGetPost)) {
                beforeGetPost();
                clearInterval(timeStartGetPostInterval);
            }

        }, 1000);
    }

    $('#formGetPost').submit(function (e) { 
        e.preventDefault();
        console.log('submit!!');

        if ($('#formGetPost').valid()) {
            dateStart = $(`[name="dateStart"]`).val();
            dateEnd = $(`[name="dateEnd"]`).val();
            
            if (runAgain) {
                waitStartGetPost();
            } else {
                beforeGetPost();
            }
        }
    });

    $('#formGetPost').validate({
        dateStart: true,
        dateEnd: true,
        postType: true,
        timeRunAgain: {
            required: `#runAgain`
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

        countGetPost = 0;
        countRespondPost = 0;
        countPost = 0;
        postType = [];

        $('#tableGetPost').find('tbody').empty();
        
        if ($('#tableGetPost').find('tfoot').find('.loading').length == 0) {
            $('#tableGetPost').find('tfoot').html(
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

        $('#divTableGetPost').show();

        var dateStartNew = setDateStartFB(dateStart);
        var dateEndNew = setDateEndFB(dateEnd);
        var groupId = $(`[name="groupId"]`).val();

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

                var data_set_filter = [];

                if (!response.feed || !response.feed.data) {
                    console.log('countPost: ', countPost);
                    appendHtml(data_set_filter);
                    return;
                } 

                countPost += response.feed.data.length;
                $('.countPost').text(countPost);
                $('.dateTimePost').text(new Date(dtp.dateEndNew.dateEndQueryFB).toLocaleString());

                console.log('countPost: ', countPost);
                
                for (let i = 0; i < response.feed.data.length; i++) {
                    var dataObj = response.feed.data[i];

                    if (dataObj.parent_id) {
                        if (dataObj.story) {
                            if (dataObj.story.includes('ปาร์ตี้')) {
                                if (postType.includes('party')) {
                                    data_set_filter.push({
                                        data: dataObj,
                                        type: 'party',
                                    });  
                                }
                            }
                        } else {
                            if (postType.includes('share_post')) {
                                data_set_filter.push({
                                    data: dataObj,
                                    type: 'share_post',
                                });   
                            }
                        }
                    } else if (dataObj.story) {
                        if (dataObj.story.includes('ปาร์ตี้')) {
                            if (postType.includes('party')) {
                                data_set_filter.push({
                                    data: dataObj,
                                    type: 'party',
                                });  
                            }
                        }
                    } else if (dataObj.status_type == 'shared_story') {
                        if (dataObj.type == 'link') {
                            if (postType.includes('share_link')) {
                                data_set_filter.push({
                                    data: dataObj,
                                    type: 'share_link',
                                }); 
                            }
                        }
                    } else if (dataObj.attachments && dataObj.attachments.data) {
                        if (dataObj.attachments.data[0].title == 'ไม่สามารถดูเนื้อหานี้ได้ในขณะนี้') {
                            if (postType.includes('can_not_viewed')) {
                                data_set_filter.push({
                                    data: dataObj,
                                    type: 'can_not_viewed',
                                });
                            }
                        }
                    }

                }

                console.log(`data_set_filter: `, data_set_filter);

                appendHtml(data_set_filter);
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
                        <button class="btn btn-danger deletePost" post-id="${post_id}">ลบโพสต์</button>
                    </td>
                    <td>${type}</td>
                    <td><a href="${permalink_url}" target="_blank">${permalink_url}</a></td>
                    <td>${new Date(updated_time).toLocaleString()}</a></td>
                </tr>`;
        
                $('#tableGetPost').find('tbody').append(html);
            }

        }

        $('.deletePost').unbind('click').bind('click', function(e) {
            var post_id = $(this).attr('post-id');

            console.log(`post_id: `, post_id);

            deletePost(post_id);
        });

        $('#deleteAll').unbind('click').bind('click', function(e) {
            console.log('deleteAll click!')
            $('.deletePost').click();
        });

        if (countRespondPost >= countGetPost) {
            console.log(`countRespondPost >= countGetPost`);

            if ($('#tableGetPost').find('tbody').find('tr').length == 0) {
                var html = 
                `<tr>
                    <td colspan="5" style="text-align: center;">
                        <span>ไม่มีโพสต์</span>
                    </td>
                </tr>`;
                
                $('#tableGetPost').find('tfoot').html(html);
            } else {
                $('#tableGetPost').find('tfoot').empty();
            }

            if (runAgain) {
                setTimeout(() => {
                    console.log('setTimeout deleteAll click!');
                    $('#deleteAll').click();
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