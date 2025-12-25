import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Role, RoleType } from '../Types/roleType';

export const roleGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastr = inject(ToastrService);

  const user = authService.user();
  const allowedRoles: Role[] = route.data['roles'];

  if (!user) {
    return router.createUrlTree(['/login']);
  }

  const hasRole = user.roles?.some((role) => allowedRoles.includes(role));

  if (hasRole) {
    return true;
  }

  toastr.error('You are not authorized to access this page');
  if (user.roles.includes(RoleType.Admin) || user.roles.includes(RoleType.Seller)) {
    return router.createUrlTree(['/admin']);
  }
  return router.createUrlTree(['/']);
};
