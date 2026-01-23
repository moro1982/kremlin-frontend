import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from "@angular/forms";
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, NgIf],
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
                  this.router.navigate(["/assign"]);
                },
                error : () => {
                  this.errorMsg = "Credenciales inválidas.";
                }
              });
  }
}
