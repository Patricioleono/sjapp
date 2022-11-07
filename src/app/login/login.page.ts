import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';

import { map } from 'rxjs/operators';
import { LoadingController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';



@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {
  public usuario: string;
  public password: string;
  public callRfc: string;
  public jwtLogin: string;

  constructor(
    private route: Router,
    private http: HttpClient,
    public loadCtrl: LoadingController,
    public loadAlert: AlertController


  ) { }

  ngOnInit() {

    localStorage.setItem('callRfcUrl', 'http://qas-tomcat8.expled.cl:8082/baika-movilidad/call-rfc');
    localStorage.setItem('jwtLoginUrl', 'http://qas-tomcat8.expled.cl:8082/baika-movilidad/jwt-login');
    localStorage.setItem('callSp', 'http://qas-tomcat8.expled.cl:8082/baika-movilidad/call-sp');
    //localStorage.setitem('solicitarMenu', 'http://localhost/api/?user=patricio');
    /*
    
    //production
    localStorage.setItem('callRfcUrl', 'https://baika-prd.goplicity.com/baika-movilidad/call-rfc');
    localStorage.setItem('jwtLoginUrl', 'https://baika-prd.goplicity.com/baika-movilidad/jwt-login');
    localStorage.setItem('callSp', 'https://baika-prd.goplicity.com/baika-movilidad/call-sp');
   */
  }


  async logIn(user, pass) {
    const alert = await this.loadAlert.create({
      header: 'Error al Iniciar Session',
      message: 'Verificar Credenciales',
      buttons: ['Volver']
    });
    const loading = await this.loadCtrl.create({
      message: 'Cargando Datos Espere..'
    });
    //spinner load data and verify
    if (user != null || user != undefined && pass != null || pass != undefined) {
      loading.present();
      this.crearToken(user, pass).subscribe(res => {
        //console.log(res.perfil);
        let vPerfil = res.perfil;

        if (Object.keys(vPerfil).length === 0) {
          //message error alert
          loading.dismiss();
          alert.present();

        } else {
          loading.present();
          //procesar token
          localStorage.setItem('user', user);
          localStorage.setItem('token', res.token);
          this.validarToken(localStorage.getItem('token'), localStorage.getItem('user')).subscribe(data => {
            if (data === null || data === false || data == undefined) {
              loading.dismiss();
              alert.present();
            } else {
              console.log(data);
              loading.dismiss();
              this.route.navigate(['home']);
            }
          })

          //let token = localStorage.getItem('token');
        }

      });
      loading.dismiss();
    } else {
      loading.dismiss();
      alert.present();
    }




  }
  public validarToken(token, user) {
    const headers = new HttpHeaders().append(
      'Authorization', token
    );
    const body =
    {
      "RFC": "BAPI_USER_GET_DETAIL"
      , "getBase": false
      , "INPUT": {
        "USERNAME": user
      }
    }
    return this.http.post<any>(localStorage.getItem('callRfcUrl'), body, { headers: headers }).pipe(map((res: any) => {
      return res;
    }));
  }

  public crearToken(user, pass) {
    let jwtUrl = localStorage.getItem('jwtLoginUrl');
    return this.http
      .post(jwtUrl, {
        "JCO_USER": user,
        "JCO_PASSWD": pass
      }).pipe(map((res: any) => {
        //console.log(res);
        return res;
      }));
  }

}