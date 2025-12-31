import { AfterViewInit, Component } from '@angular/core';
import { RouterLink } from "@angular/router";

declare const AOS: any;

@Component({
  selector: 'app-payment-methods',
  imports: [RouterLink],
  templateUrl: './payment-methods.html',
  styleUrl: './payment-methods.css',
})
export class PaymentMethods implements AfterViewInit {
  ngAfterViewInit(): void {
    if (typeof AOS !== 'undefined') {
      setTimeout(() => AOS.refresh(), 100);
    }
  }
}
