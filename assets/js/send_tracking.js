function section_send_tracking() {

    $(".custom-file-input").on("change", function () {
        var fileName = $(this).val().split("\\").pop();
        $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
    });

    var message = `สวัสดีค่า สินค้าของลูกค้าถูกจัดส่งแล้วนะคะ\n\n`;
    message += `ผ่านขนส่ง : {shipping}\n`;
    message += `เลขพัสดุคือ : {tracking}\n\n`;
    message += `ลูกค้าสามารถตรวจสอบสถานะได้อีกครั้ง หลังจากพัสดุเข้าสู่ระบบแล้วประมาณ 12-24 ชม. นะคะ ^_^ ❤`;
    $('#message').val(message);

    $('#formSendTracking').submit(function (e) { 
        e.preventDefault();
        
        if ($('#formSendTracking').valid()) {
            // upload();
            $('#confirmSendTrackingModal').modal();
            $('#confirmSendTrackingModal').unbind('shown.bs.modal').bind('shown.bs.modal', function (e) {
                $('#upload').unbind('click').bind('click', function (e) {
                    e.preventDefault();
                    console.log(`upload`);
                    upload();
                    $('#confirmSendTrackingModal').modal('hide');
                });
            })
        }
    });

    function upload() {
        
        //Reference the FileUpload element.
        var fileUpload = document.getElementById("fileUpload");

        //Validate whether File is valid Excel file.
        var regex = /(.xls|.xlsx)$/;
        if (regex.test(fileUpload.value.toLowerCase())) {
            if (typeof (FileReader) != "undefined") {
                var reader = new FileReader();

                //For Browsers other than IE.
                if (reader.readAsBinaryString) {
                    reader.onload = function (e) {
                        ProcessExcel(e.target.result);
                    };
                    reader.readAsBinaryString(fileUpload.files[0]);
                } else {
                    //For IE Browser.
                    reader.onload = function (e) {
                        var data = "";
                        var bytes = new Uint8Array(e.target.result);
                        for (var i = 0; i < bytes.byteLength; i++) {
                            data += String.fromCharCode(bytes[i]);
                        }
                        ProcessExcel(data);
                    };
                    reader.readAsArrayBuffer(fileUpload.files[0]);
                }
            } else {
                alert("This browser does not support HTML5.");
                return;
            }
        } else {
            alert("กรุณาเลือกไฟล์ .xls หรือ .xlsx เท่านั้น");
            return;
        }
    }

    var sheet_1;
    var sheet_1_json;
    var sheet_2;
    var sheet_2_json;
    var sheet_3;
    var sheet_3_json;
    var count_inbox = 0;
    var count_inbox_curent = 0;
    var dhl_has_not_inbox_url = [];
    var dhl_has_not_tracking_id = [];
    var thpost_has_not_inbox_url = [];
    var thpost_has_not_tracking_id = [];
    function ProcessExcel(data) {

        var html = 
        `<h4 style="margin-top: 15px;margin-left: 6px;color: red;">ห้ามปิดหน้าต่างจนกว่าจะทำรายการเสร็จทั้งหมด</h4>`;
        
        $(`#status_send_tracking`).html(html);
        $(`#confirmSendTracking`).hide();
        
        //Read the Excel File data.
        var workbook = XLSX.read(data, {
            type: 'binary'
        });

        // //Fetch the name of First Sheet.
        sheet_1 = workbook.SheetNames[0];
        sheet_1_json = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheet_1]);
        console.log(`sheet_1_json: `, sheet_1_json);

        //Fetch the name of First Sheet.
        sheet_2 = workbook.SheetNames[1];
        sheet_2_json = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheet_2]);
        console.log(`sheet_2_json: `, sheet_2_json);

        //Fetch the name of First Sheet.
        sheet_3 = workbook.SheetNames[2];
        sheet_3_json = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheet_3]);
        console.log(`sheet_3_json: `, sheet_3_json);

        count_inbox = sheet_2_json.length + sheet_3_json.length;

        setDataDHL(sheet_2_json);
        setDataThailandPost(sheet_3_json);

        sendMessage(sheet_2_json, 'DHL');
        sendMessage(sheet_3_json, 'THPOST');
        
    }

    function setDataDHL(row_data) {
        for (let i = 0; i < row_data.length; i++) {

            var shipment_id = row_data[i].shipment_id;
            var shipment_id_split = shipment_id.split('_');
            var full_date = shipment_id_split[1].replace('R', '');
            var ydm = {
                y: full_date.substring(6, 8),
                m: full_date.substring(2, 4),
                d: full_date.substring(0, 2),
            }
            var date = `${ydm.y}${ydm.m}${ydm.d}`;
            var num = parseInt(shipment_id_split[2]);

            var facebook = findInboxUrl(num, date);
            if (facebook) {
                row_data[i].inbox_url = facebook.inbox_url;
                row_data[i].facebook_name = facebook.facebook_name;
            }
        }
    }

    function setDataThailandPost(row_data) {
        for (let i = 0; i < row_data.length; i++) {

            // var consignee_name = "ปราจารี สุวรรณนัง *9-3*";
            var consignee_name = row_data[i].consignee_name;
            var num_and_date = getNumAndDate(consignee_name);

            if (num_and_date) {
                var date = ``;
                var date_now = new Date();
                // var date_now = new Date("2020-01-02T07:00:00.000Z");

                if (parseInt(num_and_date.date) > parseInt(new Date(date_now).getDate())) { // ถ้าวันที่มากกว่าวันที่ปัจจุบัน แสดงว่าเป็นวันที่ของเดือนที่แล้ว
                    date_now = new Date(date_now).setMonth(new Date(date_now).getMonth() - 1);
                    var full_year = new Date(date_now).getFullYear();
                    var month = new Date(date_now).getMonth() + 1;
                    var ydm = {
                        y: full_year.toString().substring(2, 4),
                        m: (month < 10) ? `0${month}` : month,
                        d: (parseInt(num_and_date.date) < 10) ? `0${num_and_date.date}` : num_and_date.date,
                    }
                    date = `${ydm.y}${ydm.m}${ydm.d}`;

                } else {
                    var full_year = new Date(date_now).getFullYear();
                    var month = new Date(date_now).getMonth() + 1;
                    var ydm = {
                        y: full_year.toString().substring(2, 4),
                        m: (month < 10) ? `0${month}` : month,
                        d: (parseInt(num_and_date.date) < 10) ? `0${num_and_date.date}` : num_and_date.date,
                    }
                    date = `${ydm.y}${ydm.m}${ydm.d}`;
                }

                var num = parseInt(num_and_date.num);

                // console.log(`date: `, date);
                // console.log(`num: `, num);

                var facebook = findInboxUrl(num, date);
                if (facebook) {
                    row_data[i].inbox_url = facebook.inbox_url;
                    row_data[i].facebook_name = facebook.facebook_name;
                }
            }
        }

        function getNumAndDate(consignee_name) {
            var num_and_date = '';
            var start = false;
            for (let i = 0; i < consignee_name.length; i++) {

                if (start && consignee_name[i] != '*') {
                    num_and_date += consignee_name[i];
                }

                if (consignee_name[i] == '*') {
                    if (start) {
                        break;
                    }
                    start = true;
                }
            }
            // console.log(num_and_date);

            if (num_and_date) {
                var num_and_date_split = num_and_date.split('-');
                if (num_and_date_split.length >= 2) {
                    return {
                        num: num_and_date_split[0],
                        date: num_and_date_split[1],
                    }
                }
            }
            return false;
        }
    }

    function findInboxUrl(num, date) {
        if (num && date) {
            for (let i = 0; i < sheet_1_json.length; i++) {
                if (sheet_1_json[i].num == num && sheet_1_json[i].date == date) {
                    return {
                        inbox_url: sheet_1_json[i].inbox_url,
                        facebook_name: sheet_1_json[i].facebook_name,
                    };
                }
            }
        }
        return false;
    }

    function sendMessage(row_data, shipping, loop=0) {

        if (row_data[loop] && shipping) {

            if (row_data[loop].inbox_url) {

                if (row_data[loop].tracking_id) {
                    
                    var shipping_by = ''
                    switch (shipping) {
                        case 'DHL':
                            shipping_by = 'DHL';
                            break;
                        case 'THPOST':
                            shipping_by = 'ไปรษณีย์ไทย';
                            break;
                    }
                    
                    var message = $('#message').val();
                    message = message.replace('{tracking}', row_data[loop].tracking_id);
                    message = message.replace('{shipping}', shipping_by);
                    var message_encode_uri = encodeURIComponent(message);
                    var message_id = Math.floor(Math.random() * 100000000000000) + 1;
                    var url_inbox = row_data[loop].inbox_url;
                    var target_id = getParamUrl(url_inbox, 'selected_item_id');
                    var page_selected = JSON.parse($(`.fanpage`).val());
                    var page_id = page_selected.id;
                    var user_id = localStorage.getItem('user_id');
                    var fb_dtsg = localStorage.getItem('fb_dtsg');
                    var __rev = localStorage.getItem('__rev');

                    parms = `client=mercury&action_type=ma-type%3Auser-generated-message&body=${message_encode_uri}&ephemeral_ttl_mode=0&message_id=${message_id}&offline_threading_id=${message_id}&other_user_fbid=${target_id}&source=source%3Apage_unified_inbox&specific_to_list[0]=fbid%3A${target_id}&specific_to_list[1]=fbid%3A${page_id}&timestamp=1564061116109&request_user_id=${page_id}&__user=${user_id}&__a=1&__req=1n&__be=1&dpr=1.5&__rev=${__rev}&__s=%3A38ai1u%3Amxgv29&fb_dtsg=${fb_dtsg}&__spin_r=${__rev}&__spin_b=trunk`;

                    // $.ajax({
                    //     url: "https://www.facebook.com/messaging/send/",
                    //     type: "post",
                    //     data: parms,
                    //     complete: function (res) {
                    //         console.log(`res: `, res);
                            
                    //         setInboxDone();
                    //         function setInboxDone() {
                    //             var data = `ids[${target_id}]=true&source=PagesManagerMessagesInterface&request_user_id=${page_id}&__user=${user_id}&__a=1&__csr=&__req=53&__be=1&__rev=${__rev}&fb_dtsg=${fb_dtsg}&__spin_r=${__rev}&__spin_b=trunk`;
                    //             console.log(`data: `, data);
                    //             console.log(`====================`);
                    
                    //             $.ajax({
                    //                 url: "https://www.facebook.com/ajax/mercury/change_archived_status.php",
                    //                 type: "post",
                    //                 data: data,
                    //                 complete: function (res2) {
                    //                     console.log(`res2: `, res2);
                                        
                    //                     console.log(`message: `, message);
                    //                     console.log(`target_id: `, target_id);
                    //                     console.log(`row_data[${loop}]: `, row_data[loop]);
                    //                     console.log(`======================`);

                    //                     count_inbox_curent += 1;
                    //                     showStatus();

                    //                     loop += 1;
                    //                     console.log(`loop: `, loop);
                    //                     sendMessage(row_data, shipping, loop);
                    //                 }
                    //             });
                    //         }
                    //     }

                    // });

                    setTimeout(() => {
                        console.log(`message: `, message);
                        console.log(`target_id: `, target_id);
                        console.log(`row_data[${loop}]: `, row_data[loop]);
                        console.log(`======================`);

                        count_inbox_curent += 1;
                        showStatus();

                        loop += 1;
                        console.log(`loop: `, loop);
                        sendMessage(row_data, shipping, loop);
                        
                    }, 500);
                    
                } else {
                    switch (shipping) {
                        case 'DHL':
                            dhl_has_not_tracking_id.push(row_data[loop]);
                            break;
                        case 'THPOST':
                            thpost_has_not_tracking_id.push(row_data[loop]);
                            break;
                    }

                    count_inbox_curent += 1;
                    showStatus();
        
                    loop += 1;
                    console.log(`loop: `, loop);
                    sendMessage(row_data, shipping, loop);
                }

            } else {

                switch (shipping) {
                    case 'DHL':
                        dhl_has_not_inbox_url.push(row_data[loop]);
                        break;
                    case 'THPOST':
                        thpost_has_not_inbox_url.push(row_data[loop]);
                        break;
                }
                
                count_inbox_curent += 1;
                showStatus();
    
                loop += 1;
                console.log(`loop: `, loop);
                sendMessage(row_data, shipping, loop);
            }
            
        }

        function showStatus() {
            var html = 
            `<h4 style="margin-top: 15px;margin-left: 6px;color: red;">ห้ามปิดหน้าต่างจนกว่าจะทำรายการเสร็จทั้งหมด</h4>
            <p style="margin-left: 6px;color: orange;"><b>ส่งข้อความแล้ว ${count_inbox_curent} รายการ จากทั้งหมด ${count_inbox} รายการ</b></p>`;
            
            $(`#status_send_tracking`).html(html);
            
            if (count_inbox_curent == count_inbox) {
                console.log('Finish!');

                var html = 
                `<h5 style="margin-left: 6px;color: forestgreen;">ทำรายการเรียบร้อย ทั้งหมด ${count_inbox} รายการ</h5>`;
                
                $(`#status_send_tracking`).html(html);
                $(`#confirmSendTracking`).show();

                console.log(`dhl_has_not_inbox_url: `, dhl_has_not_inbox_url);
                console.log(`thpost_has_not_inbox_url: `, thpost_has_not_inbox_url);

                for (let i = 0; i < dhl_has_not_inbox_url.length; i++) {
                    var html = 
                    `<tr>
                        <td></td>
                        <td>DHL</td>
                        <td>${dhl_has_not_inbox_url[i].shipment_id || ''}</td>
                        <td>${dhl_has_not_inbox_url[i].consignee_name || ''}</td>
                        <td>${dhl_has_not_inbox_url[i].tracking_id || ''}</td>
                        <td>${dhl_has_not_inbox_url[i].__rowNum__ + 1}</a></td>
                    </tr>`;

                    $('#tableShowHasNotInboxUrl').find('tbody').append(html);
                }

                for (let i = 0; i < thpost_has_not_inbox_url.length; i++) {
                    var html = 
                    `<tr>
                        <td></td>
                        <td>THPOST</td>
                        <td>${thpost_has_not_inbox_url[i].shipment_id || ''}</td>
                        <td>${thpost_has_not_inbox_url[i].consignee_name || ''}</td>
                        <td>${thpost_has_not_inbox_url[i].tracking_id || ''}</td>
                        <td>${thpost_has_not_inbox_url[i].__rowNum__ + 1}</a></td>
                    </tr>`;

                    $('#tableShowHasNotInboxUrl').find('tbody').append(html);
                }

                var count_list_has_not_inbox_url = dhl_has_not_inbox_url.length + thpost_has_not_inbox_url.length

                if (count_list_has_not_inbox_url > 0) {
                    $('#showError').append(
                        `<p style="color: red;">มีรายการที่ไม่มี <b>inbox_url</b> จำนวน <b>${count_list_has_not_inbox_url}</b> รายการ :<button type="button" class="btn btn-link" data-toggle="modal" data-target="#modalListHasNotInboxUrl">ดูทั้งหมด</button></p>`
                    )
                }

                // ============================================================================

                console.log(`dhl_has_not_tracking_id: `, dhl_has_not_tracking_id);
                console.log(`thpost_has_not_tracking_id: `, thpost_has_not_tracking_id);

                for (let i = 0; i < dhl_has_not_tracking_id.length; i++) {
                    var html = 
                    `<tr>
                        <td></td>
                        <td>DHL</td>
                        <td>${dhl_has_not_tracking_id[i].shipment_id || ''}</td>
                        <td>${dhl_has_not_tracking_id[i].consignee_name || ''}</td>
                        <td>${dhl_has_not_tracking_id[i].tracking_id || ''}</td>
                        <td>${dhl_has_not_tracking_id[i].__rowNum__ + 1}</a></td>
                    </tr>`;

                    $('#tableShowHasNotTrackingId').find('tbody').append(html);
                }

                for (let i = 0; i < thpost_has_not_tracking_id.length; i++) {
                    var html = 
                    `<tr>
                        <td></td>
                        <td>THPOST</td>
                        <td>${thpost_has_not_tracking_id[i].shipment_id || ''}</td>
                        <td>${thpost_has_not_tracking_id[i].consignee_name || ''}</td>
                        <td>${thpost_has_not_tracking_id[i].tracking_id || ''}</td>
                        <td>${thpost_has_not_tracking_id[i].__rowNum__ + 1}</a></td>
                    </tr>`;

                    $('#tableShowHasNotTrackingId').find('tbody').append(html);
                }

                var count_list_has_not_tracking_id = dhl_has_not_tracking_id.length + thpost_has_not_tracking_id.length;

                if (count_list_has_not_tracking_id > 0) {
                    $('#showError').append(
                        `<p style="color: red;">มีรายการที่ไม่มี <b>tracking_id</b> จำนวน <b>${count_list_has_not_tracking_id}</b> รายการ :<button type="button" class="btn btn-link" data-toggle="modal" data-target="#modalListHasNotTrackingId">ดูทั้งหมด</button></p>`
                    )
                }
                
            }
        }
        
    }

    function getParamUrl(url_string = '', key = '') {
        if (url_string && key) {
            var url = new URL(url_string);
            return url.searchParams.get(key);
        }
        return '';
    }

    fanpage_all = [];
    get_fanpage();
    function get_fanpage(url=`https://graph.facebook.com/v1.0/me/accounts?fields=access_token,id,name&limit=40&access_token=${localStorage.getItem('access_token')}`) {

        $.getJSON(url, function (results) {
            var data = results.data;
            var paging = results.paging;
            $.each(data, function (i, data) {
                fanpage_all.push({'id': data.id, 'name': data.name, 'page_access_token': data.access_token });
            });

            if (typeof paging != 'undefined') {

                if (typeof paging.next != 'undefined') {

                    var message = `กำลังดึง${title}รอสักครู่`;
                    console.log(message);
                    get_fanpage(paging.next);

                } else {

                    var message = `ดึงแฟนเพจของคุณ ${fanpage_all.length} แฟนเพจ`;
                    console.log(message);

                    localStorage.setItem('fanpage_all', '');
                    localStorage.setItem('fanpage_all', JSON.stringify(fanpage_all));

                }
            } else {

                var message = `ดึงแฟนเพจของคุณ ${fanpage_all.length} แฟนเพจ`;
                console.log(message);

                localStorage.setItem('fanpage_all', '');
                localStorage.setItem('fanpage_all', JSON.stringify(fanpage_all));
            }

            var html = `<option value="">เลือกเพจ</option>`;
            for (let i = 0; i < fanpage_all.length; i++) {
                html += `<option value="${decodehtmlspecialchars(JSON.stringify(fanpage_all[i]))}">${fanpage_all[i].name}</option>`;
            }
            $(`.fanpage`).html(html);
            
        });

        function decodehtmlspecialchars(text) {
            var map = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#039;'
            };
    
            return text.replace(/[&<>"']/g, function(m) { return map[m]; });
        };

    }

}