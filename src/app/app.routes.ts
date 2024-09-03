import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { MovieWidgetComponent } from './pages/movie-widget/movie-widget.component';

export const routes: Routes = [
    {path: '', redirectTo: '/login', pathMatch: 'full' },
    {path: 'login', component: LoginComponent},
    {path: 'home', component: HomeComponent},
    {path: 'movie-widget/:id/:okruId', component: MovieWidgetComponent},
];