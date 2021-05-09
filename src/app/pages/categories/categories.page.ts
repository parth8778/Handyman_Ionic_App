import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit {

  categories: any = [];

  constructor(
    public util: UtilService,
    private firebaseService: FirebaseService,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.getCategories();
  }

  getCategories() { 
    this.firebaseService.getDataFromCollection('categories').subscribe((res) => {
      if (res) {
        this.categories = res;
      }
    }, err => {
      console.log('err: ', err);
    });
  }

  viewCategory(category: any) {
    this.dataService.bookingData = {
      categoryId: category.categoryId
    };
    this.util.navigateByURL('services', 'forward');
  }
}
