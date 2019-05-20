import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Label } from 'ionic-angular';
import { AlertController, ToastController } from 'ionic-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginPage } from '../login/login';
import { MostraHistoricoPage } from '../mostra-historico/mostra-historico';
import { ServicoProvider } from '../../providers/servico/servico';
import { Camera, CameraOptions } from '@ionic-native/camera'
import { ConstantesComponent } from '../../components/constantes/constantes';
import chartJs from 'chart.js';

/**
 * Generated class for the EvolucaoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-evolucao',
  templateUrl: 'evolucao.html',


})
export class EvolucaoPage {
  @ViewChild('barCanvas') barCanvas;
  @ViewChild('lineCanvas') lineCanvas;
  @ViewChild('pieCanvas') pieCanvas;
  @ViewChild('doughnutCanvas') doughnutCanvas;

  barChart: any;
  lineChart: any;
  pieChart: any;
  doughnutChart: any;

  Constantes: ConstantesComponent = new ConstantesComponent;
  apiUrl: string;
  token: string;
  expires: string;
  socket: any;
  idUsu: string;
  notificacao: string;
  existe: boolean = true;
  public dadosAluno: any = {
    _id: "",
    nome: "",
    cpf: "",
    IMC: "",
    msg: "",
    idade: "",
    peso: "",
    massaMagra: "",
    massaGorda: "",
    altura: "",
    dataInicio: ""
  }
  evolucaoExiste: boolean = false;

  public data: Date;

  public listaTreinos: any = { treino: {}, treinos: [] };

  public evolucaoLista: any = [];

  dataPeso: any = [];
  dataMassaMagra: any = [];
  labelsLista: any = [];

  headers: HttpHeaders;

  foto: any = 'assets/imgs/logobrandao.png';

  constructor(public navCtrl: NavController, public http: HttpClient, private alertCtrl: AlertController, private camera: Camera, private toastCtrl: ToastController, private servicoProvider: ServicoProvider) {
    this.apiUrl = this.Constantes.url;
    this.headers = new HttpHeaders();
    this.token = localStorage.getItem("tokenAppPM");
    this.expires = localStorage.getItem("expiresAppPM");
    this.headers = this.headers.append('Authorization', this.token);
    if (new Date(this.expires) < new Date()) {
      this.navCtrl.push(LoginPage);
    }




    this.idUsu = localStorage.getItem('idUsuaAppPM');

    this.buscaAlunoLocal();
    this.buscaTreinoLocal();
    this.buscaEvolucaoLocal();

    this.buscaAluno();
    this.buscaTreinos();
    this.buscaEvolucao();

    this.buscaFotoLocal();
    this.buscaTreinos();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.lineChart = this.getLineChart();
    }, 150)

  }









  getChart(context, chartType, data, options?) {
    return new chartJs(context, {
      data,
      options,
      type: chartType
    })
  }



  getLineChart() {



    const data = {
      labels: this.labelsLista,
      datasets: [{
        label: 'peso ',
        fill: false,
        lineTension: 0.1,
        backgroundColor: 'rgb(231, 205, 35)',
        borderColor: 'rgb(231, 205, 35)',
        borderCapStyle: 'butt',
        borderJoinStyle: 'miter',
        pointRadius: 1,
        pointHitRadius: 10,
        data: this.dataPeso,
        scanGaps: false,
      }, {
        label: 'Massa magra',
        fill: false,
        lineTension: 0.1,
        backgroundColor: 'rgb(51, 50, 46)',
        borderColor: 'rgb(51, 50, 46)',
        borderCapStyle: 'butt',
        borderJoinStyle: 'miter',
        pointRadius: 1,
        pointHitRadius: 10,
        data: this.dataMassaMagra,
        scanGaps: false,
      }
], 
    }  

    return this.getChart(this.lineCanvas.nativeElement, 'line', data);
  }

  buscaAluno() {
    return new Promise(resolve => {
      this.http.get(this.apiUrl + 'alunos/' + this.idUsu, { headers: this.headers }).subscribe(res => {
        this.dadosAluno = res;
        this.servicoProvider.remove("aluno");
        this.servicoProvider.save("aluno", this.dadosAluno);
      }, error => {
        console.log("error");
      });
    });
  }

  buscaAlunoLocal() {
    this.servicoProvider.getAluno().then(aluno => {
      this.dadosAluno = aluno;
      console.log();
    });
  }

  buscaTreinos() {
    return new Promise(resolve => {
      this.http.get(this.apiUrl + 'treinos/' + this.idUsu, { headers: this.headers }).subscribe(res => {
        this.listaTreinos = res;
        if (this.listaTreinos.treinos.length > 0) {
          this.servicoProvider.remove("treino");
          this.servicoProvider.save("treino", this.listaTreinos);
          this.existe = true;
        } else {
          this.existe = false;
        }
      }, error => {
        console.log("error");
      });
    });
  }

  buscaTreinoLocal() {
    this.servicoProvider.getTreino().then(treino => {
      this.listaTreinos = treino;
    });
  }

  buscaEvolucao() {
    return new Promise(resolve => {
      this.http.get(this.apiUrl + 'evolucaos/mobile/evolucao/' + this.idUsu, { headers: this.headers }).subscribe(res => {
        this.evolucaoLista = res;
        if (this.evolucaoLista.length > 0) {
          this.servicoProvider.remove("evolucao");
          this.servicoProvider.save("evolucao", this.evolucaoLista);
          this.evolucaoExiste = true;
        } else {
          this.evolucaoExiste = false;
        }
      }, error => {
        console.log("error");
      });
    });
  }

  buscaEvolucaoLocal() {
    this.servicoProvider.getEvolucao().then(evolucao => {
      this.evolucaoLista = evolucao;
      if (this.evolucaoLista.length > 0) {
        this.evolucaoExiste = true;
        this.graficoDataPeso(this.evolucaoLista);
        this.graficoDataMassaMagra(this.evolucaoLista);
      }
    });
  }

  graficoDataPeso(lista:any) {
    lista.forEach((dados, index) => {
      this.dataPeso.push(dados.peso);
      this.labelsLista.push(index);
    });
  } 

  graficoDataMassaMagra(lista:any) {
    lista.forEach(dados => {
      this.dataMassaMagra.push(parseInt(dados.massaMagra));
    });
  } 

  buscaTreino(id, treino, nomeTreino) {
    this.navCtrl.push(MostraHistoricoPage, {
      id: id,
      treino: treino,
      nomeTreino: nomeTreino
    });
  }

  sair() {
    this.navCtrl.push(LoginPage, {
      sair: '1'
    });
  }

  notificacaoAlert() {
    let alert = this.alertCtrl.create({
      title: 'Notificação',
      subTitle: this.notificacao,
      buttons: ['Fechar']
    });
    alert.present();
  }

  tirarFoto() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };

    this.camera.getPicture(options).then((imageData) => {
      let base64Image = 'data:image/jpeg;base64,' + imageData;

      this.foto = base64Image;
      this.servicoProvider.remove("foto");
      this.servicoProvider.save("foto", this.foto);
    }, (err) => {
      this.toastCtrl.create({
        message: 'Não foi possível tirar a foto',
        duration: 2000,
        position: 'top'
      }).present();
    });
  }

  buscaFotoLocal() {
    this.servicoProvider.getFoto().then(foto => {
      if (foto != null) {
        this.foto = foto;
      } else {
        this.foto = 'assets/imgs/logobrandao.png';
      }
    });
  }

  removeFoto() {
    this.foto = 'assets/imgs/logobrandao.png';
  }

  receive() {
    this.socket.on('notificacao', (notificacao, id) => {
      if (JSON.stringify(id) === JSON.stringify(this.idUsu)) {
        this.notificacao = notificacao;
        this.notificacaoAlert();
        this.buscaTreinos();
      }
    });
  }

}
