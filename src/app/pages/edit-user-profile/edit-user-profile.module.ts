import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditUserProfilePageRoutingModule } from './edit-user-profile-routing.module';

import { EditUserProfilePage } from './edit-user-profile.page';
import { IonicSelectableModule } from 'ionic-selectable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditUserProfilePageRoutingModule,
    IonicSelectableModule,
    ReactiveFormsModule
  ],
  declarations: [EditUserProfilePage]
})
export class EditUserProfilePageModule {}
