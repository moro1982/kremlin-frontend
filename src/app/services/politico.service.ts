
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Politico } from '../models/politico';

@Injectable({
  providedIn: 'root'
})
export class PoliticoService {

  private apiUrl = 'http://localhost:8080/politico';

  constructor(private http: HttpClient) {}

  getPoliticoByID(id : number) : Observable<Politico> {
      return this.http.get<Politico>(this.apiUrl + "/" + id);
  }

  getPoliticos(): Observable<Politico[]> {
    return this.http.get<Politico[]>(this.apiUrl + "/all");
  }

  createSinglePolitico(politico : Politico) : Observable<Politico> {
    return this.http.post<Politico>(this.apiUrl + "/single", politico);
  }

  loadPoliticos() : Observable<Politico[]> {
    return this.http.post<Politico[]>(this.apiUrl + "/loadAll", null);
  }
  
}
