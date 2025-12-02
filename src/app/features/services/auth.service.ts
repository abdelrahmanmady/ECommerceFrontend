import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

export interface User {
    id: string;
    email: string;
    name: string;
    phone?: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    phone?: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private currentUserSubject: BehaviorSubject<User | null>;
    public currentUser$: Observable<User | null>;

    constructor(private router: Router) {
        const savedUser = localStorage.getItem('currentUser');
        this.currentUserSubject = new BehaviorSubject<User | null>(
            savedUser ? JSON.parse(savedUser) : null
        );
        this.currentUser$ = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User | null {
        return this.currentUserSubject.value;
    }

    public get isLoggedIn(): boolean {
        return !!this.currentUserSubject.value;
    }

    login(credentials: LoginCredentials): Observable<boolean> {
        return new Observable(observer => {
            // Simulate API call
            setTimeout(() => {
                // Mock validation - in real app, this would be an HTTP request
                if (credentials.email && credentials.password) {
                    const user: User = {
                        id: 'user-' + Math.random().toString(36).substr(2, 9),
                        email: credentials.email,
                        name: credentials.email.split('@')[0]
                    };
                    
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    this.currentUserSubject.next(user);
                    observer.next(true);
                } else {
                    observer.next(false);
                }
                observer.complete();
            }, 500);
        });
    }

    register(data: RegisterData): Observable<boolean> {
        return new Observable(observer => {
            // Simulate API call
            setTimeout(() => {
                if (data.email && data.password && data.name) {
                    const user: User = {
                        id: 'user-' + Math.random().toString(36).substr(2, 9),
                        email: data.email,
                        name: data.name,
                        phone: data.phone
                    };
                    
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    this.currentUserSubject.next(user);
                    observer.next(true);
                } else {
                    observer.next(false);
                }
                observer.complete();
            }, 500);
        });
    }

    logout(): void {
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
        this.router.navigate(['/login']);
    }

    updateProfile(user: Partial<User>): void {
        const currentUser = this.currentUserValue;
        if (currentUser) {
            const updatedUser = { ...currentUser, ...user };
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));
            this.currentUserSubject.next(updatedUser);
        }
    }
}
