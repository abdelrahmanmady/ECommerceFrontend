import { APP_INITIALIZER, ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { NavigationEnd, provideRouter, Router, withInMemoryScrolling } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { authInterceptor } from './core/interceptors/auth-interceptor';
import { authInitializer } from './core/init/auth.initializer';
import { AuthService } from './core/services';
import { filter, pairwise } from 'rxjs';

// Custom scroll initializer - scrolls to top only on ROUTE changes (not query param changes)
function scrollToTopOnRouteChange() {
  const router = inject(Router);
  router.events.pipe(
    filter(event => event instanceof NavigationEnd),
    pairwise()
  ).subscribe(([prev, curr]: [NavigationEnd, NavigationEnd]) => {
    // Extract path without query params
    const prevPath = prev.urlAfterRedirects.split('?')[0];
    const currPath = curr.urlAfterRedirects.split('?')[0];

    // Only scroll to top if the route path actually changed
    if (prevPath !== currPath) {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  });
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'disabled' })),
    provideAnimations(),
    provideToastr({
      positionClass: 'toast-bottom-right',
      maxOpened: 3,
      autoDismiss: true
    }),
    provideHttpClient(withInterceptors([errorInterceptor, authInterceptor])),
    provideAppInitializer(authInitializer),
    provideAppInitializer(scrollToTopOnRouteChange)
  ]
};
