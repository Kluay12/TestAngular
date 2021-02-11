import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'TestAngular';

    json_menus = [
        {
            num: 1,
            name: 'หน้าหลัก',
            url: '/home'
        },
        {
            num: 2,
            name: 'จัดเตรียมข้อมูล',
            url: '/preparedata'
        },
        {
            num: 3,
            name: 'โอนย้าย',
            url: '/transfer'
        },
        {
            num: 4,
            name: 'สำรองข้อมูล',
            url: '/backup'
        },
        {
            num: 5,
            name: 'ตั้งค่า',
            url: '/setting'
        },
        {
            num: 6,
            name: 'แนะนำการใช้งาน',
            url: '/howto'
        },
        {
            num: 7,
            name: 'เกี่ยวกับ',
            url: '/about'
        },
        {
            num: 8,
            name: 'อัพเดท',
            url: '/update'
        },
    ];
    
    constructor() {

        this.json_menus.sort((a, b) => a.num - b.num);
        console.log('json_menu: ', this.json_menus);
    }
    
}
