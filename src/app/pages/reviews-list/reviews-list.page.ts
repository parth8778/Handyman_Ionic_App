import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-reviews-list',
  templateUrl: './reviews-list.page.html',
  styleUrls: ['./reviews-list.page.scss'],
})
export class ReviewsListPage implements OnInit {
  reviews: any = [];
  constructor(
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.reviews = this.dataService.allReviews; 
    console.log('this.reviews: ', this.reviews);
  }

}
