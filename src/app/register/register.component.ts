import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from "@angular/forms";
import { NgIf } from "../../../node_modules/@angular/common/common_module.d-NEF7UaHr";

@Component({
  selector: 'app-register',
  imports: [FormsModule, NgIf],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  
  username = "";
  password = "";
  errorMsg = "";

  constructor(private auth : AuthService, private router : Router) { }

  register() {
    this.auth.register( {username : this.username, password : this.password} )
              .subscribe({
                next : (res) => {
                  console.log(res);
                },
                error : (res) => {
                  this.errorMsg = res;
                  console.log(this.errorMsg);
                }
              });
  }

}
