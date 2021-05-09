import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.page.html',
  styleUrls: ['./faqs.page.scss'],
})
export class FaqsPage implements OnInit {

  faqs = [
    {
      question: 'About service',
      open: false,
      answer: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus asperiores amet odio illum, vitae necessitatibus reiciendis'
    },
    {
      question: 'Sign in & Sign up',
      open: false,
      answer: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus asperiores amet odio illum, vitae necessitatibus reiciendis'
    },
    {
      question: 'Payment policy',
      open: false,
      answer: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus asperiores amet odio illum, vitae necessitatibus reiciendis'
    },
    {
      question: 'Ratings',
      open: false,
      answer: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus asperiores amet odio illum, vitae necessitatibus reiciendis'
    },
  ]

  constructor() { }

  ngOnInit() {
  }

  openQuestion(obj) {
    obj.open = !obj.open;
  }

}
