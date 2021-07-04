import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ModalController } from '@ionic/angular';
import messages from 'src/app/messages/messages';
import { DataService } from 'src/app/services/data.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-rating-modal',
  templateUrl: './rating-modal.component.html',
  styleUrls: ['./rating-modal.component.scss'],
})
export class RatingModalComponent implements OnInit {
  selectedStar = 1;
  review: any = '';
  constructor(
    private util: UtilService,
    private dataService: DataService,
    public fireStore: AngularFirestore,
    private firebaseService: FirebaseService,
    private modalController: ModalController,
  ) { }

  ngOnInit() {
  }

  closeModal() {
    this.modalController.dismiss();
  }

  submitReview() {
    this.util.startLoader();
    const id = this.fireStore.createId();
    const request = {
      id,
      uId: this.dataService.dataTransfer.uId,
      bookingId: this.dataService.dataTransfer.bookingId,
      providerId: this.dataService.dataTransfer.providerId,
      rating: this.selectedStar,
      review: this.review
    };
    this.firebaseService.addOrUpdateCollection('ratings', request, id).then(() => {
      this.util.stopLoader();
      this.util.showSuccessToast(
        messages.successTitle,
        messages.ratingSuccess
      );
      this.closeModal();
      this.updateRatingStatus();
    }).catch((err) => {
      this.util.stopLoader();
      this.util.showErrorToast(messages.errorTitle, err.message);
    });
  }

  updateRatingStatus() {
    this.fireStore.collection('request').doc(this.dataService.dataTransfer.bookingId).update({
      ratingStatus: true
    }).then(() => {
      this.dataService.dataTransfer.ratingStatus = true;
    });
  }

}
