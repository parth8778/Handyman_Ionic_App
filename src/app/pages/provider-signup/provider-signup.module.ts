import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProviderSignupPageRoutingModule } from './provider-signup-routing.module';

import { ProviderSignupPage } from './provider-signup.page';
import { IonicSelectableModule } from 'ionic-selectable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ProviderSignupPageRoutingModule,
    IonicSelectableModule
  ],
  declarations: [ProviderSignupPage]
})
export class ProviderSignupPageModule {}
