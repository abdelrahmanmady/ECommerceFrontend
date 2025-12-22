import { Role } from '../Types/roleType';

/**
 * Represents a user in the system
 */
export interface User {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    roles: Role[];
}

/**
 * Response from login and refresh-token endpoints
 */
export interface AuthResponse {
    accessToken: string;
    user: User;
}
