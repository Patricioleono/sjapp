import { Component, OnInit } from '@angular/core';
import { ChoosePlainService } from '../services/choose-plain.service';
import { MenuController } from '@ionic/angular';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  public openModal: boolean;
  public centroSeguimiento: string;
  public centros: any = [];
  public user: string;
  public callSp: string;


  constructor(
    private menu: MenuController,
    private http: HttpClient,
    private route: Router
  ) { }

  ngOnInit() {
    this.user = localStorage.getItem('user');
    this.callSp = localStorage.getItem('callSp');
    //console.log(this.callSp);
    this.setOpenModal(true);

    this.getCenters().subscribe((res: any = []) => {
      //console.log(res);
      this.centros = res.data;      
    });

  }
  setOpenModal(openModal: boolean) {
    this.openModal = openModal;
  }
  ingresar(centro, modalClose) {
    console.log(centro);
    localStorage.setItem('centroSeguimiento', centro);
    this.setOpenModal(modalClose);

  }
  getCenters() {
    let user = localStorage.getItem('user');
    let callSp = localStorage.getItem('callSp');
    const headers = new HttpHeaders().append(
      'Authorization', localStorage.getItem('token')
    );
    const body = {
      "sp": "sap_manager",
      "p": {
        "_cmd": "getCentrosByUser",
        "_JCO_USER": user
      }
    };
    return this.http.post<any>(callSp, body, {
      headers: headers
    }).pipe(map((cent: any = []) => {
      console.log(cent);
      return cent;
    }));
  }


  sidebarOpen() {
    this.menu.enable(true, 'openSidebar');
    this.menu.open('openSidebar');
  }

}
