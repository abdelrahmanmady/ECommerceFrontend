import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-register',
  imports: [RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

  togglePassword(el : HTMLInputElement, event:Event) {
        // const passwordField = document.getElementById(id) ;
        const icon = event.target as HTMLElement ;

        if (el?.type === 'password') {
            el.type = 'text';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        } else {
            el.type = 'password';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        }
    }
 

}
