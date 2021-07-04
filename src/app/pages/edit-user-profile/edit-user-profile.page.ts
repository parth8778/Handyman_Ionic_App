import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilService } from 'src/app/services/util.service';
import { ICountry, ICity } from 'country-state-city';
import { ActionSheetController } from '@ionic/angular';
import { Camera } from "@ionic-native/camera/ngx";
import { DataService } from 'src/app/services/data.service';
import { AngularFirestore } from '@angular/fire/firestore';
import messages from 'src/app/messages/messages';
import csc from 'country-state-city'

enum ImagePickerOptions {
 CAMERA = 'CAMERA', 
 GALLERY = 'GALLERY'
}

@Component({
  selector: 'app-edit-user-profile',
  templateUrl: './edit-user-profile.page.html',
  styleUrls: ['./edit-user-profile.page.scss'],
})
export class EditUserProfilePage implements OnInit {
  userForm: FormGroup;
  allCountries: ICountry[];
  allCities: ICity[];
  previewProfileImage: string;
  defaultImage = 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Arh-avatar.jpg';
  constructor(
    private firebaseService: FirebaseService,
    private builder: FormBuilder,
    private util: UtilService,
    private camera: Camera,    
    private actionSheetController: ActionSheetController,
    private dataService: DataService,
    private fireStore: AngularFirestore
  ) { 
    this.initForm(this.dataService.userDetails);
  } 

  ngOnInit() {
    this.allCountries = csc.getAllCountries() as ICountry[];
  }

  initForm(userDetails) {
    this.userForm = this.builder.group({
      firstName: [userDetails.firstName, [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      lastName: [userDetails.lastName, [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      email: [userDetails.email, [Validators.required, Validators.email]],
      country: [userDetails.country, Validators.required],
      city: [userDetails.city, Validators.required],
      contactNumber: [userDetails.contactNumber, [Validators.required, Validators.minLength(10), Validators.pattern("^[0-9]*$")]],
      image: [userDetails.image]
    });

    this.previewProfileImage = userDetails.image;
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

  async presentPhotoUploadActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Pick one of the option',
      buttons: [{
        text: 'Gallery',
        icon: 'images',
        handler: () => {
          this.selectImageToUpload(ImagePickerOptions.GALLERY);
          console.log('Delete clicked');
        }
      }, {
        text: 'Camera',
        icon: 'camera',
        handler: () => {
          this.selectImageToUpload(ImagePickerOptions.CAMERA);
          console.log('Share clicked');
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
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
        correctOrientation: true
      }
    } else {
      cameraOptions = {
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        correctOrientation: true
      }
    } 
   
    this.camera.getPicture(cameraOptions).then(fileUri => {
      this.uploadImageToStorage(fileUri);
    });
  }

  uploadImageToStorage(fileUri) {
    try {
      this.util.startLoader();
      const filePath = `bucket/${Date.now()}`;
      const uploadTask = this.firebaseService.storage.ref(filePath)
      .putString(fileUri, 'base64', {contentType:'image/jpg'});
      
      uploadTask.then((uploadTaskResponse) => {
        uploadTaskResponse.ref.getDownloadURL().then((downloadURL) => {
          this.userForm.patchValue({
            image: downloadURL
          });
          this.previewProfileImage = downloadURL;
        }, downloadURLError => {
          console.log('downloadURLError: ', downloadURLError);
        })
      }).catch((uploadTaskError) => {
        console.log('uploadTaskError: ', uploadTaskError);
      });
    
    } catch (Error) {
      console.log("Error: ", Error);
      this.util.stopLoader();
    }
  }

  updateProfile() {
    if (this.userForm.valid) {
      this.util.startLoader();
      const id = this.dataService.userDetails.id;
      const request = {
        ...this.userForm.value,
      };
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
 
  goToPolicy() {
    this.util.navigateByURL('policy', 'forward')
  } 
}