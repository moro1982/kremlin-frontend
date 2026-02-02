import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { Game } from '../../models/game/game';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private platformID = inject(PLATFORM_ID);
  private apiURL = 'http://localhost:8080/game/base';

  constructor(private http : HttpClient) { }
  
  getAllGames() : Observable<Game[]> {
    if (!isPlatformBrowser(this.platformID)) {
      return EMPTY;
    }

    return this.http.get<Game[]>(this.apiURL + "/find/all");
  }

  createNewGame() : Observable<Game> {
    return this.http.post<Game>(this.apiURL + "/new", null);
  }

}
