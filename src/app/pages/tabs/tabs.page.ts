import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { RolesEnum } from 'src/app/types/users';
@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  userDetails: any;
  activatedRoute: any;
  activatedRole = localStorage.getItem('authenticatedUserRole') || RolesEnum.USER;
  readonly RolesEnum = RolesEnum;
  constructor(
    private dataService: DataService,
    private router: Router
  ) {
    this.activatedRoute = this.router.url;
    this.dataService.userData.subscribe((user) => {
      if (user) {
        this.userDetails = user;
      }
    });
  }

  onTabChange() {
    this.activatedRoute = this.router.url;
  }
}
