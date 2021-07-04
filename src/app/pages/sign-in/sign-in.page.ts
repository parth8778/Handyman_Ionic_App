import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { UtilService } from 'src/app/services/util.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { RolesEnum } from 'src/app/types/users';
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
    public fireStore: AngularFirestore,
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
          console.log('value.user: ', value.user);
          const { uid } = value.user;
          localStorage.setItem("authenticatedId", uid);
          let subscribe = this.fireStore.collection('users').doc(uid).valueChanges().subscribe((userResponse: any) => {
            if (userResponse) {
              if (userResponse.role === RolesEnum.PROVIDER) {
                localStorage.setItem("authenticatedUserRole", userResponse.role);
                this.util.navigateByURL('tabs/reviews', 'root');
                this.util.showSuccessToast(
                  messages.successTitle,
                  messages.loginInSuccess
                );
              } else if (userResponse.role === RolesEnum.USER) {
                localStorage.setItem("authenticatedUserRole", userResponse.role);
                this.util.navigateByURL('tabs/categories', 'root');
                this.util.showSuccessToast(
                  messages.successTitle,
                  messages.loginInSuccess
                );
              } else {
                this.util.showErrorToast(
                  messages.errorTitle,
                  messages.somethingWentWrong
                );
              }
            }
            subscribe.unsubscribe();
          });
        }
      })
      .catch((err) => {
        this.util.showErrorToast(messages.errorTitle, err.message);
        this.util.stopLoader();
      });
  }

  goToSignIn() {
    this.util.navigateByURL('/policy', 'forward')
  }
}
 