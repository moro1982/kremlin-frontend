import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { AssignControlComponent } from './components/assign-control/assign-control.component';
import { GameComponent } from './components/game/game.component';
import { BoardComponent } from './components/board/board.component';
import { GamePageComponent } from './components/game-page/game-page.component';
import { GameLobbyComponent } from './components/game-lobby/game-lobby.component';
import { GameListComponent } from './components/game-list/game-list.component';
import { InfluenceAssignmentComponent } from './components/influence-assignment/influence-assignment.component';
import { GameJoinComponent } from './components/game-join/game-join.component';

export const routes: Routes = [
     { path: '', component: HomeComponent },
     { path: 'login', component: LoginComponent },
     { path: 'register', component: RegisterComponent },
     { path: 'assign', component: AssignControlComponent },
     { path: 'board', component: BoardComponent },
     { path: 'games', component: GameComponent },
     { path: 'game-list', component: GameListComponent },
     { path: 'game/:gameID/join', component: GameJoinComponent},
     { path: 'game/:gameID/lobby', component: GameLobbyComponent },
     { path: 'game/:gameID/influence-assignment', component: InfluenceAssignmentComponent },
     { path: 'game/:gameID', component: GamePageComponent },
     { path: '**', redirectTo: '' } // fallback
];
