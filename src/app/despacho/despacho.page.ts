import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { LoadingController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';


@Component({
   selector: 'app-despacho',
   templateUrl: './despacho.page.html',
   styleUrls: ['./despacho.page.scss'],
})
export class DespachoPage implements OnInit {
   public user: string;
   public seguimiento: string = localStorage.getItem('centroSeguimiento');
   public datosForm: any = [];
   public itemBusqueda: number;
   public fecha: string;
   public dataFecha: string;
   //formulario manual
   public patente: string;
   public rampla: string;
   public rChofer: string;
   public nChofer: string;
   public comentario: string;
   public isDisabled = true;


   constructor(
      private http: HttpClient,
      private router: Router,
      public loadCtrl: LoadingController,
      public loadAlert: AlertController
   ) { }

   ngOnInit() {
      this.user = localStorage.getItem('user');
      this.seguimiento = localStorage.getItem('centroSeguimiento');

   }
   public async localManual(patente, rampla, rChofer, nChofer, comentario) {
      let alertFm = await this.loadAlert.create({
         header: 'Sin Datos Ingresados',
         message: 'Ingrese Datos de Chofer',
         buttons: ['Volver']
      });
      if (patente === null || patente === undefined &&
         rampla === null || rampla === undefined &&
         nChofer === null || nChofer === undefined &&
         rChofer === null || rChofer === undefined &&
         comentario === null || comentario === undefined) {
         alertFm.present();
         //validar tipos, numeros string etc.
      } else {
         localStorage.setItem('patente', this.patente);
         localStorage.setItem('rampla', this.rampla);
         localStorage.setItem('nChofer', this.nChofer);
         localStorage.setItem('rChofer', this.rChofer);
         localStorage.setItem('comentario', this.comentario);
         this.router.navigate(['/picking']);
      }

   }


   async buscarPedido(busqueda) {
      let alertP = await this.loadAlert.create({
         header: 'Error en Numero de Pedido',
         message: 'Verificar Pedido Ingresados',
         buttons: ['Volver']
      });
      const loading = await this.loadCtrl.create({ message: 'Cargando Datos Espere..' });
      loading.present();
      //validar cero
      let vCero = busqueda.substring(0, 1);
      if (vCero != 0) {
         let arrBusqueda = Array.of(busqueda).concat('0');
         let arrCon = arrBusqueda[1].concat(arrBusqueda[0]);
         // console.log(arrBusqueda);
         console.log('ingresado sin cero: ' + arrCon);
         var itemBusqueda = arrCon;
      } else {
         var itemBusqueda = busqueda;
         console.log('ingresado con cero: ' + itemBusqueda);
      }

      if (itemBusqueda === null || itemBusqueda === undefined) {
         loading.dismiss();
         alertP.present();
      } else {
         this.searchPedidoData(itemBusqueda).subscribe((dataR: any = []) => {
            console.log(dataR);
            let dataItem = dataR[0].BAPI_SALESORDER_GETSTATUS.TABLES.STATUSINFO.item;
            if (dataItem.length > 0) {
               console.log('fecha objeto: ' + dataItem[0].DOC_DATE);
               this.dataFecha = dataItem[0].DOC_DATE;
            } else {
               console.log('fecha simple: ' + dataItem.DOC_DATE);
               this.dataFecha = dataItem.DOC_DATE;
            }

            let fechaRes = this.dataFecha;

            this.searchPedido(itemBusqueda, fechaRes).subscribe((sped: any = []) => {
               // console.log(itemBusqueda);
               console.log(sped);

               let itemCant = sped[0].ZSD_10010.TABLES.ET_PEDIDOS.item;
               let emptyData = sped[0].ZSD_10010.TABLES.ET_PEDIDOS;
               if (emptyData != '') {
                  if (itemCant.length > 0) {
                     console.log(this.datosForm);
                     loading.dismiss();
                     return this.datosForm = Array.of(sped[0].ZSD_10010.TABLES.ET_PEDIDOS.item[0]);
                  } else {
                     console.log(this.datosForm);
                     loading.dismiss();
                     return this.datosForm = Array.of(sped[0].ZSD_10010.TABLES.ET_PEDIDOS.item);
                  }
               } else {
                  loading.dismiss();
                  alertP.present();
                  this.itemBusqueda = null;
               }

            });
         });

      }
      this.isDisabled = false;
   }
   public searchPedidoData(itemBusqueda) {
      const headers = new HttpHeaders().append(
         'Authorization', localStorage.getItem('token')
      );
      const body = {
         "INPUT": {
            "SALESDOCUMENT": itemBusqueda
         },
         "RFC": "BAPI_SALESORDER_GETSTATUS"
      };
      return this.http.post<any>(localStorage.getItem('callRfcUrl'), body, { headers: headers }).pipe(map((result: any) => {
         //  console.log(Object.values(result));
         //console.log(result)
         return Object.values(result);
      }));

   }
   public searchPedido(itemBusqueda, fRquest) {
      localStorage.setItem('itemPedido', itemBusqueda);
      let centro = this.seguimiento.split(" ", 1);
      //console.log(centro[0]);

      const headers = new HttpHeaders().append(
         'Authorization', localStorage.getItem('token')
      );
      const body = {
         "INPUT": {
            "IR_VBELN": [
               {
                  "SIGN": "I",
                  "OPTION": "EQ",
                  "LOW": itemBusqueda,
                  "HIGH": ""
               }
            ],
            "IR_WERKS": [
               {
                  "SIGN": "I",
                  "OPTION": "EQ",
                  "LOW": centro[0],
                  "HIGH": ""
               }
            ],
            "IR_ERDAT": [
               {
                  "SIGN": "I",
                  "OPTION": "EQ",
                  "LOW": fRquest,
                  "HIGH": ""
               }
            ],
            "IR_AUART": [
               {
                  "SIGN": "I",
                  "OPTION": "EQ",
                  "LOW": "B001",
                  "HIGH": ""
               },
               {
                  "SIGN": "I",
                  "OPTION": "EQ",
                  "LOW": "B004",
                  "HIGH": ""
               },
               {
                  "SIGN": "I",
                  "OPTION": "EQ",
                  "LOW": "S101",
                  "HIGH": ""
               },
               {
                  "SIGN": "I",
                  "OPTION": "EQ",
                  "LOW": "S103",
                  "HIGH": ""
               },
               {
                  "SIGN": "I",
                  "OPTION": "EQ",
                  "LOW": "S114",
                  "HIGH": ""
               }
            ]
         },
         "RFC": "ZSD_10010"
      }
      //console.log(body);
      return this.http.post<any>(localStorage.getItem('callRfcUrl'), body,
         { headers: headers }).pipe(map((pedido: any = []) => {
            // console.log('busqueda de folios' + JSON.stringify(pedido));

            return Object.values(pedido);
         }));
   }

}
