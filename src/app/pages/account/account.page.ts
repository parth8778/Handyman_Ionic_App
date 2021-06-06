import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {

  constructor(
    public util: UtilService,
    private firebaseAuth: AngularFireAuth
  ) { }

  ngOnInit() {
  }

  doSignOut() {
    localStorage.clear();
    this.firebaseAuth.signOut();
    this.util.navigateByURL('/', 'root');
  }

}
