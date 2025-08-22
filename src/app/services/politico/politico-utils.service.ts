import { Injectable } from '@angular/core';
import { Politico } from '../../models/politico';

@Injectable({
  providedIn: 'root'
})
export class PoliticoUtilsService {

  constructor() { }

  getPoliticoNameByID( id : number, politicos : Politico[] ) : string {
      const politico = politicos.find(p => p.id === id);
      return politico ? politico.name : "(Desconocido)";
  }

}
