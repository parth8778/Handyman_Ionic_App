import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilService } from 'src/app/services/util.service';
import messages from 'src/app/messages/messages';
@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit {
  categories: any = [];
  searchTerm: string;
  userLocation: string;
  constructor(
    public util: UtilService,
    private firebaseService: FirebaseService,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.dataService.userData.subscribe((res: any) => {
      if(res && res.country && res.city) {
        this.userLocation = `${res.city.name}, ${res.country.name}`;
      }
    });
    this.getCategories();
  }

  getCategories() { 
    this.util.startLoader();
    this.firebaseService.getDataFromCollection('categories').subscribe((res) => {
      if (res) {
        this.categories = res;
      }
      this.util.stopLoader();
    }, () => {
      this.util.stopLoader();
      this.util.showErrorToast(messages.errorTitle, messages.somethingWentWrong);
    });
  }

  viewCategory(category: any) {
    this.dataService.bookingData = {
      ...this.dataService.bookingData,
      selectedCategory: category
    };
    this.util.navigateByURL(`services/${category.categoryId}`, 'forward');
  }
}
