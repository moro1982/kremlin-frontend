import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  username = "";
  password = "";
  errorMsg = "";

  constructor(private auth : AuthService, private router : Router) { }

  login() {
    this.auth.login( {username : this.username, password : this.password} )
              .subscribe({
                next : (res) => {
                  this.auth.saveToken(res.token);
                  this.router.navigate(["/games"]);
                },
                error : () => {
                  this.errorMsg = "Credenciales inválidas.";
                }
              });
  }
}
