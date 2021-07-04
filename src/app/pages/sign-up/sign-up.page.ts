import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilService } from 'src/app/services/util.service';
import { RolesEnum } from 'src/app/types/users';
import messages from 'src/app/messages/messages';
import csc from 'country-state-city'
import { ICountry, ICity } from 'country-state-city';
import { ActionSheetController } from '@ionic/angular';
import { Camera } from "@ionic-native/camera/ngx";
enum ImagePickerOptions {
 CAMERA = 'CAMERA', 
 GALLERY = 'GALLERY'
}
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {
  userForm: FormGroup;
  allCountries: ICountry[];
  allCities: ICity[];
  previewProfileImage: string;
  defaultImage = 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Arh-avatar.jpg';
  constructor(
    private firebaseAuth: AngularFireAuth,
    private firebaseService: FirebaseService,
    private builder: FormBuilder,
    private util: UtilService,
    private camera: Camera,    
    private actionSheetController: ActionSheetController
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
      image: [this.defaultImage]
    },{
      validator: this.checkIfMatchingPasswords('password', 'confirmPassword')
    });

    this.previewProfileImage = this.defaultImage;
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
            localStorage.setItem("authenticatedUserRole", RolesEnum.USER);
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

  goToPolicy() {
    this.util.navigateByURL('policy', 'forward')
  }
}
