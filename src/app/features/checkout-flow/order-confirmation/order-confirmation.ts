//Angular Imports
import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from "@angular/router";
//Libraries
import { ToastrService } from 'ngx-toastr';
//Models
import { OrderConfirmationResponse } from '../../../core/models';

declare const AOS: any;

@Component({
  selector: 'app-order-confirmation',
  imports: [RouterLink, CommonModule],
  templateUrl: './order-confirmation.html',
  styleUrl: './order-confirmation.css',
})
export class OrderConfirmation implements OnInit, AfterViewInit {
  //Angular
  private router = inject(Router);
  //Libraries
  private toastr = inject(ToastrService);

  //State
  order: OrderConfirmationResponse | null = null;

  ngOnInit() {
    this.order = history.state?.order || null;

    if (!this.order) {
      this.toastr.warning('No order found');
      this.router.navigate(['/home']);
    }
  }

  ngAfterViewInit(): void {
    if (typeof AOS !== 'undefined') {
      setTimeout(() => AOS.refresh(), 100);
    }
  }
}
