import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgZorroAntdMobileModule } from 'ng-zorro-antd-mobile';
import { PickerViewModule } from 'ng-zorro-antd-mobile';
import { LottieSplashScreen } from '@ionic-native/lottie-splash-screen/ngx';
import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAnalyticsModule } from '@angular/fire/analytics';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { ToastrModule } from 'ngx-toastr';
import { NgxUiLoaderModule } from "ngx-ui-loader";
import { UtilService } from './services/util.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicSelectableModule } from 'ionic-selectable';
import { Camera } from '@ionic-native/camera/ngx';
import { RatingModalComponent } from './components/rating-modal/rating-modal.component';
import { CommonModule } from '@angular/common';

const PLUGINS = [
  ToastrModule.forRoot(), // ToastrModule added
  NgxUiLoaderModule,
  IonicSelectableModule
];

const FIREBASE_MODULES = [
  AngularFireModule.initializeApp(environment.firebase),
  AngularFireAnalyticsModule,
  AngularFirestoreModule
];

const IONIC_NATIVE_PLUGINS = [
  Camera
];


@NgModule({
  declarations: [
    AppComponent,
    RatingModalComponent
  ],
  entryComponents: [],
  imports: [
    BrowserAnimationsModule,
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule, 
    ReactiveFormsModule,
    NgZorroAntdMobileModule, 
    PickerViewModule,
    CommonModule,
    FormsModule,
    ...FIREBASE_MODULES,
    ...PLUGINS
  ],
  providers: [
    LottieSplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    UtilService,
    ...IONIC_NATIVE_PLUGINS
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
