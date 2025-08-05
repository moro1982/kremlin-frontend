import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Player } from '../models/player';
import { InfluenceDeclared } from '../models/influence-declared';
import { Politico } from '../models/politico';

@Injectable({
  providedIn: 'root'
})
export class ControlPoliticoService {

  private apiURL = 'http://localhost:8080/control';

  constructor(private http : HttpClient) { }

  getControllingPlayer(politicoID : number) : Observable<Player> {
    return this.http.get<Player>(this.apiURL + "/politico/" + politicoID + "/controller");
  }

  getInfluenceDeclarations(politicoID : number) : Observable<InfluenceDeclared[]> {
    return this.http.get<InfluenceDeclared[]>(this.apiURL + "/politico/" + politicoID + "/declarations");
  }

  getControlledPoliticos(playerID : number) :  Observable<Politico[]> {
    return this.http.get<Politico[]>(this.apiURL + "/player/" + playerID + "/politicos");
  }

}
