import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'
import { Router, RouterLink } from "@angular/router";
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user-service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-login',
  imports: [FormsModule, NgClass, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  showPassword: boolean = false;
  rememberMe: boolean = false;

  email: string = '';
  password: string = '';


  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly userService: UserService,
    private readonly toastr: ToastrService
  ) {}


  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  login() {
    console.log(this.email, this.password);
    if(!this.email || !this.password) {
      return;
    }

    this.authService.login(this.email, this.password, this.rememberMe).subscribe({
      next: (res) => {
        this.toastr.success('Login successful!');
        console.log(res);

        localStorage.setItem('acessToken', res.accessToken);

        this.userService.user.set(res.user);
        this.userService.roles.set(res.roles);
        this.router.navigate(['home']);
      }
    })
    
  }
}