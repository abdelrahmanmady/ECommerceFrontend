import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role-guard';
import { RoleType } from './core/types/role.type';

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
                path: 'products',
                loadComponent: () => import('./features/shop/shop/shop').then(m => m.Shop)
            },
            {
                path: 'products/:id',
                loadComponent: () => import('./features/shop/product-details/product-details').then(m => m.ProductDetails)
            },
            {
                path: "cart",
                loadComponent: () => import('./features/checkout-flow/cart/cart').then(m => m.Cart),
                canActivate: [authGuard]
            },
            {
                path: "checkout",
                loadComponent: () => import('./features/checkout-flow/checkout/checkout').then(m => m.Checkout),
                canActivate: [authGuard]
            },
            {
                path: "about",
                loadComponent: () => import('./features/static/about/about').then(m => m.About)
            },
            {
                path: "contact-us",
                loadComponent: () => import('./features/static/contact/contact').then(m => m.Contact)
            },
            {
                path: "faq",
                loadComponent: () => import('./features/static/faq/faq').then(m => m.Faq)
            },
            {
                path: 'account',
                loadComponent: () => import('./features/account/account-layout/account-layout').then(m => m.AccountLayout),
                canActivate: [authGuard],
                children: [
                    { path: '', redirectTo: 'orders', pathMatch: 'full' },
                    { path: 'orders', loadComponent: () => import('./features/account/orders/orders').then(m => m.AccountOrders) },
                    { path: 'wishlist', loadComponent: () => import('./features/account/wishlist/wishlist').then(m => m.AccountWishlist) },
                    { path: 'reviews', loadComponent: () => import('./features/account/reviews/reviews').then(m => m.AccountReviews) },
                    { path: 'addresses', loadComponent: () => import('./features/account/addresses/addresses').then(m => m.AccountAddresses) },
                    { path: 'settings', loadComponent: () => import('./features/account/settings/settings').then(m => m.AccountSettings) }
                ]
            },
            {
                path: 'shippinginfo',
                loadComponent: () => import('./features/static/shipping-info/shipping-info').then(m => m.ShippingInfo)
            },
            {
                path: 'orderconfirmation',
                loadComponent: () => import('./features/checkout-flow/order-confirmation/order-confirmation').then(m => m.OrderConfirmation),
                canActivate: [authGuard]
            },
            {
                path: 'paymentmethods',
                loadComponent: () => import('./features/static/payment-methods/payment-methods').then(m => m.PaymentMethods)
            },
            {
                path: 'privacy',
                loadComponent: () => import('./features/static/privacy/privacy').then(m => m.Privacy)
            },
            {
                path: 'returnpolicy',
                loadComponent: () => import('./features/static/return-policy/return-policy').then(m => m.ReturnPolicy)
            },
            {
                path: 'support',
                loadComponent: () => import('./features/static/support/support').then(m => m.Support)
            },
            {
                path: 'searchresults',
                loadComponent: () => import('./features/search-results/search-results').then(m => m.SearchResults)
            },
            {
                path: 'tos',
                loadComponent: () => import('./features/static/tos/tos').then(m => m.Tos)
            }
        ]

    },
    {
        path: 'admin',
        canActivate: [authGuard, roleGuard],
        data: { roles: [RoleType.Admin, RoleType.Seller] },
        loadComponent: () => import('./layouts/admin-layout/admin-layout').then(m => m.AdminLayout),
        children: [
            {
                path: '',
                redirectTo: 'home',
                pathMatch: 'full'
            },
            {
                path: 'products',
                loadComponent: () => import('./features/admin/product/getall/getall').then(m => m.ProductListComponent)
            },
            {
                path: 'products/edit/:id',
                loadComponent: () => import('./features/admin/product/edit/edit').then(m => m.ProductEditComponent)
            },
            {
                path: 'products/add',
                loadComponent: () => import('./features/admin/product/add/add').then(m => m.ProductAddComponent)
            },
            {
                path: 'categories',
                loadComponent: () => import('./features/admin/Category/list/list').then(m => m.List)
            },
            {
                path: 'categories/edit/:id',
                loadComponent: () => import('./features/admin/Category/edit/edit').then(m => m.Edit)
            },
            {
                path: 'categories/add',
                loadComponent: () => import('./features/admin/Category/add/add').then(m => m.Add)
            },
            {
                path: 'orders',
                loadComponent: () => import('./features/admin/orders/orders').then(m => m.OrdersListComponent)
            },
            {
                path: 'orders/edit/:id',
                loadComponent: () => import('./features/admin/orders/edit-order/edit-order').then(m => m.OrderEditComponent)
            },
            {
                path: 'users',
                loadComponent: () => import('./features/admin/users/users').then(m => m.UsersListComponent),
                canActivate: [authGuard, roleGuard],
                data: { roles: [RoleType.Admin] }
            },
            {
                path: 'users/edit/:id',
                loadComponent: () => import('./features/admin/users/user-edit/user-edit').then(m => m.UserEditComponent),
                canActivate: [authGuard, roleGuard],
                data: { roles: [RoleType.Admin] }
            },
            {
                path: 'home',
                loadComponent: () => import('./features/admin/home/home').then(m => m.AdminDashboard)
            }
        ]
    },
    {
        path: '**',
        loadComponent: () => import('./features/static/not-found/not-found').then(m => m.NotFound)
    }
];