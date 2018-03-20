import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { ChartTwoComponent } from './chart-two/chart-two.component';


@NgModule({
  declarations: [
    ChartTwoComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [ChartTwoComponent]
})
export class AppModule { }
