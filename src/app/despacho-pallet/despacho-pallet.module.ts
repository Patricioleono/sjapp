import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DespachoPalletPageRoutingModule } from './despacho-pallet-routing.module';

import { DespachoPalletPage } from './despacho-pallet.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DespachoPalletPageRoutingModule
  ],
  declarations: [DespachoPalletPage]
})
export class DespachoPalletPageModule {}
