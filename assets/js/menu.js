if (window.location.hash) {
    $('.tab-conten').removeClass('active');
    $(window.location.hash).addClass('active');
    callScript(window.location.hash);
}

$('.menu').click(function (e) { 
    // e.preventDefault();
    
    var href = $(this).attr('href');
    
    // $('.tab-conten').removeClass('active');
    // $(href).addClass('active');
    window.location.hash = href;
    window.location.reload();
});

if (localStorage.getItem('user_id')) {
    $('.user-pic img').attr('src', `https://graph.facebook.com/${localStorage.getItem('user_id')}/picture?type=large`);
    $('.user-info').html(`<strong>${localStorage.getItem('fb_name')}</strong>`);   
}

function callScript(section='') {
    console.log(`section: `, section)
    switch (section) {
        case `#group_delete_post`:
            section_group_delete_post();
            break;
        case `#group_delete_report`:
            section_group_delete_report();
            break;
        case `#send_tracking`:
            section_send_tracking();
            break;
        case `#devaspay_comment`:
            section_devaspay_comment();
            break;
        case `#manage_pending_posts`:
            section_manage_pending_posts();
            break;
        case `#manage_pending_posts_1407695292801905`:
            section_manage_pending_posts_1407695292801905();
            break;
    }
}