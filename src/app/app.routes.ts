import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'register',
        loadComponent: () => import('./features/auth/register/register').then(m => m.Register)
    },
    {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login').then(m => m.Login)
    },
    {
        path: 'home',
        loadComponent: () => import('./features/home/home').then(m => m.Home)
    },
    {
        path: 'about',
        loadComponent: () => import('./features/about/about').then(m => m.About)
    },
    {
        path: 'cart',
        loadComponent: () => import('./features/cart/cart').then(m => m.Cart)
    },
    {
        path: 'checkout',
        loadComponent: () => import('./features/checkout/checkout').then(m => m.Checkout)
    },
    {
        path: 'contact',
        loadComponent: () => import('./features/contact/contact').then(m => m.Contact)
    },
    {
        path: 'faq',
        loadComponent: () => import('./features/faq/faq').then(m => m.Faq)
    },
    {
        path: '**',
        loadComponent: () => import('./features/not-found/not-found').then(m => m.NotFound)
    },

];
