import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProviderDetailPageRoutingModule } from './provider-detail-routing.module';

import { ProviderDetailPage } from './provider-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProviderDetailPageRoutingModule
  ],
  declarations: [ProviderDetailPage]
})
export class ProviderDetailPageModule {}
