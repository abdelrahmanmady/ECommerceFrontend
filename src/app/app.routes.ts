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
        path : 'product-details',
        loadComponent:() => import('./features/shop/product-details/product-details').then(m=>m.ProductDetails)
    },
    {
        path: 'shop',
        loadComponent: () => import('./features/shop/shop/shop').then(m => m.Shop)
    }
    

];
