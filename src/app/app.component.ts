import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { LottieSplashScreen } from '@ionic-native/lottie-splash-screen/ngx';
import { AlertController, Platform } from '@ionic/angular';
import { DataService } from './services/data.service';
import { UtilService } from './services/util.service';
import { RolesEnum } from './types/users';
import messages from './messages/messages';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private lottieSplashScreen: LottieSplashScreen,
    private platform: Platform,
    private util: UtilService,
    public fireStore: AngularFirestore,
    public dataService: DataService,
    private firebaseAuth: AngularFireAuth,
    private _location: Location,
    private alertController: AlertController
  ) {
    if (localStorage.getItem('authenticatedId')) {
      const role = localStorage.getItem('authenticatedUserRole');
      if (role === RolesEnum.USER) {
        this.util.navigateByURL('tabs/categories', 'root');
      } else if (role === RolesEnum.PROVIDER) {
        this.util.navigateByURL('tabs/reviews', 'root');
      }
    }

    this.firebaseAuth.authState.subscribe((authRes) => {
      if (authRes) {
        this.fireStore
          .collection('users', (ref) => ref.where('id', '==', authRes.uid))
          .valueChanges()
          .subscribe((userRes: any) => {
            if (userRes && userRes.length > 0) {
              this.dataService.userData.next(userRes[0]);
              this.dataService.userDetails = userRes[0];
              if (userRes[0].role === RolesEnum.PROVIDER) {
                if (!userRes[0].payment) {
                  this.util.navigateByURL('payment', 'root');
                }
                if (new Date() > new Date(userRes[0].planExpiredIn)) {
                  this.util.showErrorToast(
                    messages.errorTitle,
                    messages.planExpired
                  );
                  this.util.navigateByURL('payment', 'root');
                }
              }
            }
          });
      }
    });

    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      setTimeout(() => {
        this.lottieSplashScreen.hide();
      }, 3000);

      this.platform.backButton.subscribeWithPriority(
        10,
        (processNextHandler) => {
          console.log('Back press handler!');
          if (
            this._location.isCurrentPathEqualTo('/tabs/categories') ||
            this._location.isCurrentPathEqualTo('/tabs/request') ||
            this._location.isCurrentPathEqualTo('/tabs/account') ||
            this._location.isCurrentPathEqualTo('/tabs/reviews') ||
            this._location.isCurrentPathEqualTo('/tabs/chat') ||
            this._location.isCurrentPathEqualTo('/sign-in') ||
            this._location.isCurrentPathEqualTo('/signIn') ||
            this._location.isCurrentPathEqualTo('sign-in') ||
            this._location.isCurrentPathEqualTo('/') ||
            this._location.isCurrentPathEqualTo('/payment')
          ) {
            // Show Exit Alert!
            console.log('Show Exit Alert!');
            this.showExitConfirm();
            processNextHandler();
          } else {
            // Navigate to back page
            console.log('Navigate to back page');
            this._location.back();
          }
        }
      );

      this.platform.backButton.subscribeWithPriority(5, () => {
        console.log('Handler called to force close!');
        this.alertController
          .getTop()
          .then((r) => {
            if (r) {
              navigator['app'].exitApp();
            }
          })
          .catch((e) => {
            console.log(e);
          });
      });
    });
  }

  showExitConfirm() {
    this.alertController
      .create({
        header: 'App termination',
        message: 'Do you want to close the app?',
        backdropDismiss: false,
        mode: 'ios',
        buttons: [
          {
            text: 'Stay',
            role: 'cancel',
            handler: () => {
              console.log('Application exit prevented!');
            },
          },
          {
            text: 'Exit',
            handler: () => {
              navigator['app'].exitApp();
            },
          },
        ],
      })
      .then((alert) => {
        alert.present();
      });
  }
}
