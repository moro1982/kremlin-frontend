import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface AuthRequest {
  username : string;
  password : string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiURL = "http://localhost:8080/auth";

  constructor(private http : HttpClient) { }

  register(request : AuthRequest) : Observable<string> {
    return this.http.post(this.apiURL + "/register", request, {responseType : 'text'});
  }

  login(request : AuthRequest) : Observable<{token : string}> {
    return this.http.post<{token : string}>(this.apiURL + "/login", request);
  }

  saveToken(token : string) {
    localStorage.setItem('jwt', token);
  }

  getToken() : string | null {
    return localStorage.getItem('jwt');
  }

  logout() {
    localStorage.removeItem('jwt');
  }

  isAuthenticated() : boolean {
    return !!this.getToken();
  }
  
}
