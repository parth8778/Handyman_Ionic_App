import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilService } from 'src/app/services/util.service';
import messages from 'src/app/messages/messages';
import csc from 'country-state-city';
import { ICountry, ICity } from 'country-state-city';
import { ActionSheetController } from '@ionic/angular';
import { Camera } from '@ionic-native/camera/ngx';
import { DataService } from 'src/app/services/data.service';
enum ImagePickerOptions {
  CAMERA = 'CAMERA',
  GALLERY = 'GALLERY',
}

@Component({
  selector: 'app-edit-provider-profile',
  templateUrl: './edit-provider-profile.page.html',
  styleUrls: ['./edit-provider-profile.page.scss'],
})
export class EditProviderProfilePage implements OnInit {
  userForm: FormGroup;
  categories = [];
  services = [];
  allCountries: ICountry[];
  allCities: ICity[];
  previewProfileImage: string;
  defaultImage =
    'https://upload.wikimedia.org/wikipedia/commons/a/a0/Arh-avatar.jpg';

  constructor(
    private firebaseService: FirebaseService,
    private builder: FormBuilder,
    private util: UtilService,
    private fireStore: AngularFirestore,
    private camera: Camera,
    private dataService: DataService,
    private actionSheetController: ActionSheetController
  ) {
    this.initForm(this.dataService.userDetails);
  }

  ngOnInit() {
    this.allCountries = csc.getAllCountries() as ICountry[];
    this.getCategories();
  }

  goToPolicy() {
    this.util.navigateByURL('policy', 'forward')
  }

  getCategories() {
    this.util.startLoader();
    this.firebaseService.getDataFromCollection('categories').subscribe(
      (res) => {
        if (res) {
          this.categories = res;
          this.userForm.patchValue({
            selectedCategory: this.dataService.userDetails.selectedCategory
          })
          this.util.stopLoader();
        }
      },
      (err) => {
        console.log('err: ', err);
        this.util.stopLoader();
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
        city: '',
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
            console.log('res: ', res);
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

  initForm(userDetails) {
    this.userForm = this.builder.group({
      firstName: [
        userDetails.firstName,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
        ],
      ],
      lastName: [
        userDetails.lastName,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
        ],
      ],
      email: [userDetails.email, [Validators.required, Validators.email]],
      contactNumber: [
        userDetails.contactNumber,
        [
          Validators.required,
          Validators.minLength(10),
          Validators.pattern('^[0-9]*$'),
        ],
      ],
      price: [userDetails.price, Validators.required],
      about: [userDetails.about, Validators.required],
      selectedCategory: [userDetails.selectedCategory, Validators.required],
      selectedServices: [userDetails.selectedServices, Validators.required],
      country: [userDetails.country, Validators.required],
      city: [userDetails.city, Validators.required],
      image: [userDetails.image],
    });

    this.previewProfileImage = userDetails.image || this.defaultImage;
  }

  uploadImageToStorage(fileUri) {
    try {
      this.util.startLoader();
      const filePath = `bucket/${Date.now()}`;
      const uploadTask = this.firebaseService.storage
        .ref(filePath)
        .putString(fileUri, 'base64', { contentType: 'image/jpg' });

      uploadTask
        .then((uploadTaskResponse) => {
          uploadTaskResponse.ref.getDownloadURL().then(
            (downloadURL) => {
              this.userForm.patchValue({
                image: downloadURL || this.defaultImage,
              });
              this.previewProfileImage = downloadURL || this.defaultImage;
            },
            (downloadURLError) => {
              console.log('downloadURLError: ', downloadURLError);
            }
          );
        })
        .catch((uploadTaskError) => {
          console.log('uploadTaskError: ', uploadTaskError);
        });
    } catch (Error) {
      console.log('Error: ', Error);
      this.util.stopLoader();
    }
  }

  async presentPhotoUploadActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Pick one of the option',
      buttons: [
        {
          text: 'Gallery',
          icon: 'images',
          handler: () => {
            this.selectImageToUpload(ImagePickerOptions.GALLERY);
            console.log('Delete clicked');
          },
        },
        {
          text: 'Camera',
          icon: 'camera',
          handler: () => {
            this.selectImageToUpload(ImagePickerOptions.CAMERA);
            console.log('Share clicked');
          },
        },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          },
        },
      ],
    });
    await actionSheet.present();

    const { role } = await actionSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  selectImageToUpload(option) {
    let cameraOptions = {};

    if (option === ImagePickerOptions.CAMERA) {
      cameraOptions = {
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        correctOrientation: true,
      };
    } else {
      cameraOptions = {
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        correctOrientation: true,
      };
    }

    this.camera.getPicture(cameraOptions).then((fileUri) => {
      this.uploadImageToStorage(fileUri);
    });
  }

  updateProfile() {
    if (this.userForm.valid) {
      this.util.startLoader();
      console.log('this.userForm.value: ', this.userForm.value);
      const id = this.dataService.userDetails.id;
      const request = {
        ...this.userForm.value,
      };
      console.log('request: ', request);
      this.fireStore
        .collection('users')
        .doc(id)
        .update(request)
        .then(() => {
          this.util.stopLoader();
          this.util.showSuccessToast(
            messages.successTitle,
            messages.profileUpdateSuccess
          );
        })
        .catch(() => {
          this.util.showErrorToast(
            messages.errorTitle,
            messages.somethingWentWrong
          );
          this.util.stopLoader();
        });
    }
  }
}
