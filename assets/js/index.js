getDataFacebook();
function getDataFacebook() {
    fetch('https://m.facebook.com/composer/ocelot/async_loader/?publisher=feed').then(function (response) {
        return response.text()
    }).then(function (e) {

        // console.log(`e: `, e);

        localStorage.setItem('access_token', '');
        localStorage.setItem('fb_dtsg', '');
        localStorage.setItem('user_id', '');
        localStorage.setItem('fb_name', '');
        localStorage.setItem('__rev', '');

        at = e.match(/accessToken\\":\\"([^\\]+)/);
        if (at == null) {
            console.log(`ดูเหมือนคุณยังไม่ได้ Login Facebook`);
            
            if (confirm('กรุณาล็อกอิน Facebook ก่อนใช้งาน')) {
                window.location.href = 'https://www.facebook.com';
            } else {
                window.location.href = 'https://www.facebook.com';
            }
            return false;
        }

        touch = at[1];
        d = e.match(/{\\"dtsg\\":{\\"token\\":\\"([^\\]+)/);
        dt = d[1];
        n = e.match(/\\"NAME\\":\\"([^"]+)/);
        ids = e.match(/\\"ACCOUNT_ID\\":\\"([^"]+)/);
        ids = ids[1].slice(0, -1).replace(/\\\\/g, "\\"),
            n = n[1].slice(0, -1).replace(/\\\\/g, "\\"),
            __rev = e.match(/server_revision+\\":+(\d+)/)[1];
        //n = decodeURIComponent(JSON.parse(`"${n}"`)),

        name = unicodeToChar(n);
        var access_token = touch;
        var fb_dtsg = dt;
        var user_id = ids;
        var fb_name = name;
        var __rev = __rev;

        // console.log(`access_token: `, access_token);
        // console.log(`fb_dtsg: `, fb_dtsg);
        // console.log(`user_id: `, user_id);
        // console.log(`fb_name: `, fb_name);
        // console.log(`__rev: `, __rev);

        localStorage.setItem('access_token', access_token);
        localStorage.setItem('fb_dtsg', fb_dtsg);
        localStorage.setItem('user_id', user_id);
        localStorage.setItem('fb_name', fb_name);
        localStorage.setItem('__rev', __rev);

        $('.user-pic img').attr('src', `https://graph.facebook.com/${localStorage.getItem('user_id')}/picture?type=large`);
        $('.user-info').html(`<strong>${localStorage.getItem('fb_name')}</strong>`); 
    });

    function unicodeToChar(text) {
        return text.replace(/\\u[\dA-F]{4}/gi, function (match) {
            return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
        });
    }
}

// $('#click').bind('click', function(e) {
//     testInboxFanpage();
// });

// function testInboxFanpage() {
    
//     var myId = `100002692313290`;
//     var message_id = Math.floor(Math.random() * 100000000000000) + 1;
//     var userFanpageId = `100012608053161`;
//     var pageId = `907569322597211`;
//     var message = `Test2`;

//     var parms = `client=mercury`;
//     parms += `&action_type=ma-type%3Auser-generated-message`;
//     parms += `&body=${message}`;
//     parms += `&ephemeral_ttl_mode=0`;
//     parms += `&has_attachment=false`;
//     parms += `&message_id=${message_id}`;
//     parms += `&offline_threading_id=${message_id}`;
//     parms += `&other_user_fbid=${userFanpageId}`;
//     parms += `&source=source%3Apage_unified_inbox`;
//     parms += `&specific_to_list[0]=fbid%3A${userFanpageId}`;
//     parms += `&specific_to_list[1]=fbid%3A${pageId}`;
//     parms += `&timestamp=1564061116109`;
//     parms += `&request_user_id=${pageId}`;
//     parms += `&__user=${myId}`;
//     parms += `&__a=1`;
//     parms += `&__req=1n`;
//     parms += `&__be=1`;
//     parms += `&dpr=1.5`;
//     parms += `&__rev=1001569671`;
//     parms += `&__s=%3A38ai1u%3Amxgv29`;
//     parms += `&fb_dtsg=AQH95URfNfM5:AQGGPepjq5lQ`;
//     parms += `&jazoest=2658172575385821027810277535865817171801011121061135310881`;
//     parms += `&__spin_r=1001569671`;
//     parms += `&__spin_b=trunk`;
    
//     console.log(`parms: `, parms);

//     $.ajax({
//         url: "https://www.facebook.com/messaging/send/",
//         type: "post",
//         data: parms,
//         complete: function (data1) {
//             console.log(`data1: `, data1);
//         }

//     });
// }
