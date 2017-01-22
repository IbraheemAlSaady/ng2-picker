import { Component, ElementRef, forwardRef, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as moment from 'moment';

/*
import m from 'moment';
const moment = m;
*/

const Moment: any = (<any>moment).default || moment;

export const DATE_PICKER_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DatePickerComponent),
  multi: true
};

export class DatePickerDateModel {
  day: number;
  month: number;
  year: number;
  value: string;
  momentObj: any;

  constructor() {
    this.momentObj = Moment();
    this.year = this.momentObj.year(); // default to now 
    this.month = this.momentObj.month(); // default to now
    this.day = this.momentObj.format('DD'); // default to now
  }

  format(format) {
    this.value = moment(`${this.year}-${this.month + 1}-${this.day}`, 'YYYY-MM-DD')
      .format(format);
    return this.value;
  }

  update(year, month, format) {
    this.year = year;
    this.month = month;
    this.format(format);
  }
}

class CalendarModel {
  day: number;
  month: number;
  year: number;
  momentObj: any;
  hidden: boolean;
  selected: boolean;
  today: boolean;
  disabled: boolean;
}

class DatePickerView {
  view: string;
  minView: string;
  maxView: string;
  weekdays: Array<string>;
  months: Array<string>;
  years: any = {
    min: Number,
    current: Number,
    max: Number,
    step: 4,
    values: []
  };
  sets = {
    dayView: [],
    monthView: [],
    yearView: []
  };
  isOpen: boolean;;

  constructor(view = 'days', minView = 'days', maxView = 'years') {
    this.view = view;
    this.minView = minView;
    this.maxView = maxView;
    this.weekdays = moment.weekdaysMin();
    this.months = moment.monthsShort();
    this.isOpen = false;
  }
}

class DatePickerOptions {
  format?: string;
  className?: string;
  autoClose?: boolean;
  minView?: string;
  maxView?: string;
  minDate?: Date;
  maxDate?: Date;

  constructor(obj: any) {
    this.format = (obj && obj.format) ? obj.format : 'MM/DD/YYYY';
    this.className = (obj && obj.className) ? obj.className : '';
    this.autoClose = (obj && obj.autoClose === true) ? true : false;
    this.minView = (obj && obj.minVew) ? obj.minView : 'years';
    this.maxView = (obj && obj.maxView) ? obj.maxView : 'days';
    this.minDate = (obj && obj.minDate) ? obj.minDate : null;
    this.maxDate = (obj && obj.maxDate) ? obj.maxDate : null;
  }
}

class Utils {
  static getRows(source, columns): Array<any> {
    let sets = [];
    let rows = parseInt((source.length / columns).toString());
    for (let i = 0; i <= rows; i++) {
      sets.push({
        data: source.slice(i * columns, i * columns + columns)
      });
    }
    return sets;
  }

  static range(current, to, prev = 0): Array<any> {
    let arr = [];
    if (!prev)
      for (let i = current; i <= to; i++) {
        arr.push(i);
      }
    else
      for (let i = prev; i <= to; i++) {
        arr.push(i);
      }
    return arr;
  }
}

@Component({
  selector: 'date-picker',
  // templateUrl: './date-picker.component.html',
  // styleUrls: ['./date-picker.component.css'],
  template: `
  <div>
    <input type="text" [(ngModel)]="date.value" (click)="toggle()" class="simple-picker {{ options.className }}" />
    <div class="simple-picker-container" [style.display]="view.isOpen ? 'block' : 'none'">
        <div class="simple-picker-calendar-view" *ngIf="view.view === 'days'">
            <div class="simple-picker-calendar-header-container">
                <div class="simple-picker-navigation-arrow" (click)="prevMonth()">
                    <div class="simple-picker-arrow-left"></div>
                </div>
                <div class="simple-picker-calendar-header" (click)="openMonthPicker()">
                    {{ getSelectedMonth() }} - {{ currentDate.year() }}
                </div>
                <div class="simple-picker-navigation-arrow" (click)="nextMonth()">
                   <div class="simple-picker-arrow-right"></div>
                </div>
            </div>
            <table class="simple-picker-table">
                <tbody class="simple-picker-table-body">
                    <tr class="simple-picker-row">
                        <td class="simple-picker-column simple-container-day-name" *ngFor="let weekday of view.weekdays">
                            {{ weekday }}
                        </td>
                    </tr>
                    <tr class="simple-picker-row" *ngFor="let row of view.sets.dayView">
                        <td class="simple-picker-column" *ngFor="let d of row.data" 
                            [ngClass]="{'simple-container-day': !d.hidden, 'simple-container-selected': d.selected, 'simple-picker-date-disabled' : d.disabled}"
                            (click)="selectDate(d)">
                            <span *ngIf="d.day > 0">{{ d.day }}</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div *ngIf="view.view==='months'">
            <div class="simple-picker-calendar-header-container">
                <div class="simple-picker-navigation-arrow" (click)="prevYear()">
                    <div class="simple-picker-arrow-left"></div>
                </div>
                <div class="simple-picker-calendar-header" (click)="openYearPicker()">
                    {{ currentDate.year() }}
                </div>
                <div class="simple-picker-navigation-arrow" (click)="nextYear()">
                    <div class="simple-picker-arrow-right"></div>
                </div>
            </div>

            <table class="simple-picker-table">
                <tbody class="simple-picker-table-body">
                    <tr class="simple-picker-row" *ngFor="let row of view.sets.monthView">
                        <td class="simple-picker-column simple-picker-month" 
                        *ngFor="let month of row.data" 
                        [ngClass]="{'simple-container-selected': isMonthSelected(month)}"
                        (click)="selectMonth(month)">
                            {{ month }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div *ngIf="view.view==='years'">
            <div class="simple-picker-calendar-header-container">
                <div class="simple-picker-navigation-arrow" (click)="prevYears()">
                    <div class="simple-picker-arrow-left"></div>
                </div>
                <div class="simple-picker-calendar-header">
                    {{ view.years.min }} - {{ view.years.max }}
                </div>
                <div class="simple-picker-navigation-arrow" (click)="nextYears()">
                    <div class="simple-picker-arrow-right"></div>
                </div>
            </div>

            <table class="simple-picker-table">
                <tbody class="simple-picker-table-body">
                    <tr class="simple-picker-row" *ngFor="let row of view.sets.yearView">
                        <td class="simple-picker-column simple-picker-year" 
                            *ngFor="let year of row.data" 
                            [ngClass]="{'simple-container-selected': year === this.date.year}"
                            (click)="selectYear(year)">
                            {{ year }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>
  `,
  styles: [
    `
    .simple-picker-container { 
    display: flex;
    justify-content: flex-start;
    flex-wrap: nowrap;
    flex-direction: row;
    top:20px;
    position: relative;
    background: #fefefe;
    border: 1px solid #e4e7e7; 
    width: 300px;
    border-radius: 4px;
    /*padding: 16px 22px;*/
    padding: 16px;
}

.simple-picker-container:after, 
.simple-picker-container:before {
    bottom: 100%;
    border: solid transparent;
    content: " ";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
}

.simple-picker-container:after {
    border-bottom-color:white;
    border-width: 19px;
    left: 10%;
    margin-left: -19px;
}
.simple-picker-container:before {
    border-color: rgba(113, 158, 206, 0);
    border-bottom-color: #e4e7e7;
    border-width: 20px;
    left: 10%;
    margin-left: -20px;
}

.simple-picker-calendar-view {
    width: 100%;
}

.simple-picker-calendar-header-container { 
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    width: 100%;
    justify-content: flex-start;
    margin-bottom: 16px;
}

.simple-picker-navigation-arrow {
    width: 25%; 
    height: 28px;
    justify-content: center;
    align-items: center;
    display: flex;
    border: 1px solid #e4e7e7;
    border-radius: 4px;
    cursor: pointer;
}
.simple-picker-navigation-arrow > span {
    color: #b3b3b3;
    padding-top: 3px;
}

.simple-picker-arrow-right {
    border-right:2px solid #b3b3b3;
    border-bottom:2px solid #b3b3b3;
    width:6px;
    height:6px;
    transform: rotate(-45deg);
}

.simple-picker-arrow-left {
    border-right:2px solid #b3b3b3;
    border-bottom:2px solid #b3b3b3;
    width:6px;
    height:6px;
    transform: rotate(135deg);
}

.simple-picker-calendar-header { 
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 22px; 
    color: #3c3f40;
    cursor: pointer;
    width: 65%;
    margin: 0 10%;
}

.simple-picker-table {
    width: 100%;
    display: table;
    border-collapse: collapse;
}

.simple-picker-table-body { 
    display: table-row-group;
    box-sizing: border-box;
}

.simple-picker.row {
    box-sizing: border-box;
    display: table-row;
}

.simple-picker-column {
    display: table-cell;
    text-align: center;
    vertical-align: middle;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
}

.simple-picker-column-hidden:hover {
    background-color: transparent !important;
}

.simple-container-day-name { 
    font-size: 16px;
    font-weight: 100;
    color: #565a5c;
    padding: 4px 0;
}

.simple-container-day {
    border: 1px solid #e4e7e7;
    padding: 0;
    cursor: pointer;
    width: 39px;
    height: 38px;
    text-align: center;
    vertical-align: middle;
    font-size: 16px;
    font-weight: 100;
    color: #565a5c;
}

.simple-picker-month, .simple-picker-year {
    border: 1px solid #e4e7e7;
    padding: 0;
    cursor: pointer;
    width: 70px;
    height: 45px;
    text-align: center;
    vertical-align: middle;
    font-size: 16px;
    font-weight: 100;
    color: #565a5c;
}

.simple-container-day:hover, .simple-picker-month:hover, .simple-picker-year:hover, .simple-container-selected {
    background-color: #00a699;
    color: white;
}

.simple-picker-date-disabled {
    color: #ddd !important;
}
    `
  ],
  providers: [DATE_PICKER_VALUE_ACCESSOR]
})
export class DatePickerComponent implements ControlValueAccessor, OnInit {
  @Input() format: string;
  @Input() className: string;
  @Input() autoClose: boolean;
  @Input() minView: string;
  @Input() maxView: string;
  @Input() minDate: Date;
  @Input() maxDate: Date;

  date: DatePickerDateModel;
  view: DatePickerView;
  options: DatePickerOptions;
  currentDate = Moment();
  days = [];
  minDateVal: any;
  maxDateVal: any;


  constructor(public el: ElementRef) {
    this.date = new DatePickerDateModel();
  }

  ngOnInit() {
    this.view = new DatePickerView('days', this.minView, this.maxView);
    this.options = new DatePickerOptions({
      format: this.format,
      className: this.className,
      autoClose: this.autoClose,
      minView: this.minView,
      maxView: this.maxView,
      minDate: this.minDate,
      maxDate: this.maxDate
    });

    if (this.options.minDate) {
      this.minDateVal = Moment(this.options.minDate);
    } else {
      this.minDateVal = null;
    }

    if (this.options.maxDate) {
      this.maxDateVal = Moment(this.options.maxDate);
    } else {
      this.maxDateVal = null;
    }

    this.date.format(this.options.format);

    if (typeof window !== 'undefined') {
      let body = document.querySelector('body');
      body.addEventListener('click', e => {
        if (!this.view.isOpen || !e.target) { return; };
        if (this.el.nativeElement !== e.target && !this.el.nativeElement.contains((<any>e.target))) {
          this.close();
        }
      }, false);
    }
    this.setMinMaxView();
    this.generateCalendar();
  }

  private onTouchedCallback: () => void = () => { };
  private onChangeCallback: (_: any) => {};

  writeValue(value: any) {

  }

  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }

  toggle() {
    // TODO: set the view to the max view
    this.view.view = 'days';
    this.view.isOpen = !this.view.isOpen;
    if(this.view.isOpen) {
      this.currentDate = moment(this.date.value, this.options.format);
      this.generateCalendar();
    }
  }

  open() {
    this.view.isOpen = true;
  }

  close() {
    this.view.isOpen = false;
  }

  setMinMaxView() {
    
  }

  generateCalendar() {
    this.days = [];
    let date = Moment(this.currentDate);
    let year = date.year();
    let month = date.month();
    let firstDayDate = `${year}-${month + 1}`;
    let daysInMonth = moment(firstDayDate, "YYYY-MM").daysInMonth();
    let startDay = moment(firstDayDate, "YYYY-MM-DD").format('dd');
    let index = this.view.weekdays.indexOf(startDay);
    let start = index > 0 ? -(index) + 1 : 1;
    let selectedDate: moment.Moment = this.date.momentObj;
    for (let i = start; i <= daysInMonth; i++) {
      let currentDate: moment.Moment = Moment(`${i}.${month + 1}.${year}`, 'DD.MM.YYYY');
      let selected: boolean = (selectedDate && selectedDate.isSame(currentDate, 'day')) ? true : false;
      let today: boolean = (Moment().isSame(currentDate, 'day') &&
        Moment().isSame(currentDate, 'month')) ? true : false;
      let betweenDates: boolean = true;

      if (this.options.minDate) {
        if (this.options.maxDate)
          betweenDates = currentDate.isBetween(this.minDateVal, this.maxDateVal, 'day', '[]') ? true : false;
        else
          betweenDates = currentDate.isBefore(this.minDateVal, 'day') ? false : true;
      } else if (this.options.maxDate) {
        betweenDates = currentDate.isAfter(this.maxDateVal, 'day') ? false : true;
      }

      let model: CalendarModel = {
        today: today,
        hidden: i < 1,
        day: i,
        month: month,
        year: year,
        selected: i > 0 && selected ? true : false,
        momentObj: i > 0 ? currentDate : null,
        disabled: i > 0 ? !betweenDates : true
      };

      this.days.push(model);
    }

    this.view.sets.dayView = Utils.getRows(this.days, 7);
  }

  generateYears(current) {
    this.view.years.current = current;
    this.view.years.min = current - this.view.years.step;
    this.view.years.max = current + this.view.years.step;
    this.view.years.values =
      Utils.range(current, this.view.years.max, this.view.years.min);
    this.view.sets.yearView = Utils.getRows(this.view.years.values, 3);
  }

  getSelectedMonth() {
    return this.view.months[this.currentDate.month()];
  }

  isMonthSelected(month) {
    return this.date.month === this.view.months.indexOf(month) &&
      parseInt(this.currentDate.year()) === this.date.year;
  }

  selectDate(obj) {
    if(obj.disabled) return;

    let selected: DatePickerDateModel = new DatePickerDateModel();
    selected.day = obj.day;
    selected.month = obj.month;
    selected.year = obj.year;
    selected.momentObj = obj.momentObj;
    selected.format(this.options.format);
    this.date = selected;
    this.generateCalendar();

    if (this.options.autoClose)
      this.close();

    this.onChangeCallback(this.date);
  }

  selectMonth(month) {

    let self = this;
    setTimeout(function () {
      self.currentDate.month(self.view.months.indexOf(month));
      self.generateCalendar();
      self.view.view = 'days';
    }, 50);

  }

  selectYear(year) {
    let self = this;
    setTimeout(function () {
      self.currentDate.year(year);
      self.view.view = 'months';
    }, 50);
  }

  openDayPicker(): void {
    this.view.view = 'days';
  }

  openMonthPicker(): void {
    let self = this;
    setTimeout(function () {
      self.view.view = 'months';
      self.view.sets.monthView = Utils.getRows(self.view.months, 3);
    }, 50);
  }

  openYearPicker(): void {
    let self = this;
    setTimeout(function () {
      self.view.view = 'years';
      self.generateYears(parseInt(self.currentDate.year()));
    }, 50);
  }

  nextMonth() {
    this.currentDate = this.currentDate.add(1, 'month');
    this.generateCalendar();
  }

  prevMonth() {
    this.currentDate = this.currentDate.subtract(1, 'month');
    this.generateCalendar();
  }

  nextYear() {
    let newDate: moment.Moment = this.currentDate;
    newDate.year(parseInt(this.currentDate.year()) + 1);
    newDate.month(0);
    newDate.day(1);
    this.currentDate = newDate;
    this.generateCalendar();
  }

  prevYear() {
    let newDate: moment.Moment = this.currentDate;
    newDate.year(parseInt(this.currentDate.year()) - 1);
    newDate.month(0);
    newDate.day(1);
    this.currentDate = newDate;
    this.generateCalendar();
  }

  nextYears() {
    this.generateYears(this.view.years.max + 5);
  }

  prevYears() {
    this.generateYears(this.view.years.min - 5);
  }
}
