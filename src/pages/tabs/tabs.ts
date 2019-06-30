import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { HistoricoPage } from '../historico/historico';
import { LoginPage } from '../login/login';
import { EvolucaoPage } from '../evolucao/evolucao';
import { NoticiaPage } from '../noticia/noticia';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HistoricoPage;
  tab2Root = EvolucaoPage;


  constructor() {
    
  }
}
