import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Game } from '../../models/game/game';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private apiURL = 'http://localhost:8080/game/base';

  constructor(private http : HttpClient) { }
  
  getAllPlayers() : Observable<Game[]> {
      return this.http.get<Game[]>(this.apiURL + "/find/all");
  }

}
