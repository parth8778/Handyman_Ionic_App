import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import messages from 'src/app/messages/messages';
import { DataService } from 'src/app/services/data.service';
import { UtilService } from 'src/app/services/util.service';
import { RolesEnum } from 'src/app/types/users';

@Component({
  selector: 'app-providers',
  templateUrl: './providers.page.html',
  styleUrls: ['./providers.page.scss'],
})
export class ProvidersPage implements OnInit {
  providers = [];
  constructor(
    public util: UtilService,
    public dataService: DataService,
    public fireStore: AngularFirestore
  ) { }

  ngOnInit() {
    this.getProviders();
  }

  getProviders() {
    this.util.startLoader();
    const categoryId = this.dataService.bookingData.selectedCategory.categoryId;
    this.fireStore
    .collection('users', (ref) => ref
      .where('role', '==', RolesEnum.PROVIDER)
      .where('selectedCategory', '==', categoryId)
    )
    .valueChanges()
    .subscribe(
      (res) => {
        if (res && res.length > 0) {
          this.providers = res;
        }
        this.util.stopLoader();
      },
      (err) => {
        this.util.stopLoader();
        this.util.showErrorToast(messages.errorTitle, messages.somethingWentWrong);
        console.log('err: ', err);
      }
    );
  }

}
