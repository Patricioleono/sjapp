import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-despacho-pallet',
  templateUrl: './despacho-pallet.page.html',
  styleUrls: ['./despacho-pallet.page.scss'],
})
export class DespachoPalletPage implements OnInit {

  public callRfc: string = localStorage.getItem('callRfcUrl');
  public center: string = localStorage.getItem('centroSeguimiento');
  public fPallet: any;
  public resData: any = [];
  public batch: any = [];
  public almacen: string;
  public bodyFilter: any = [];
  public isDisabled: boolean = true;

  constructor(
    public loadCtrl: LoadingController,
    public loadAlert: AlertController,
    private http: HttpClient,
    private route: Router
  ) { }

  ngOnInit() {

  }

  public async validatePallets(nPallets) {
    const loading = await this.loadCtrl.create({ message: 'Cargando Datos Espere..' });
    const alert = await this.loadAlert.create({
      header: 'Error de Datos',
      message: 'Revise Datos Ingresados..',
      buttons: ['volver']
    });
    this.pRequest(nPallets).subscribe((rPallets: any = []) => {

      let requestData = rPallets['data']['ZMOV_10009']['TABLES']['T_SALIDA'];
      if (requestData == '') {
        alert.present();
      } else {

        loading.present();
        console.log(rPallets);
        let objectData = Object.values(rPallets);
        let getItem = objectData[0]['ZMOV_10009']['TABLES']['T_SALIDA']['item'];

        let cantidad = this.getCharg(getItem).length.toString();
        let kg = this.getClabs(getItem);
        this.batch.push(this.getCharg(getItem));
        this.resData.push({ cantidad, kg, nPallets });
        this.almacen = this.getAlmacen(getItem);
        this.bodyFilter = this.fBodyConstruct(getItem);

        console.log(this.batch);
        this.fPallet = null;
        this.isDisabled = false;
        loading.dismiss();


      }
    });
  }

  public pRequest(vPallets) {
    const headers = new HttpHeaders().append(
      'Authorization', localStorage.getItem('token')
    );

    const body = {
      "RFC": "ZMOV_10009",
      "getBase": false,
      "INPUT": {
        "R_CENTRO": [
          {
            "SIGN": "I",
            "OPTION": "EQ",
            "LOW": this.center,
            "HIGH": ""
          }
        ],
        "R_CARACT": [
          {
            "SIGN": "I",
            "OPTION": "EQ",
            "LOW": "ZPALLET",
            "HIGH": ""
          }
        ],
        "R_VALOR": [
          {
            "SIGN": "I",
            "OPTION": "EQ",
            "LOW": vPallets,
            "HIGH": ""
          }
        ]
      }
    }
    return this.http.post<any>(this.callRfc, body, {
      headers: headers
    }).pipe(map((rPallets: any = []) => {
      return rPallets;
    }))
  }

  public getCharg(request) {
    let onlyCharg = request.map(index => index.CHARG);
    return onlyCharg;
  }
  public getAlmacen(request) {
    let almacen = request[0].LGORT;
    return almacen;
  }

  public getClabs(request) {
    let onlyClabs = request.map(index => index.CLABS);
    const totalClabs = onlyClabs.reduce((first, last) => first + last, 0);
    return totalClabs.toFixed(2);
  }

  public fBodyConstruct(request) {
    let filterData: any = [];
    for (let i = 0; i < request.length; i++) {
      let arrayBody: any = [];
      arrayBody = {
        "LOTE": request[i].CHARG,
        "MATERIAL_HU": request[i].MATNR,
        "ALMACEN": request[i].LGORT,
        "CENTRO": request[i].WERKS,
        "CANTIDAD_LOTE": request[i].CLABS,
        "TXT_MATERIAL": request[i].MAKTX
      };
      filterData.push(arrayBody);
    }
    return filterData;
  }

  public fRequest() {
    const bodyFilter = this.bodyFilter;
    const headers = new HttpHeaders().append('Authorization', localStorage.getItem('token'));

    const body = {
      "RFC": "ZSD_10011", "INPUT":
      {
        //"PEDIDO_VENTAS": this.batch,
        "CENTRO": this.center,
        "ALMACEN": this.almacen,
        "GV_LOTNO": "YGDE",
        "GV_BOKNO": "1",
        "CONTABILIZAR": "X",
        "GV_GUIA": "",
        "CUSTOMER_DATA": {
          "ZPATENTE": "",
          "ZNOTRACTOR": "",
          "ZRUT": "",
          "ZCHOFER": ""
        }
      },
      "TABLES": {
        "GT_PARTICION": [
          bodyFilter,
        ], "GT_UNID_MANIPULACION": [],
        "IT_COMENTARIOS": [
          {
            "TDFORMAT": "",
            "TDLINE": ""
          }]
      }
    }
    return this.http.post<any>(this.callRfc, body, { headers: headers }).pipe(map((result: any = []) => {
      console.log(result);
      return result;
    }));
  }
}
