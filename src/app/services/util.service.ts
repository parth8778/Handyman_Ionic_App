import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor(
    private navCtrl: NavController
  ) { }

  public navigateByURL(url: string, direction: string): void {
    if(direction === 'forward') {
      this.navCtrl.navigateForward(url);
    } else if (direction === 'backward') {
      this.navCtrl.navigateBack(url);
    } else if (direction === 'root') {
      this.navCtrl.navigateRoot(url);
    } else if (direction === 'back') {
      this.navCtrl.back();
    }
  }
}
