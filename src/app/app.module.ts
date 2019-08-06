import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {NgxOverflowShadowModule} from '../../projects/ngx-overflow-shadow/src/lib/ngx-overflow-shadow.module';

@NgModule({
  declarations: [
    AppComponent
  ],
    imports: [
        BrowserModule,
        NgxOverflowShadowModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
