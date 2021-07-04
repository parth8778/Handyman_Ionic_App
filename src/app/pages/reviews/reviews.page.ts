import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { DataService } from 'src/app/services/data.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.page.html',
  styleUrls: ['./reviews.page.scss'],
})
export class ReviewsPage implements OnInit {
  totalRatings = 0;
  statistics: any;
  constructor(
    private fireStore: AngularFirestore,
    private util: UtilService,
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.getAllReviews();
  }

  getAllReviews() {
    this.util.startLoader();
    const authenticatedId = localStorage.getItem('authenticatedId');
    this.fireStore
      .collection('ratings', (ref) =>
        ref.where('providerId', '==', authenticatedId)
      )
      .valueChanges()
      .subscribe((resp) => {
        const reviewsCount = {
          fiveStars: {
            count: 0,
            star: 0,
            percentage: 0
          },
          fourStars: {
            count: 0,
            star: 0,
            percentage: 0
          },
          threeStars: {
            count: 0,
            star: 0,
            percentage: 0
          },
          twoStars: {
            count: 0,
            star: 0,
            percentage: 0
          },
          oneStars: {
            count: 0,
            star: 0,
            percentage: 0
          },
        };
        let totalReviews = 0;
        if (resp && resp.length > 0) {
          resp.forEach((elm: any) => {
            let sub = this.fireStore.collection('users').doc(elm.uId).valueChanges().subscribe((userResp) => {
              elm.userDetails = userResp;
              sub.unsubscribe();
            });
            if (elm.rating === 1) {
              reviewsCount.oneStars.star+=1;
              reviewsCount.oneStars.count++;
            } else if (elm.rating === 2) {
              reviewsCount.oneStars.star+=2;
              reviewsCount.twoStars.count++;
            } else if (elm.rating === 3) {
              reviewsCount.oneStars.star+=3;
              reviewsCount.threeStars.count++;
            } else if (elm.rating === 4) {
              reviewsCount.fourStars.star+=4;
              reviewsCount.fourStars.count++; 
            } else if (elm.rating === 5) {
              reviewsCount.fiveStars.star+=5;
              reviewsCount.fiveStars.count++;
            }
            totalReviews = (totalReviews+elm.rating);
            this.totalRatings = totalReviews / resp.length;
            reviewsCount.fiveStars.percentage = reviewsCount.fiveStars.count / resp.length * 100;
            reviewsCount.fourStars.percentage = reviewsCount.fourStars.count / resp.length * 100;
            reviewsCount.threeStars.percentage = reviewsCount.threeStars.count / resp.length * 100;
            reviewsCount.twoStars.percentage = reviewsCount.twoStars.count / resp.length * 100;
            reviewsCount.oneStars.percentage = reviewsCount.oneStars.count / resp.length * 100;
            this.statistics = reviewsCount;
            this.dataService.allReviews = resp;
          });
        }
        this.util.startLoader();
      });
  }

  goToReviewList() {
    this.util.navigateByURL('reviews-list', 'forward')
  }
}
