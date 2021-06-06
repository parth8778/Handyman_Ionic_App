import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { LottieSplashScreen } from '@ionic-native/lottie-splash-screen/ngx';
import { Platform } from '@ionic/angular';
import { DataService } from './services/data.service';
import { UtilService } from './services/util.service';

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
    private firebaseAuth: AngularFireAuth
  ) {
    this.initializeApp();
    if (localStorage.getItem('authenticatedId')) {
      this.util.navigateByURL('tabs/categories', 'root');
    }

    this.firebaseAuth.authState.subscribe((authRes) => {
      if (authRes) {
        this.fireStore.collection('users', (ref) => 
        ref.where('id', '==', authRes.uid))
        .valueChanges().subscribe((userRes) => { 
          if(userRes && userRes.length > 0) {
            this.dataService.userData.next(userRes[0]);
          }
        });
      }
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      setTimeout(() => {
        this.lottieSplashScreen.hide()
      }, 3000);
    });
  }

}
