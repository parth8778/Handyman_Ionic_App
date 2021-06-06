import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import messages from 'src/app/messages/messages';
import { DataService } from 'src/app/services/data.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.page.html',
  styleUrls: ['./contact-us.page.scss'],
})
export class ContactUsPage implements OnInit {
  feedbackForm: FormGroup;
  userData: any;
  constructor(
    private builder: FormBuilder,
    private util: UtilService,
    private firebaseService: FirebaseService,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.dataService.userData.subscribe((res) => {
      this.userData = res;
      this.initForm();
    });
  }

  initForm() {
    this.feedbackForm = this.builder.group({
      fullName: [`${this.userData.firstName} ${this.userData.lastName}`, [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      contactNumber: [this.userData.contactNumber, [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(110)]],
      uid: [this.userData.id],
      email: [this.userData.email]
    });
  }

  submitFeedback() {
    if (this.feedbackForm.valid) {
      this.util.startLoader();
      this.firebaseService.addDataToCollection('feedback', this.feedbackForm.value).then(() => {
        this.util.stopLoader();
        this.util.showSuccessToast(messages.successTitle, messages.addFeedbackSuccess);
        this.feedbackForm.reset();
        this.initForm();
      }, () => {
        this.util.stopLoader();
        this.util.showErrorToast(messages.errorTitle, messages.somethingWentWrong);
      })
    }
  }

}
