import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApinoticiaProvider } from '../../providers/apinoticia/apinoticia';

/**
 * Generated class for the NoticiaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-noticia',
  templateUrl: 'noticia.html',
  providers: [
    ApinoticiaProvider
  ]
})


export class NoticiaPage {

  data: any;

  public objeto_noticia={
    titulo:"leonel",
  }

  //public lista_noticia = new Array<object>();

  

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private apinoticiaProvider: ApinoticiaProvider) {
  }
  


  ionViewDidLoad() {
    this.apinoticiaProvider.getLatestNoticia().subscribe(
     data=>{

      
     // const response = (data as any);
     // const objeto_retorno =  response._body;
     // this.lista_noticia = objeto_retorno.totalResults;

       console.log(data);
       this.data = data;
     }, error => {
       console.log(error);
     }
     
    )
  }

}
