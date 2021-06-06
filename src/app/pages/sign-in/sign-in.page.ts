import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { UtilService } from 'src/app/services/util.service';
import messages from 'src/app/messages/messages';
@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage implements OnInit {
  email = '';
  password = '';
  constructor(
    private firebaseAuth: AngularFireAuth,
    public util: UtilService
  ) { }

  ngOnInit() {
  }

  signIn() {
    this.util.startLoader();
    this.firebaseAuth
      .signInWithEmailAndPassword(this.email, this.password)
      .then((value) => {
        this.util.stopLoader();
        if (value && value.user) {
          const { uid } = value.user;
          localStorage.setItem("authenticatedId", uid);
          this.util.navigateByURL('tabs/categories', 'root');
          this.util.showSuccessToast(
            messages.successTitle,
            messages.loginInSuccess
          );
        }
        this.util.showErrorToast(
          messages.errorTitle,
          messages.somethingWentWrong
        );
      })
      .catch((err) => {
        this.util.showErrorToast(messages.errorTitle, err.message);
        this.util.stopLoader();
      });
  }

}
 