import {Component, OnDestroy, OnInit} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit, OnDestroy{


  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    localStorage.clear();
    window.localStorage.clear();
  }


}
