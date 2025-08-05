
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Ministry } from '../models/ministry';

@Injectable({
  providedIn: 'root'
})
export class MinistryService {

  private apiURL = 'http://localhost:8080/ministry';

  constructor(private http : HttpClient) {}

  getMinistryByID(id : number) : Observable<Ministry> {
    return this.http.get<Ministry>(this.apiURL + "/" + id);
  }

  getMinisterios() : Observable<Ministry[]> {
    return this.http.get<Ministry[]>(this.apiURL + "/all");
  }

  loadMinistries() : Observable<Ministry[]> {
    return this.http.post<Ministry[]>(this.apiURL + "/loadAll", null);
  }

  assignMinister(idMin : number, idPol : number) : Observable<Ministry> {
    return this.http.put<Ministry>(this.apiURL + "/" + idMin + "/minister/" +  idPol, null);
  }

  removeMinister(idMin : number) : Observable<Ministry> {
    return this.http.delete<Ministry>(this.apiURL + "/" + idMin + "/minister");
  }

  assignRandomMinisters() : Observable<Ministry[]> {
    return this.http.post<Ministry[]>(this.apiURL + "/setup/assign_all_ministers", null);
  }

}
