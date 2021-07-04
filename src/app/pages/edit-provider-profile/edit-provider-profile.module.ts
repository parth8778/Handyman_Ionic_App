import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditProviderProfilePageRoutingModule } from './edit-provider-profile-routing.module';

import { EditProviderProfilePage } from './edit-provider-profile.page';
import { IonicSelectableModule } from 'ionic-selectable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditProviderProfilePageRoutingModule,
    IonicSelectableModule,
    ReactiveFormsModule
  ],
  declarations: [EditProviderProfilePage]
})
export class EditProviderProfilePageModule {}
