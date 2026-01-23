import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from "@angular/forms";
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  email = "";
  username = "";
  password = "";
  errorMsg = "";

  constructor(private auth : AuthService, private router : Router) { }

  register() {
    this.auth
    .register( 
      { email : this.email,
        username : this.username, 
        password : this.password
      } 
    )
    .subscribe({
      next : (res) => {
        this.router.navigate(["/login"]);
      },
      error : (res) => {
        this.errorMsg = res;
      }
    });
  }

}
