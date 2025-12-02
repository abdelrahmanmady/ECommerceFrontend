import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService, User } from '../../services/auth.service';
import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';

@Component({
    selector: 'app-account',
    imports: [NgClass,NgFor,NgIf,DatePipe,FormsModule,ReactiveFormsModule],
    templateUrl: './account.html',
    styleUrl: './account.css',
})
export class Account implements OnInit {
    currentUser: User | null = null;
    profileForm!: FormGroup;
    activeTab: string = 'profile';
    loading: boolean = false;
    successMessage: string = '';
    errorMessage: string = '';

    // Mock order data
    orders = [
        {
            id: 'ORD-001',
            date: '2024-01-15',
            total: 299.99,
            status: 'Delivered',
            items: 3
        },
        {
            id: 'ORD-002',
            date: '2024-01-20',
            total: 149.99,
            status: 'In Transit',
            items: 2
        }
    ];

    authService=inject(AuthService
    );
    formBuilder=inject(FormBuilder);
    router=inject(Router)
    ngOnInit(): void {
        this.authService.currentUser$.subscribe(user => {
            this.currentUser = user;
            if (!user) {
                this.router.navigate(['/login']);
            } else {
                this.initializeForm();
            }
        });
    }

    initializeForm(): void {
        const nameParts = this.currentUser?.name.split(' ') || ['', ''];
        this.profileForm = this.formBuilder.group({
            firstName: [nameParts[0] || '', [Validators.required]],
            lastName: [nameParts.slice(1).join(' ') || '', [Validators.required]],
            email: [this.currentUser?.email || '', [Validators.required, Validators.email]],
            phone: [this.currentUser?.phone || '', [Validators.pattern(/^[0-9]{10,15}$/)]]
        });
    }

    get f() {
        return this.profileForm.controls;
    }

    setActiveTab(tab: string): void {
        this.activeTab = tab;
        this.successMessage = '';
        this.errorMessage = '';
    }

    onSubmit(): void {
        if (this.profileForm.invalid) {
            Object.keys(this.profileForm.controls).forEach(key => {
                this.profileForm.controls[key].markAsTouched();
            });
            return;
        }

        this.loading = true;
        this.successMessage = '';
        this.errorMessage = '';

        const { firstName, lastName, email, phone } = this.profileForm.value;
        const fullName = `${firstName} ${lastName}`.trim();

        this.authService.updateProfile({ name: fullName, email, phone });

        setTimeout(() => {
            this.loading = false;
            this.successMessage = 'Profile updated successfully!';
        }, 500);
    }

    logout(): void {
        this.authService.logout();
    }
}

