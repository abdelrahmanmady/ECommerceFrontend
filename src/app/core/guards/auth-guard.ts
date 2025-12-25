import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const toastr = inject(ToastrService);

  if (authService.user()) {
    return true;
  }

  toastr.info('Please login first');
  return false;
};
