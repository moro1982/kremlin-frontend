import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { TableroComponent } from './tablero/tablero.component';
import { HomeComponent } from './home/home.component';
import { AssignControlComponent } from './assign-control/assign-control.component';

export const routes: Routes = [
     { path: '', component: HomeComponent },
     { path: 'login', component: LoginComponent },
     { path: 'register', component: RegisterComponent},
     { path: 'assign', component: AssignControlComponent},
     { path: 'board', component: TableroComponent},
     { path: '**', redirectTo: '' } // fallback
];
