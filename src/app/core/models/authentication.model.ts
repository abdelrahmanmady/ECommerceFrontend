import { Role } from '../Types/roleType';

export interface RegisterRequest {
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    password: string;
    phoneNumber?: string;
}

export interface LoginRequest {
    identifier: string;
    password: string;
    rememberMe: boolean;
}

export interface AuthResponse {
    accessToken: string;
    userId: string;
    fullName: string;
    email: string;
    roles: Role[];
}
