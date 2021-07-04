import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { DataService } from 'src/app/services/data.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-provider-detail',
  templateUrl: './provider-detail.page.html',
  styleUrls: ['./provider-detail.page.scss'],
})
export class ProviderDetailPage implements OnInit {
  activeSegment: string = 'about';
  bookingDetail: any;
  services = [];
  constructor(
    public util: UtilService,
    private dataService: DataService,
    private fireStore: AngularFirestore
  ) {}

  ngOnInit() {
    this.setupDetail();
    this.getServices();
  }

  getServices() {
    const services =
      this.dataService.bookingData.providerDetails.selectedServices;
    if (services && services.length > 0) {
      services.forEach((service) => {
        let subscribe = this.fireStore
          .collection('services')
          .doc(service)
          .valueChanges()
          .subscribe((res) => {
            this.services.push(res);
            subscribe.unsubscribe();
          });
      });
    }
  }

  setupDetail() {
    if (
      this.dataService.bookingData &&
      this.dataService.bookingData.providerDetails
    ) {
      this.bookingDetail = this.dataService.bookingData;
    }
  }

  segmentChanged(event) {
    if (event && event.target && event.target.value) {
      this.activeSegment = event.target.value;
    }
  }
}
