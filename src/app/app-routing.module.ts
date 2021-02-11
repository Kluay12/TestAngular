import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PreparedataComponent } from './preparedata/preparedata.component';
import { TransferComponent } from './transfer/transfer.component';
import { BackupComponent } from './backup/backup.component';
import { SettingComponent } from './setting/setting.component';
import { HowtoComponent } from './howto/howto.component';
import { AboutComponent } from './about/about.component';
import { UpdateComponent } from './update/update.component';

const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'preparedata', component: PreparedataComponent },
    { path: 'transfer', component: TransferComponent },
    { path: 'backup', component: BackupComponent },
    { path: 'setting', component: SettingComponent },
    { path: 'howto', component: HowtoComponent },
    { path: 'about', component: AboutComponent },
    { path: 'update', component: UpdateComponent },
    { path: '', component: HomeComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
