import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { PreparedataComponent } from './preparedata/preparedata.component';
import { TransferComponent } from './transfer/transfer.component';
import { BackupComponent } from './backup/backup.component';
import { SettingComponent } from './setting/setting.component';
import { HowtoComponent } from './howto/howto.component';
import { AboutComponent } from './about/about.component';
import { UpdateComponent } from './update/update.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PreparedataComponent,
    TransferComponent,
    BackupComponent,
    SettingComponent,
    HowtoComponent,
    AboutComponent,
    UpdateComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
