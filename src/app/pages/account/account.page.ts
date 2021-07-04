import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { DataService } from 'src/app/services/data.service';
import { UtilService } from 'src/app/services/util.service';
import { RolesEnum } from 'src/app/types/users';
@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {
  userData: any;
  activatedRole = localStorage.getItem('authenticatedUserRole');
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

  goToEditProfile() {
    if (this.activatedRole === RolesEnum.USER) {
      this.util.navigateByURL('/edit-user-profile', 'forward');
    } else {
      this.util.navigateByURL('/edit-provider-profile', 'forward');
    }
  }

}
