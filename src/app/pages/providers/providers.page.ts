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
  userDetails: any;
  constructor(
    public util: UtilService,
    public dataService: DataService,
    public fireStore: AngularFirestore
  ) { }

  ngOnInit() {
    this.dataService.userData.subscribe((user) => {
      
      this.userDetails = user;
    });
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
          const selectedServices = this.dataService.bookingData.selectedServices;
          this.providers = res.filter((provider: any) => {
            let status = true;
            selectedServices.forEach(element => {
              if (status && !(provider.selectedServices.indexOf(element.serviceId) > -1)) {
                status = false;
              }
            });
            if (status && this.userDetails.city.name !== provider.city.name) {
              status = false;
            }
            return status;
          });

          if (this.providers && this.providers.length > 0) {
            this.providers.forEach((provider) => {
              this.fireStore.collection('ratings', (ref) => ref
                .where('providerId', '==', provider.id)
              ).valueChanges(res).subscribe((res) => {
                const totLength = res.length;
                let totRatings = 0;
                res.forEach((element: any) => {
                  totRatings += element.rating;
                  this.fireStore.collection('users').doc(element.uId).valueChanges().subscribe((userResp) => {
                    element.userDetails = userResp;
                  });
                });
                provider.star = (totRatings / totLength);
                provider.totReviews = totLength;
                provider.reviews = res;
                provider.categoryDetails = this.dataService.bookingData.selectedCategory;
              })
            });
          }
        }
        this.util.stopLoader();
      },
      () => {
        this.util.stopLoader();
        this.util.showErrorToast(messages.errorTitle, messages.somethingWentWrong);
      }
    );
  }

  goToProviderDetail(provider) {
    this.dataService.bookingData = {
      ...this.dataService.bookingData,
      providerDetails: provider
    };
    this.util.navigateByURL('provider-detail', 'forward')
  }

}
