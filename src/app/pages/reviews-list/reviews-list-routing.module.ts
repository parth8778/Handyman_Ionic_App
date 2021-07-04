import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReviewsListPage } from './reviews-list.page';

const routes: Routes = [
  {
    path: '',
    component: ReviewsListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReviewsListPageRoutingModule {}
