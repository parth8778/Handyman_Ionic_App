import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-language',
  templateUrl: './language.page.html',
  styleUrls: ['./language.page.scss'],
})
export class LanguagePage implements OnInit {

  languages: string[] = [
    'English',
    'Arabic',
    'Spanish',
    'French'
  ];

  selectedLan: string = 'English';

  constructor() { }

  ngOnInit() {
  }

}
