export interface LoginSessionDto {
  id: number;
  ipAddress?: string;
  userAgent?: string;
  created: string;
  isActive: boolean;
}
