import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilService } from 'src/app/services/util.service';
import { RolesEnum } from 'src/app/types/users';
import messages from 'src/app/messages/messages';
import csc from 'country-state-city'
import { ICountry, ICity } from 'country-state-city';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {
  userForm: FormGroup;
  allCountries: ICountry[];
  allCities: ICity[];

  constructor(
    private firebaseAuth: AngularFireAuth,
    private firebaseService: FirebaseService,
    private builder: FormBuilder,
    private util: UtilService
  ) { 
    this.initForm();
  }

  ngOnInit() {
    this.allCountries = csc.getAllCountries() as ICountry[];
  }

  initForm() {
    this.userForm = this.builder.group({
      firstName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      lastName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      email: ['', [Validators.required, Validators.email]],
      country: ['', Validators.required],
      city: ['', Validators.required],
      contactNumber: ['', [Validators.required, Validators.minLength(10), Validators.pattern("^[0-9]*$")]],
      password: ['', [Validators.required, Validators.pattern("^(?=.*[a-z]*[A-Z])(?=.*[0-9]).{8,}")]],
      confirmPassword: ['', Validators.required],
    },{
      validator: this.checkIfMatchingPasswords('password', 'confirmPassword')
    });
  }

  checkIfMatchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
    return (group: FormGroup) => {
      let passwordInput = group.controls[passwordKey],
        passwordConfirmationInput = group.controls[passwordConfirmationKey];
      if (passwordInput.value !== passwordConfirmationInput.value) {
        return passwordConfirmationInput.setErrors({ notEquivalent: true })
      }
      else {
        return passwordConfirmationInput.setErrors(null);
      }
    }
  }

  onCountryChange(event) {
    if (event) {
      const { value } = event;
      this.allCities = csc.getCitiesOfCountry(value.isoCode) as ICity[];
      this.userForm.patchValue({
        city: ''       
      });
    }
  }

  createAccount() {
    if (this.userForm.valid) {
      this.util.startLoader();
      const { password, confirmPassword, ...userForm } = this.userForm.value;
      this.firebaseAuth.createUserWithEmailAndPassword(userForm.email, password).then((res) => {
        if (res) {
          const uId = res.user.uid;
          const request = {
            ...userForm,
            id: uId,
            role: RolesEnum.USER,
            status: true
          }
          this.firebaseService.addOrUpdateCollection('users', request, uId).then(() => {
            this.util.stopLoader();
            localStorage.setItem('authenticatedId', uId);
            this.util.showSuccessToast(messages.successTitle, messages.registerSuccess);
            this.util.navigateByURL('tabs/categories', 'root');
          }).catch((err) => {
            this.util.showErrorToast(messages.errorTitle, err.message);
            this.util.stopLoader();
          });
        }
      }, err => {
        this.util.showErrorToast(messages.errorTitle, err.message);
        this.util.stopLoader();
      });
    }
  }

}
