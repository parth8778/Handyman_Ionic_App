import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditProviderProfilePage } from './edit-provider-profile.page';

const routes: Routes = [
  {
    path: '',
    component: EditProviderProfilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditProviderProfilePageRoutingModule {}
