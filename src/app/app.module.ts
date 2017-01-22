import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {MomentModule} from 'angular2-moment';

import { AppComponent } from './app.component';
import { DatePickerComponent } from './date-picker/date-picker.component';
import { TimePickerComponent } from './time-picker/time-picker.component';

@NgModule({
  declarations: [
    AppComponent,
    DatePickerComponent,
    TimePickerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule, 
    MomentModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
