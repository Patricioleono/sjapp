import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { LoadingController, AlertController } from '@ionic/angular';




@Component({
  selector: 'app-picking',
  templateUrl: './picking.page.html',
  styleUrls: ['./picking.page.scss'],
})
export class PickingPage implements OnInit {
  
  public seguimiento: string;
  public user: string;
  public jwtUrl: string = localStorage.getItem('jwtLoginUrl');
  public busquedaFolios: string;
  public urlRfc: string = localStorage.getItem('callRfcUrl');
  public dataFolios: any = [];
  public itemFolio: any = [];
  public fRequest: any = [];
  public dataP: any = [];
  public isDisabled = true;
  




  constructor(
    private route: Router,
    private http: HttpClient,
    public loadCtrl: LoadingController,
    public loadAlert: AlertController
  ) { }

  ngOnInit() {
    this.user = localStorage.getItem('user');
    this.seguimiento = localStorage.getItem('centroSeguimiento');

  }

  public async bFolios(folios) {
    const loading = await this.loadCtrl.create({ message: 'Cargando Datos Espere..' });
    const alert = await this.loadAlert.create({
      header: 'Sin Folios',
      message: 'Ingrese Folios a Validar..',
      buttons: ['Volver']
    });
    loading.present();
    if (folios === undefined || folios === null) {
      alert.present();
    } else {
      this.valdidarFolios(folios).subscribe((vFolios: any = []) => {
        console.log(folios);
        console.log(vFolios);
        this.dataFolios = Object.values(vFolios);
        this.dataP = this.dataFolios[0].ZMOV_10002.TABLES.STOCKLOTES.item;
        this.busquedaFolios = '';
        console.log(this.dataP);//array con respuesta
      
        this.itemFolio = this.agruparMateriales(this.dataP);
        this.isDisabled = false;
        console.log(this.itemFolio);
        loading.dismiss();
        
      });
    }
    
  }
    public agruparMateriales(dataDes){
      let gramajeMat = dataDes[0].MEINS; 
      let newArrayData: any =[];
        newArrayData['item'] = [];
        
        newArrayData['item']['cantidad'] = [];
        newArrayData['item']['kg'] = [];
        newArrayData['item']['gramaje'] = [];
        newArrayData['item']['almacen'] = [];
        newArrayData['item']['material'] = [];

        newArrayData['item']['gramaje'] = gramajeMat;

    //material
    let matSap = dataDes.map(matR => matR.MAKTX);
    const fMatSap = matSap.reduce((prev, curr) => {
      if(prev == curr){
        newArrayData['item']['material'] = prev;
      }
    });
    //almacen
    let almaSap = dataDes.map(almacen => almacen.LGORT);
    const fAlmaSap = almaSap.reduce((prev, curr) => {
      if(prev == curr){
        newArrayData['item']['almacen'] = prev;
      }
    });
    //suma KG
    let pesoSap = dataDes.map(dataR => dataR.CLABS);
    const fPesoSap = pesoSap.reduce((prev, curr) => prev + curr, 0);
    newArrayData['item']['kg'] = fPesoSap.toFixed(2);
    
    //cantidad
    let cantSap = dataDes.map(dataR => dataR.NTGEW);
    const fCantSap = cantSap.reduce((prev, curr) => prev + curr, 0);
    newArrayData['item']['cantidad'] = fCantSap;
    
    return Object.values(newArrayData);
  }

  public construccionBody(data) {
    let newData = data.split('\n');
    let allData: any = [];
    for (let i = 0; i < newData.length; i++) {
      let arrayQuery: any = [];
      arrayQuery =
      {
        "SIGN": "I",
        "OPTION": "EQ",
        "LOW": newData[i], //input busqueda
        "HIGH": ""
      },

        allData.push(arrayQuery);
    }
    return allData;

  }
  public valdidarFolios(data) {
    
    let cBody = this.construccionBody(data);
    const headers = new HttpHeaders().append(
      'Authorization', localStorage.getItem('token')
    );
    //console.log(cBody);
    const body = {
      "INPUT": {
        "IV_SPRAS": "S",
        "IV_LIB_UTIL": "L",
        "I_CLASE": "",
        "IR_WERKS": [
          {
            "SIGN": "I",
            "OPTION": "EQ",
            "LOW": localStorage.getItem('centroSeguimiento'),
            "HIGH": ""
          }
        ],
        "IR_CHARG":
          cBody,

      },
      "RFC": "ZMOV_10002"
    }

    return this.http.post<any>(localStorage.getItem('callRfcUrl'), body, {
      headers: headers
    }).pipe(map((folios: any = []) => {
      console.log(folios);
      return folios;
    }));
  }


  private fRequestBody() {
    let data = this.dataP;
    let newBody: any = [];
    for (let i = 0; i < data.length; i++) {
      let arrayDataBody: any = [];
      arrayDataBody =
      {
        "LOTE": data[i].CHARG,
        "MATERIAL_HU": data[i].MATNR,
        "ALMACEN": data[i].LGORT,
        "CENTRO": data[i].WERKS,
        "CANTIDAD_LOTE": data[i].CLABS,
        "TXT_MATERIAL": data[i].MAKTX
      };
      newBody.push(arrayDataBody);
    }
    return newBody;
  }

  private finalRequest() {
    let almacen = this.dataP[0].LGORT;
    //console.log(almacen);

    let ZPATENTE = localStorage.getItem('patente');
    let ZNOTRACTOR = localStorage.getItem('rampla');
    let ZRUT = localStorage.getItem('rChofer');
    let ZCHOFER = localStorage.getItem('nChofer');
    let TDLINE = localStorage.getItem('comentario');
    let pedidoVentas = localStorage.getItem('itemPedido');
    let centros = localStorage.getItem('centroSeguimiento');
    const newBody = this.fRequestBody();
    //console.log(newBody);
    const headers = new HttpHeaders().append(
      'Authorization', localStorage.getItem('token')
    );

    const body = {
      "RFC": "ZSD_10011",
      "INPUT": {
        "PEDIDO_VENTAS": pedidoVentas,
        "CENTRO": centros,
        "ALMACEN": almacen,
        "GV_LOTNO": "YGDE",
        "GV_BOKNO": "1",
        "CONTABILIZAR": "X",
        "GV_GUIA": "",
        "CUSTOMER_DATA": {
          "ZPATENTE": ZPATENTE,
          "ZNOTRACTOR": ZNOTRACTOR,
          "ZRUT": ZRUT,
          "ZCHOFER": ZCHOFER
        }
      },
      "TABLES": {
        "GT_PARTICION":
          newBody,
        "GT_UNID_MANIPULACION": [
        ],
        "IT_COMENTARIOS": [
          {
            "TDFORMAT": "",
            "TDLINE": TDLINE
          }
        ]
      }
    }
    return this.http.post<any>(this.urlRfc, body, { headers: headers })
      .pipe(map((result: any = []) => {
        console.log(result);
        return result;
      }));
  }

  public async openModal() {
    const loading = await this.loadCtrl.create({ message: 'Cargando Respuesta..' });

    loading.present();
    this.finalRequest().subscribe((fiRequest: any = []) => {
      let pData = fiRequest.data.ZSD_10011.TABLES.GT_RETURN.item;
      this.fRequest = Object.values(pData);
      loading.dismiss();   
    });
  }

  public redirectHome(){
        //limpiar localStorage solo queda User y Centro
        localStorage.removeItem('itemPedido');
        localStorage.removeItem('patente');
        localStorage.removeItem('rampla');
        localStorage.removeItem('nChofer');
        localStorage.removeItem('rChofer');
        localStorage.removeItem('comentario');
        this.route.navigate(['home']);
  }

}
