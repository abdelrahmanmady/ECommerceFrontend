import { AfterViewInit, Component } from '@angular/core';
import { RouterLink } from "@angular/router";

declare const AOS: any;

@Component({
  selector: 'app-shipping-info',
  imports: [RouterLink],
  templateUrl: './shipping-info.html',
  styleUrl: './shipping-info.css',
})
export class ShippingInfo implements AfterViewInit {
  ngAfterViewInit(): void {
    if (typeof AOS !== 'undefined') {
      setTimeout(() => AOS.refresh(), 100);
    }
  }
}
