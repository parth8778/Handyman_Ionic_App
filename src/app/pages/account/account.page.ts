import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { DataService } from 'src/app/services/data.service';
import { UtilService } from 'src/app/services/util.service';
@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {
  userData: any;
  constructor(
    public util: UtilService,
    private firebaseAuth: AngularFireAuth,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.dataService.userData.subscribe((user) => {
      if (user) {
        this.userData = user;
      }
    });
  }

  doSignOut() {
    localStorage.clear();
    this.firebaseAuth.signOut();
    this.util.navigateByURL('/', 'root');
  }

}
