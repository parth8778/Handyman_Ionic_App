import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor(
    private navCtrl: NavController,
    public ngxService: NgxUiLoaderService,
    private toastr: ToastrService
  ) { }

  public navigateByURL(url: string, direction: 'backward' | 'forward' | 'root' | 'back'): void {
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

  startLoader() {
    this.ngxService.start(); // start foreground spinner of the master loader with 'default' taskId
    // Stop the foreground loading after 5s
    setTimeout(() => {
      this.ngxService.stop(); // stop foreground spinner of the master loader with 'default' taskId
    }, 5000);
  }

  stopLoader() {
    this.ngxService.stop(); // stop foreground spinner of the master loader with 'default' taskId
  }
  
  showSuccessToast(text, title) {
    this.toastr.success(title, text, {
      progressBar: true
    });
  }

  showErrorToast(text, title) {
    this.toastr.error(title, text, {
      progressBar: true
    });
  }
}
