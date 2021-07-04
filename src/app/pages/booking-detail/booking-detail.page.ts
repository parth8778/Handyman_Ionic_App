import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { UtilService } from 'src/app/services/util.service';
import * as moment from 'moment';
import { FirebaseService } from 'src/app/services/firebase.service';
import messages from 'src/app/messages/messages';
import { AngularFirestore } from '@angular/fire/firestore';
@Component({
  selector: 'app-booking-detail',
  templateUrl: './booking-detail.page.html',
  styleUrls: ['./booking-detail.page.scss'],
})
export class BookingDetailPage implements OnInit {
  bookingDetail: any;
  addressForm: FormGroup;
  calender: string[] = [];
  selectedDate: string;
  userDetails: any;
  constructor(
    public util: UtilService,
    private dataService: DataService,
    private builder: FormBuilder,
    private firebaseService: FirebaseService,
    private fireStore: AngularFirestore
  ) {}

  ngOnInit() {
    this.initForm();
    this.getCalender();
    this.setupDetail();
    this.dataService.userData.subscribe((res) => {
      this.userDetails = res;
    });
  }

  initForm() {
    this.addressForm = this.builder.group({
      bookingTime: ['', Validators.required],
      location: ['', Validators.required],
      houseNumber: ['', Validators.required],
      society: ['', Validators.required],
      fullAddress: ['', Validators.required],
      landmark: ['', Validators.required],
    });
  }

  setupDetail() {
    if (
      this.dataService.bookingData &&
      this.dataService.bookingData.providerDetails
    ) {
      this.bookingDetail = this.dataService.bookingData;
    }
  }

  getCalender() {
    this.calender = []
    let previousDate = moment().add(1, 'day').format('MM-DD-YYYY');
    for (let index = 0; index < 10; index++) {
      this.calender.push(previousDate);
      previousDate = moment(previousDate, 'MM-DD-YYYY').add(1, 'day').format('MM-DD-YYYY');
    }

    if(this.calender && this.calender.length > 0) {
      this.selectedDate = this.calender[0];
    }
  }

  bookAnAppointment() {
    this.util.startLoader();
    const bookingId = this.fireStore.createId();
    const request = {
      ...this.addressForm.value,
      bookingDate: this.selectedDate,
      providerId: this.bookingDetail.providerDetails.id,
      selectedCategory: this.bookingDetail.selectedCategory,
      selectedServices: this.bookingDetail.selectedServices,
      uId: this.userDetails.id,
      bookingId,
      bookingStatus: 0,
      status: true,
      timelineDates: {
        jobCreatedAt: moment().format('MM-DD-YYYY h:mm:ss a')
      }
    };
    
    this.firebaseService
    .addOrUpdateCollection('request', request, bookingId)
    .then(() => {
      this.util.stopLoader();
      this.util.showSuccessToast(
        messages.successTitle,
        messages.bookingHasBeenSuccess
      );
      this.util.stopLoader();
      this.util.navigateByURL('tabs/request', 'root');
    })
    .catch((err) => {
      this.util.showErrorToast(messages.errorTitle, err.message);
      this.util.stopLoader();
    });
  }
}
