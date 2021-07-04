import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ModalController } from '@ionic/angular';
import { RatingModalComponent } from 'src/app/components/rating-modal/rating-modal.component';
import messages from 'src/app/messages/messages';
import { DataService } from 'src/app/services/data.service';
import { UtilService } from 'src/app/services/util.service';
import { JobStatus } from 'src/app/types/booking';
import { RolesEnum } from 'src/app/types/users';
@Component({
  selector: 'app-request-detail',
  templateUrl: './request-detail.page.html',
  styleUrls: ['./request-detail.page.scss'],
})
export class RequestDetailPage implements OnInit {
  requestDetails: any;
  activatedRole = localStorage.getItem('authenticatedUserRole');
  readonly RolesEnum = RolesEnum;
  readonly JobStatusEnum = JobStatus;
  constructor(
    private dataService: DataService,
    private fireStore: AngularFirestore,
    private util: UtilService,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    console.log('this.dataService.dataTransfer: ', this.dataService.dataTransfer);
    this.requestDetails = this.dataService.dataTransfer;
  }
  
  changeJobStatus(JobStatus: JobStatus) {
    this.util.startLoader();
    this.fireStore.collection('request').doc(this.requestDetails.bookingId).update({
      bookingStatus: JobStatus
    }).then(() => {
      this.requestDetails.bookingStatus = JobStatus;
      this.util.showSuccessToast(
        messages.successTitle,
        messages.jobStatusChangedSuccess
      );
      this.util.stopLoader();
    }).catch((err) => {
      this.util.showErrorToast(messages.errorTitle, err.message);
      this.util.stopLoader();
    });
  }

  async doRating() {
    const modal = await this.modalController.create({
      component: RatingModalComponent,
      cssClass: 'my-custom-class'
    });
    return await modal.present();
  }
} 
