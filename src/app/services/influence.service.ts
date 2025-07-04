import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { InfluenceAssigned } from '../models/influence-assigned';
import { InfluenceRequest } from '../models/influence-request';
import { InfluenceDeclared } from '../models/influence-declared';

@Injectable({
  providedIn: 'root'
})
export class InfluenceService {

  private apiURL = 'http://localhost:8080/influence';

  constructor(private http : HttpClient) { }

  getAllAssigned() : Observable<InfluenceAssigned[]> {
    return this.http.get<InfluenceAssigned[]>(this.apiURL + "/assigned/all");
  }

  getAssignedInfluenceByID(id : number) : Observable<InfluenceAssigned> {
    return this.http.get<InfluenceAssigned>(this.apiURL + "/assigned/" + id);
  }

  getPossibleValues(playerID : number) : Observable<number[]> {
    return this.http.get<number[]>(this.apiURL + "/assigned/possibleValues/" + playerID);
  }

  assignInfluence(assigned : InfluenceRequest) : Observable<InfluenceAssigned> {
    return this.http.post<InfluenceAssigned>(this.apiURL + "/assigned", assigned);
  }

  declareInfluence( declared : InfluenceRequest ) : Observable<InfluenceDeclared> {
    return this.http.post<InfluenceDeclared>(this.apiURL + "/declared", declared);
  }

}
