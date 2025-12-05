import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./layouts/main-layout/main-layout').then(m => m.MainLayout),
        children: [
            {
                path: '',
                redirectTo: 'home',
                pathMatch: 'full'
            },
            {
                path: 'home',
                loadComponent: () => import('./features/home/home').then(m => m.Home)
            },
            {
                path: 'register',
                loadComponent: () => import('./features/auth/register/register').then(m => m.Register)
            },
            {
                path: "login",
                loadComponent: () => import('./features/auth/login/login').then(m => m.Login)
            },
            {
                path: "cart",
                loadComponent: () => import('./features/cart/cart').then(m => m.Cart)
            },
            {
                path: "checkout",
                loadComponent: () => import('./features/checkout/checkout').then(m => m.Checkout)
            },
            {
                path: "about",
                loadComponent: () => import('./features/about/about').then(m => m.About)
            },
            {
                path: "contact-us",
                loadComponent: () => import('./features/contact/contact').then(m => m.Contact)
            },
            {
                path: "faq",
                loadComponent: () => import('./features/faq/faq').then(m => m.Faq)
            },
            {
                path: 'account',
                loadComponent: () => import('./features/account/account').then(m => m.Account)
            },
            {
                path: 'shipinginfo',
                loadComponent: () => import('./features/shiping-info/shiping-info').then(m =>m.ShipingInfo)
            },
            {
                path: 'orderconfirmation',
                loadComponent: () => import('./features/order-confirmation/order-confirmation').then(m =>m.OrderConfirmation)
            },
                        {
                path: 'paymentmethods',
                loadComponent: () => import('./features/payment-methods/payment-methods').then(m =>m.PaymentMethods)
            },
        ]

    },
    {
        path: 'admin',
        loadComponent: () => import('./layouts/admin-layout/admin-layout').then(m => m.AdminLayout),
        children: [
            {
                path: '',
                redirectTo: 'products',
                pathMatch: 'full'
            },
            {
                path: 'products',
                loadComponent: () => import('./admin/product/getall/getall').then(m => m.Getall)
            },
            {
                path: 'products/edit/:id',
                loadComponent: () => import('./admin/product/edit/edit').then(m => m.Edit)
            },
            {
                path: 'products/add',
                loadComponent: () => import('./admin/product/add/add').then(m => m.Add)
            },
            {
                path: 'categories',
                loadComponent: () => import('./admin/Category/list/list').then(m => m.List)
            },
            {
                path: 'categories/edit/:id',
                loadComponent: () => import('./admin/Category/edit/edit').then(m => m.Edit)
            },
            {
                path: 'categories/add',
                loadComponent: () => import('./admin/Category/add/add').then(m => m.Add)
            },
            {
                path: 'orders',
                loadComponent: () => import('./admin/orders/orders').then(m => m.OrdersListComponent)
            },
            {
                path: 'orders/edit/:id',
                loadComponent: () => import('./admin/orders/edit-order/edit-order').then(m => m.OrderEditComponent)
            }
        ]
    },
    {
        path: '**',
        loadComponent: () => import('./features/not-found/not-found').then(m => m.NotFound)
    }
];