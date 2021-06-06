import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProviderSignupPage } from './provider-signup.page';

const routes: Routes = [
  {
    path: '',
    component: ProviderSignupPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProviderSignupPageRoutingModule {}
