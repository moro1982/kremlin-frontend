import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Player } from '../models/player';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  private apiURL = 'http://localhost:8080/player';

  constructor(private http : HttpClient){}

  getAllPlayers() : Observable<Player[]> {
    return this.http.get<Player[]>(this.apiURL + "/all");
  }

  getPlayerByID(id : number) : Observable<Player> {
    return this.http.get<Player>(this.apiURL + "/" + id);
  }
}
