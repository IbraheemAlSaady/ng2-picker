import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';
  date = '';
  minDate = new Date(2016, 10, 1);
  maxDate = new Date(2017, 2, 0);

  constructor() {
    //console.log(this.minDate);
  }

  change(dateVal) {
    dateVal = {
      day: 1,
      month: 1,
      year: 2017
    };
  }
}
