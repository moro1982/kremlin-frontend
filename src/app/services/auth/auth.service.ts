import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, tap } from 'rxjs';

interface AuthRequest {
  email? : string;
  username : string;
  password : string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private platformID = inject(PLATFORM_ID);

  private apiURL = "http://localhost:8080/auth";

  constructor(private http : HttpClient) { }

  register(request : AuthRequest) : Observable<string> {
    return this.http.post(this.apiURL + "/register", request, {responseType : 'text'});
  }

  login(request : AuthRequest) : Observable<{token : string}> {
    return this.http.post<{token : string}>(this.apiURL + "/login", request);
  }

  saveToken(token : string) {
    if (isPlatformBrowser(this.platformID)) {
      localStorage.setItem('token', token);
    }
  }

  getToken() : string | null {
    if (isPlatformBrowser(this.platformID)) {
      return localStorage.getItem('token');
    }
    return null;
  }

  logout() {
    if (isPlatformBrowser(this.platformID)) {
      localStorage.removeItem('token');
    }
  }

  isAuthenticated() : boolean {
    return !!this.getToken();
  }
  
}
