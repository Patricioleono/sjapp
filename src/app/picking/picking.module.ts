import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PickingPageRoutingModule } from './picking-routing.module';

import { PickingPage } from './picking.page';
import { ModalInfoPage } from '../modal-info/modal-info.page';
import { ModalInfoPageModule } from '../modal-info/modal-info.module';

@NgModule({
  entryComponents: [
    ModalInfoPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PickingPageRoutingModule,
    ModalInfoPageModule
  ],
  declarations: [PickingPage]
})
export class PickingPageModule {}
