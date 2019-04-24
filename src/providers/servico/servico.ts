import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlunoComponent } from '../../components/aluno/aluno';
import { Storage } from '@ionic/storage';
import { EvolucaoComponent } from '../../components/evolucao/evolucao';
import { TreinoComponent } from '../../components/treino/treino';

@Injectable()
export class ServicoProvider {
  evolucao: any = [];
  constructor(public http: HttpClient, private storage: Storage) {
  }

  public save(key: string, aluno: AlunoComponent) {
    return this.storage.set(key, aluno);
  }

  public remove(key: string) {
    return this.storage.remove(key);
  }

  public getAluno() {

    let aluno: AlunoComponent = new AlunoComponent;

    return this.storage.forEach((value: AlunoComponent, key: string, iterationNumber: Number) => {
      if (key == "aluno") {
        aluno = value;
        aluno.key = key;
      }
    })
      .then(() => {
        return Promise.resolve(aluno);
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  }

  public getEvolucao() {
    return this.storage.forEach((value: EvolucaoComponent, key: string, iterationNumber: Number) => {
      if (key == "evolucao") {
        this.evolucao = value;
      }
    })
      .then(() => {
        return Promise.resolve(this.evolucao);
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  }

  public getTreino() {

    let treino: TreinoComponent = new TreinoComponent;

    return this.storage.forEach((value: TreinoComponent, key: string, iterationNumber: Number) => {
      if (key == "treino") {
        treino = value;
      }
    })
      .then(() => {
        return Promise.resolve(treino);
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  }

  public getFoto() {

    let foto: string;

    return this.storage.forEach((value: string, key: string, iterationNumber: Number) => {
      if (key == "foto") {
        foto = value;
      }
    })
      .then(() => {
        return Promise.resolve(foto);
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  }

  getNews(){
    var url = 'https://newsapi.org/v2/everything?' +
    'q=Apple&' +
    'from=2019-04-24&' +
    'sortBy=popularity&' +
    'apiKey=b85a28475c814377bb8a8d4e1959eb5d';

      var req = new Request(url);

      fetch(req)
      .then(function(response) {
        console.log(response.json());
      })
  }

}
