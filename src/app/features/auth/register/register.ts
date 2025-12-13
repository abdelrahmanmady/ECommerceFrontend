import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from "@angular/router";
import { AuthService } from '../../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  imports: [RouterLink, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  showPassword = false;

  constructor(
    private readonly authService: AuthService,
    private readonly toastr: ToastrService,
    private readonly router: Router
  ) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  register(form: NgForm) {
    if (form.invalid) {
      console.log("Form invalid");
      return;
    }

    console.log("Form Values:", form.value);
    this.authService.register(form.value.firstName, form.value.lastName, form.value.email.split('@')[0], form.value.email, form.value.phone, form.value.password).subscribe({
      next: (res) => {
        console.log(res);
        this.toastr.success('Registration successful!, please login');
        this.router.navigate(['login']);
      }
    });
  }
}
