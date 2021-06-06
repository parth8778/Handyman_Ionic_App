import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilService } from 'src/app/services/util.service';
import { RolesEnum } from 'src/app/types/users';
import messages from 'src/app/messages/messages';
import csc from 'country-state-city'
import { ICountry, ICity } from 'country-state-city';

@Component({
  selector: 'app-provider-signup',
  templateUrl: './provider-signup.page.html',
  styleUrls: ['./provider-signup.page.scss'],
})
export class ProviderSignupPage implements OnInit {
  userForm: FormGroup;
  categories = [];
  services = [];
  allCountries: ICountry[];
  allCities: ICity[];

  constructor(
    private firebaseAuth: AngularFireAuth,
    private firebaseService: FirebaseService,
    private builder: FormBuilder,
    private util: UtilService,
    private fireStore: AngularFirestore
  ) {
    this.initForm();
  }

  ngOnInit() {
    this.allCountries = csc.getAllCountries() as ICountry[];
    this.getCategories();
  }

  getCategories() {
    this.firebaseService.getDataFromCollection('categories').subscribe(
      (res) => {
        if (res) {
          this.categories = res;
        }
      },
      (err) => {
        console.log('err: ', err);
        this.util.showErrorToast(
          messages.errorTitle,
          messages.somethingWentWrong
        );
      }
    );
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

  getServices() {
    const { selectedCategory } = this.userForm.value;
    if (selectedCategory) {
      this.util.startLoader();
      this.fireStore
        .collection('services', (ref) =>
          ref.where('categoryId', '==', selectedCategory)
        )
        .valueChanges()
        .subscribe(
          (res) => {
            if (res) {
              this.services = res;
            }
            this.util.stopLoader();
          },
          (err) => {
            this.util.stopLoader();
            console.log('err: ', err);
          }
        );
    }
  }

  initForm() {
    this.userForm = this.builder.group(
      {
        firstName: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(30),
          ],
        ],
        lastName: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(30),
          ],
        ],
        email: ['', [Validators.required, Validators.email]],
        contactNumber: [
          '',
          [
            Validators.required,
            Validators.minLength(10),
            Validators.pattern('^[0-9]*$'),
          ],
        ],
        price: ['', Validators.required],
        password: [
          '',
          [
            Validators.required,
            Validators.pattern('^(?=.*[a-z]*[A-Z])(?=.*[0-9]).{8,}'),
          ],
        ],
        confirmPassword: ['', Validators.required],
        about: ['', Validators.required],
        selectedCategory: ['', Validators.required],
        selectedServices: ['', Validators.required],
        country: ['', Validators.required],
        city: ['', Validators.required]
      },
      {
        validator: this.checkIfMatchingPasswords('password', 'confirmPassword'),
      }
    );
  }

  checkIfMatchingPasswords(
    passwordKey: string,
    passwordConfirmationKey: string
  ) {
    return (group: FormGroup) => {
      let passwordInput = group.controls[passwordKey],
        passwordConfirmationInput = group.controls[passwordConfirmationKey];
      if (passwordInput.value !== passwordConfirmationInput.value) {
        return passwordConfirmationInput.setErrors({ notEquivalent: true });
      } else {
        return passwordConfirmationInput.setErrors(null);
      }
    };
  }

  createAccount() {
    if (this.userForm.valid) {
      this.util.startLoader();
      const { password, confirmPassword, ...userForm } = this.userForm.value;
      this.firebaseAuth
        .createUserWithEmailAndPassword(userForm.email, password)
        .then(
          (res) => {
            if (res) {
              const uId = res.user.uid;
              const request = {
                ...userForm,
                id: uId,
                role: RolesEnum.PROVIDER,
                status: true
              };
              this.firebaseService
                .addOrUpdateCollection('users', request, uId)
                .then(() => {
                  this.util.stopLoader();
                  localStorage.setItem('authenticatedId', uId);
                  this.util.showSuccessToast(
                    messages.successTitle,
                    messages.registerSuccess
                  );
                  this.util.navigateByURL('tabs/categories', 'root');
                })
                .catch((err) => {
                  this.util.showErrorToast(messages.errorTitle, err.message);
                  this.util.stopLoader();
                });
            }
          },
          (err) => {
            this.util.showErrorToast(messages.errorTitle, err.message);
            this.util.stopLoader();
          }
        );
    }
  }
}
