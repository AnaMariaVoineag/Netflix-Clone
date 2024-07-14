import { importProvidersFrom } from '@angular/core';
import { Routes } from '@angular/router';

export const routes: Routes = [
    {path: '', loadComponent: ()=> import('./login/login.component').then(a=> a.LoginComponent)},
    {path: 'home', loadComponent: ()=> import('./home/home.component').then(b=> b.HomeComponent)}
];
