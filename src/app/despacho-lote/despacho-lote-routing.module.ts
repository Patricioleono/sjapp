import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DespachoLotePage } from './despacho-lote.page';

const routes: Routes = [
  {
    path: '',
    component: DespachoLotePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DespachoLotePageRoutingModule {}
