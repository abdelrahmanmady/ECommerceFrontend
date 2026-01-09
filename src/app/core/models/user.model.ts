export interface AdminUserSummaryDto {
  id: string;
  avatarUrl?: string;
  fullName: string;
  email: string;
  emailConfirmed: boolean;
  phoneNumber?: string;
  phoneNumberConfirmed: boolean;
  ordersCount: number;
  role: string;
  created: string;
  updated?: string;
  isDeleted: boolean;
}

export interface UserDetailsResponse {
  id: string;
  created: string;
  updated?: string;
  avatarUrl?: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  emailConfirmed: boolean;
  phoneNumber?: string;
  phoneNumberConfirmed: boolean;
}

export interface UpdateUserRequest {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  phoneNumber?: string;
}

export interface UpdatePasswordRequest {
  oldPassword: string;
  newPassword: string;
}
