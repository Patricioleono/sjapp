import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-info',
  templateUrl: './modal-info.page.html',
  styleUrls: ['./modal-info.page.scss'],
})
export class ModalInfoPage implements OnInit {
  @Input() dataNew:any = [];
  constructor( 
    private modalCtrl: ModalController,
    private route:Router
    ) { }

  ngOnInit() {
    console.log(this.dataNew);
    
  }
  public data(){
  
  }
  public redirectHome(){
    this.modalCtrl.dismiss();
    this.route.navigate(['home']);
  }

}
