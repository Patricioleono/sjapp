import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { LoginPage } from './login/login.page';
import { HomePage } from './home/home.page';
import { PickingPage } from './picking/picking.page';
import { DespachoPage } from './despacho/despacho.page';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'despacho',
    loadChildren: () => import('./despacho/despacho.module').then(m => m.DespachoPageModule)
  },
  {
    path: 'picking',
    loadChildren: () => import('./picking/picking.module').then(m => m.PickingPageModule)
  },
  {
    path: 'modal-info',
    loadChildren: () => import('./modal-info/modal-info.module').then(m => m.ModalInfoPageModule)
  },

  {
    path: 'despacho-lote',
    loadChildren: () => import('./despacho-lote/despacho-lote.module').then(m => m.DespachoLotePageModule)
  },
  {
    path: 'despacho-pallet',
    loadChildren: () => import('./despacho-pallet/despacho-pallet.module').then(m => m.DespachoPalletPageModule)
  },
  { path: '', component: LoginPage },
  { path: '*', redirectTo: 'login', pathMatch: 'full' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
