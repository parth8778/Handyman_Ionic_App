import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReviewsListPageRoutingModule } from './reviews-list-routing.module';

import { ReviewsListPage } from './reviews-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReviewsListPageRoutingModule
  ],
  declarations: [ReviewsListPage]
})
export class ReviewsListPageModule {}
