import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { UtilService } from 'src/app/services/util.service';
import messages from 'src/app/messages/messages';
@Component({
  selector: 'app-services',
  templateUrl: './services.page.html',
  styleUrls: ['./services.page.scss'],
})
export class ServicesPage implements OnInit {
  visitedCategoryId: string;
  services: any = [];
  selectedCategory: any = {};
  constructor(
    public util: UtilService,
    private activatedRoute: ActivatedRoute,
    public fireStore: AngularFirestore,
    public dataService: DataService
  ) {}

  ngOnInit() {
    this.selectedCategory = this.dataService.bookingData.selectedCategory;
    this.visitedCategoryId = this.activatedRoute.snapshot.params['categoryId'];
    if (this.visitedCategoryId) {
      this.getServices();
    }
  }

  getServices() {
    this.util.startLoader();
    this.fireStore
      .collection('services', (ref) =>
        ref.where('categoryId', '==', this.visitedCategoryId)
      )
      .valueChanges()
      .subscribe(
        (res) => {
          console.log('this.visitedCategoryId: ', this.visitedCategoryId);
          console.log('res: ', res);
          if (res) {
            this.services = res;
          }
          this.util.startLoader();
        },
        (err) => {
          this.util.startLoader();
          this.util.showErrorToast(messages.errorTitle, messages.somethingWentWrong);
          console.log('err: ', err);
        }
      );
  }

  onSubmitService() {
    let selectedServices = null;
    if (this.services && this.services.length > 0) {
      selectedServices = this.services.filter((service) => {
        if (service.isChecked) {
          return service.isChecked;
        }
      });

      if (selectedServices && selectedServices.length > 0) {
        this.dataService.bookingData = {
          ...this.dataService.bookingData,
          selectedServices
        };
        return this.util.navigateByURL('providers', 'forward');
      }
    }
    this.util.showErrorToast(messages.errorTitle, messages.serviceMustBeRequired);
  }
}
