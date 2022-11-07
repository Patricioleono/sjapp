import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DespachoLotePageRoutingModule } from './despacho-lote-routing.module';

import { DespachoLotePage } from './despacho-lote.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DespachoLotePageRoutingModule
  ],
  declarations: [DespachoLotePage]
})
export class DespachoLotePageModule {}
