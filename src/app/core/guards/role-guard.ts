//Angular Imports
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
//Libraries
import { ToastrService } from 'ngx-toastr';
//Services
import { AuthService } from '../services/auth.service';
//Types
import { Role, RoleType } from '../types/role.type';

export const roleGuard: CanActivateFn = (route) => {
  //Angular
  const router = inject(Router);
  //Libraries
  const toastr = inject(ToastrService);
  //Services
  const authService = inject(AuthService);

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
  if (
    user.roles.includes(RoleType.SuperAdmin) ||
    user.roles.includes(RoleType.Admin) ||
    user.roles.includes(RoleType.Seller)
  ) {
    return router.createUrlTree(['/admin']);
  }
  return router.createUrlTree(['/']);
};
