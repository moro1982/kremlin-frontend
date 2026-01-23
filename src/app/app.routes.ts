import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { TableroComponent } from './components/tablero/tablero.component';
import { HomeComponent } from './components/home/home.component';
import { AssignControlComponent } from './components/assign-control/assign-control.component';
import { GameComponent } from './components/game/game.component';

export const routes: Routes = [
     { path: '', component: HomeComponent },
     { path: 'login', component: LoginComponent },
     { path: 'register', component: RegisterComponent},
     { path: 'assign', component: AssignControlComponent},
     { path: 'board', component: TableroComponent},
     { path: 'game', component: GameComponent},
     { path: '**', redirectTo: '' } // fallback
];
