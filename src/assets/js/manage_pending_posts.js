function section_manage_pending_posts() {

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

    var edges_all = [];
    
    getPendingPost();
    function getPendingPost(cursor='') {

        var variables = JSON.stringify({
            "UFI2CommentsProvider_commentsKey": "GroupsCometPendingPostsContent",
            "count": 10,
            "cursor": cursor,
            "displayCommentsContextEnableComment": null,
            "displayCommentsContextIsAdPreview": null,
            "displayCommentsContextIsAggregatedShare": null,
            "displayCommentsContextIsStorySet": null,
            "displayCommentsFeedbackContext": null,
            "feedLocation": "GROUP_PENDING",
            "feedbackSource": 0,
            "focusCommentID": null,
            "pendingPostMetadataEnabled": true,
            "pendingStoriesOrderBy": "CHRONOLOGICAL",
            "privacySelectorRenderLocation": "COMET_STREAM",
            "renderLocation": "group_pending_queue",
            "scale": 1,
            "useDefaultActor": false,
            "id": "760208803991408"
        });
        
        var form = new FormData();
        form.append("av", localStorage.getItem('user_id'));
        form.append("__user", localStorage.getItem('user_id'));
        form.append("__a", `1`);
        form.append("__dyn", `7AzHK4HwBgC265Q2m3mbG2KnFw9uu2i5U4e0yoW3q322aewXwnEbotwp8O2S1DwUx60xU1RVEtwMw65xOfw9q224o4W8wgolzUO0n2US2G2Caw9m8wsU9kbxSEtwi831wnEcUC68gwHwlE-UqwsUkxe2GewGwsoqBwJK2W5olwUwHwF-4U4q2i0x9pWxq8wyw`);
        form.append("__csr", `gPrEt7PXFNd_O9lsAp4iq4Ey26FRsjn_fsCQQAHaTZlB8rjOXOkQHRHh5FWJt4GtBKKZlzqAJuTny4C9VbuhAzQpaUVqAXy9e8zpeimJGVeUV6DyGGiibmQmmisw-8F3GK8AqKl1im48lz8hy9oCi8ALyK7VEuG48hxbyUhGh5Kdh8C7FpXF4xyuuVKczUjCwAzKUKdUgyA58CE-2q4UOaCyry8hxW9Azp9Ey7oS4ayFe647UObCCwUxe1mwjAE2txmVoaojwGwNDwxx6cye3O3u482dwAyUydw_xeu4odorwp8b82PxS1FwfW2q0hW2y0R8mCwaO3K2G322O10wKwrE67xm4oeEgK1Nw2QE1_83_w823-0rK0pi3C0aOw4Hw2Jo29wsUfE1pU0KG0JoO09Ww2zU4K0UU0Au0Ro4m09dw6MMghg`);
        form.append("__req", `q`);
        form.append("__beoa", `0`);
        form.append("__pc", `EXP3:comet_pkg`);
        form.append("dpr", `1`);
        form.append("__ccg", `EXCELLENT`);
        form.append("__rev", `1003023315`);
        form.append("__s", `i6m2x6:othq2e:6jo0im`);
        form.append("__hsi", `6898989072204742294-0`);
        form.append("__comet_req", `1`);
        form.append("fb_dtsg", localStorage.getItem('fb_dtsg'));
        form.append("jazoest", `22113`);
        form.append("__spin_r", `1003023315`);
        form.append("__spin_b", `trunk`);
        form.append("__spin_t", `1606296066`);
        form.append("fb_api_caller_class", `RelayModern`);
        form.append("fb_api_req_friendly_name", `GroupsCometPendingPostsFeedPaginationQuery`);
        form.append("variables", variables);
        form.append("server_timestamps", `true`);
        form.append("doc_id", `3860173527334970`);

        var settings = {
            "url": "https://www.facebook.com/api/graphql/",
            "method": "POST",
            "timeout": 0,
            "processData": false,
            "mimeType": "multipart/form-data",
            "contentType": false,
            "data": form
        };

        $.ajax(settings).done(function (response) {
            // console.log(`getPendingPost response: `, response);

            var response_json;

            try {
                
                var response_split = response.split(`\n{"label":"CometFeedStoryVideoAttachmentVideoPlayer_video$defer$VideoPlayerWithVideoCardsOverlay_video"`);
                if (response_split.length > 1) {
                    response = response_split[0];
                }

                response = response.replace(`for (;;);`, ``);
                response_json = JSON.parse(response);
                console.log(response_json);
  
            } catch (error) {
                console.log(`getPendingPost response: `, response);
                console.log(`error: `, error);
            }

            if (response_json) {
                var edges = response_json.data.node.pending_posts_section_stories.edges || [];
                var end_cursor = response_json.data.node.pending_posts_section_stories.page_info.end_cursor;

                console.log(`edges: `, edges);
                console.log(`end_cursor: `, end_cursor);

                for (let i = 0; i < edges.length; i++) {
                    edges_all.push(edges[i]);
                }

                if (end_cursor) {
                    getPendingPost(end_cursor);
                } else {
                    console.log(`edges_all: `, edges_all);

                    for (let i = 0; i < edges_all.length; i++) {
                        var edges_obj = edges_all[i];

                        try {

                            if (
                                // edges_obj.node.comet_sections.content.story.comet_sections.message &&
                                // edges_obj.node.comet_sections.content.story.comet_sections.message.story &&
                                // edges_obj.node.comet_sections.content.story.comet_sections.message.story.message

                                edges_obj.node.comet_sections.content.story.comet_sections.message_container &&
                                edges_obj.node.comet_sections.content.story.comet_sections.message_container.story &&
                                edges_obj.node.comet_sections.content.story.comet_sections.message_container.story.message
                            ) {

                                // var message = edges_obj.node.comet_sections.content.story.comet_sections.message.story.message.text;
                                var message = edges_obj.node.comet_sections.content.story.comet_sections.message_container.story.message.text;

                                console.log(`==============================`);
                                console.log(`==============================`);

                                if ((message.toLowerCase()).indexOf(`#devaspay`) != -1) {
                                    console.log(1111111111);
                                    console.log(1111111111);
                                    console.log(1111111111);
                                    console.log(`message: `, message);

                                    approve_post(edges_obj);

                                } else {
                                    console.log(`message: `, message);
                                    reject_post(edges_obj);

                                }
                                
                            } else {
                                console.log(`message: `, message);
                                reject_post(edges_obj);
                            }

                        } catch (error) {
                            console.log(`edges_obj: `, edges_obj);
                            console.log(`error: `, error);
                        }
                        
                    }
                }
            }
            
        });
    }

    function approve_post(edges_obj) {

        var story_id = edges_obj.node.id;

        var variables = JSON.stringify({
            "input": {
                "group_id": "760208803991408",
                "story_id": story_id,
                "actor_id": localStorage.getItem('user_id'),
                "client_mutation_id": "1"
            },
            "displayCommentsFeedbackContext": null,
            "displayCommentsContextEnableComment": null,
            "displayCommentsContextIsAdPreview": null,
            "displayCommentsContextIsAggregatedShare": null,
            "displayCommentsContextIsStorySet": null,
            "feedLocation": "GROUP",
            "feedbackSource": 0,
            "focusCommentID": null,
            "hoistStories": [],
            "hoistStoriesCount": 0,
            "hasHoistStories": false,
            "scale": 1,
            "sortingSetting": null,
            "useDefaultActor": false,
            "privacySelectorRenderLocation": "COMET_STREAM",
            "renderLocation": "group",
            "UFI2CommentsProvider_commentsKey": "CometGroupDiscussionRootSuccessQuery",
            "shouldDeferMainFeed": false
        });

        var form = new FormData();
        form.append("av", localStorage.getItem('user_id'));
        form.append("__user", localStorage.getItem('user_id'));
        form.append("__a", `1`);
        form.append("__dyn", `7AzHK4HwBgC265Q2m3mbG2KnFw9uu2i5U4e0yoW3q322aewXwnEbotwp8O2S1DwUx60xU1RVEtwMw65xOfw9q224o4W8wgolzUO0n2US2G2Caw9m8wsU9kbxSEtwi831wnEcUC68gwHwlE-UqwsUkxe2GewGwsoqBwJK2W5olwUwHwF-4U4q2i0x9pWxq8wyw`);
        form.append("__csr", `gPrEt7P_FNd_O9lsAp4iq4Ey24xRi4R_PT9ZdeHSTZlB8rikXSRcZqQhquHnhaDprHLloSFbnJRUCC9VbuhAzQpaUWGAXy9e8zpeimJGVeUV6DyGGiibmQmmc8iayagWHy96HBgkBx25ouy9oCi8ALyK7VEuG48hxbyUhGh5Kdh8C7FpXF4xyuuVKczUjCwAzKUKdUgyA58CE-2q4UOaCyry8hxW9Azp9Ey7oS4ayFe647UObCCwUxe1mwjAE2txmVoaojwGwNDwxx6cye3O3u482dwAyUydw_xeu4odorwp8b82PxS1FwfW2q0hW2y0R8mCwaO3K2G322O10wKwrE67xm4oeEgK1Nw2QE1_83_w823-0rK0pi3C0aOw4Hw2Jo29wsUfE1pU0KG0JoO09Ww2zU4K0UU0Au0Ro4m09dw6MMghg`);
        form.append("__req", `v`);
        form.append("__beoa", `0`);
        form.append("__pc", `EXP3:comet_pkg`);
        form.append("dpr", `1`);
        form.append("__ccg", `EXCELLENT`);
        form.append("__rev", `1003023337`);
        form.append("__s", `fwfmel:uzf9l9:d5g6dj`);
        form.append("__hsi", `6899055875935382956-0`);
        form.append("__comet_req", `1`);
        form.append("fb_dtsg", localStorage.getItem('fb_dtsg'));
        form.append("jazoest", `22065`);
        form.append("__spin_r", `1003023337`);
        form.append("__spin_b", `trunk`);
        form.append("__spin_t", `1606311620`);
        form.append("fb_api_caller_class", `RelayModern`);
        form.append("fb_api_req_friendly_name", `useGroupsCometApprovePendingStoryMutation`);
        form.append("variables", variables);
        form.append("server_timestamps", `true`);
        form.append("doc_id", `3930891603635335`);
        form.append("fb_api_analytics_tags", `["qpl_active_flow_ids=30605361,30605361,30605361"]`);

        var settings = {
            "url": "https://www.facebook.com/api/graphql/",
            "method": "POST",
            "timeout": 0,
            "processData": false,
            "mimeType": "multipart/form-data",
            "contentType": false,
            "data": form
        };

        $.ajax(settings).done(function (response) {
            try {

                var response_split = response.split(`\n{"label":"GroupsCometFeedRegularStories_group$stream$GroupsCometFeedRegularStories_group_group_feed"`);
                if (response_split.length > 1) {
                    response = response_split[0];
                }

                response = response.replace(`for (;;);`, ``);
                response_json = JSON.parse(response);
                console.log(`approve_post response_json: `, response_json);
  
            } catch (error) {

                // var response_split = response.split(`\n{"label":"CometFeedStoryVideoAttachmentVideoPlayer_video$defer$VideoPlayerWithVideoCardsOverlay_video"`);
                // if (response_split.length > 1) {
                //     response = response_split[0];
                // }

                // response = response.replace(`for (;;);`, ``);
                // response = JSON.parse(response);
                
                console.log(`response: `, response);
                console.log(`error: `, error);
            }
        });
        
    }

    function reject_post(edges_obj) {

        var story_id = edges_obj.node.id;
        var owner_id = edges_obj.node.comet_sections.action_link.actor.id;

        var variables = JSON.stringify({
            "input": {
                "admin_notes": "ให้ใส่ข้อความ #DevasPay และรูป QR Code ของ Deva's Pay ในข้อความ *พร้อมกับการโพสต์ทุกครั้ง **ถ้ายังไม่มี ให้แอดไลน์ @devaspay (มี @) เพื่อขอลิงค์ลงทะเบียน",
                "group_id": "760208803991408",
                "selected_rules": [
                    "2545064935505777"
                ],
                "share_feedback": true,
                "source": "group_pending_posts",
                "story_id": story_id,
                "actor_id": localStorage.getItem('user_id'),
                "client_mutation_id": "5"
            },
            "memberID": owner_id
        });
        
        var form = new FormData();
        form.append("av", localStorage.getItem('user_id'));
        form.append("__user", localStorage.getItem('user_id'));
        form.append("__a", `1`);
        form.append("__dyn", `7AzHK4HwBgC265Q2m3mbG2KnFw9uu2i5U4e2O1szEdEc88EW3K1uwJxS1Az8bo6u3y4o27w7nCxS320om78-0BE88hwjEy11xmfz83WwgEcHzoaEaoG0Boy1PwBgK7qxS18wc61uwPyoox22K1mzXxG1Pxi4UaEW2G1NxGm2SUbElxm3y2K2DUjwhE9824BDG5Ey2a`);
        form.append("__csr", `gXW7hY_Wsr_8BlMR9kl8wx8F5i4Ov4T9t9F98LtRmYxJ8kYhcZqQhqaAykjhTKWXRmdGh9uPt6swDRJX8iKqQpaAulkF6VqJoyiFuKimJG-KVpqhFXCGHh8JvhpoMxahFKAqpaQuhHVk594LyoHCUGfK8ByqUyK-aQqcDGq7Gy-EhxbDKbBmh5KbQi8h8jBBhHF4xt7BXKKczV8Wp5xSeXyUTg-nF3V9GGfzUmxecyFECUyicxym9AzpaK8G6ES4ayFe647UObCCxmEiz8jK7E8U-2qeUyula5A2qiaxq3u5vBwFxe2G36u264oO8UC3a7opx20zo98K8zofUjDx63m6U6i2O0DUjxS1kxi0_E9E4W1TwioS2y0wU5249pE2IzoboaEG8xOi2u10wKwrE67xm4oeEgK1Nw2QE1_83_w823-0rK0pi3C0azzE1aU0Hm0yo7e3W2y0jW0bGwbmcw2uE0E-1bwee097w9a12whobo0x-0r04km`);
        form.append("__req", `1y`);
        form.append("__beoa", `0`);
        form.append("__pc", `EXP3:comet_pkg`);
        form.append("dpr", `1`);
        form.append("__ccg", `EXCELLENT`);
        form.append("__rev", `1003023315`);
        form.append("__s", `oc1xx4:othq2e:on5k5j`);
        form.append("__hsi", `6899004005348742600-0`);
        form.append("__comet_req", `1`);
        form.append("fb_dtsg", localStorage.getItem('fb_dtsg'));
        form.append("jazoest", `22050`);
        form.append("__spin_r", `1003023315`);
        form.append("__spin_b", `trunk`);
        form.append("__spin_t", `1606299543`);
        form.append("fb_api_caller_class", `RelayModern`);
        form.append("fb_api_req_friendly_name", `useGroupsCometDeclinePendingStoryMutation`);
        form.append("variables", variables);
        form.append("server_timestamps", `true`);
        form.append("doc_id", `3365842253444071`);
        form.append("fb_api_analytics_tags", `["qpl_active_flow_ids=30605361,30605361,30605361"]`);

        var settings = {
            "url": "https://www.facebook.com/api/graphql/",
            "method": "POST",
            "timeout": 0,
            "processData": false,
            "mimeType": "multipart/form-data",
            "contentType": false,
            "data": form
        };

        $.ajax(settings).done(function (response) {
            try {

                var response_split = response.split(`\n{"label":"CometFeedStoryVideoAttachmentVideoPlayer_video$defer$VideoPlayerWithVideoCardsOverlay_video"`);
                if (response_split.length > 1) {
                    response = response_split[0];
                }
             
                response = response.replace(`for (;;);`, ``);
                response_json = JSON.parse(response);
                console.log(`reject_post response_json: `, response_json);
  
            } catch (error) {
                // var response_split = response.split(`\n{"label":"CometFeedStoryVideoAttachmentVideoPlayer_video$defer$VideoPlayerWithVideoCardsOverlay_video"`);
                // if (response_split.length > 1) {
                //     response = response_split[0];
                // }

                // response = response.replace(`for (;;);`, ``);
                // response = JSON.parse(response);
                
                console.log(`response: `, response);
                console.log(`error: `, error);
            }
        });
    }

    setInputAuto();
    function setInputAuto() {

        function getRndInteger(min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
        }

        var groupId = `760208803991408`;
        var timeRunAgainAuto = getRndInteger(3, 3);
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
            runAgainLoop();
        }, 3000);
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
}

