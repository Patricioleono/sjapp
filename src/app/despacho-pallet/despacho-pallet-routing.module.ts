import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DespachoPalletPage } from './despacho-pallet.page';

const routes: Routes = [
  {
    path: '',
    component: DespachoPalletPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DespachoPalletPageRoutingModule {}
