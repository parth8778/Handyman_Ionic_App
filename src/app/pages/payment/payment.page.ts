import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import * as moment from 'moment';
import messages from 'src/app/messages/messages';
import { UtilService } from 'src/app/services/util.service';
declare var RazorpayCheckout: any;
@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage implements OnInit {
  planId = 2;
  constructor(
    private util: UtilService, 
    private firebaseAuth: AngularFireAuth,
    private fireStore: AngularFirestore
  ) {}

  ngOnInit() {}

  getPlanDetailsByPlanId(plan) {
    const planDetails: any = {
      price: 0,
      planName: '',
      planExpiredIn: '',
    };
    switch (plan) {
      case 1:
        planDetails.price = 500;
        planDetails.planName = 'Simple Plan';
        planDetails.planExpiredIn = moment()
          .add(1, 'month')
          .format('MM-DD-YYYY');
        break;

      case 2:
        planDetails.price = 5000;
        planDetails.planName = 'Professional Plan';
        planDetails.planExpiredIn = moment()
          .add(1, 'year')
          .format('MM-DD-YYYY');
        break;

      case 3:
        planDetails.price = 50000;
        planDetails.planName = 'Excellent Plan';
        planDetails.planExpiredIn = 'unlimited';
        break;

      default:
        planDetails.price = 500;
        planDetails.planName = 'Simple Plan';
        planDetails.planExpiredIn = 'Simple Plan';
        break;
    }
    return planDetails;
  }

  doSignOut() {
    localStorage.clear();
    this.firebaseAuth.signOut();
    this.util.navigateByURL('/', 'root');
  }


  choosePlan() {
    const request = this.getPlanDetailsByPlanId(this.planId);
    console.log('request: ', request);

    var options = {
      image:
        'https://s3.amazonaws.com/ionic-marketplace/home-service-finder-provider-app/icon.png',
      currency: 'INR',
      key: 'rzp_test_nmPvG6xl1JHKbe',
      amount: request.price * 100,
      name: request.planName,
      theme: {
        color: '#621fcf',
      },
    };

    const successCallback = (success) => {
      console.log('payment_id: ' + success.razorpay_payment_id);
      // var orderId = success.razorpay_order_id
      // var signature = success.razorpay_signature
      this.util.navigateByURL('tabs/reviews', 'root');
      this.fireStore
        .collection('users')
        .doc(localStorage.getItem('authenticatedId'))
        .update({
          payment: true,
          planExpiredIn: request.planExpiredIn,
          planPurchasedIn: success.razorpay_payment_id
        })
        .then(() => {
          this.util.showSuccessToast(
            messages.successTitle,
            messages.planSuccess
          );
          this.util.navigateByURL('/tabs/reviews', 'root');
        })
        .catch(() => {});
    };

    const cancelCallback = (error) => {
      console.log(error.description + ' (Error ' + error.code + ')');
    };

    RazorpayCheckout.on('payment.success', successCallback);
    RazorpayCheckout.on('payment.cancel', cancelCallback);
    RazorpayCheckout.open(options);
  }
}
