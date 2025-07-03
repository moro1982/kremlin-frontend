import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InfluenceService {

  private apiURL = 'http://localhost:8080/influence';

  constructor(private http : HttpClient) { }

  /* Definir métodos */
  


}
