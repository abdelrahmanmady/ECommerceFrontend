export const RoleType = {
  SuperAdmin: 'SuperAdmin',
  Admin: 'Admin',
  Seller: 'Seller',
  Customer: 'Customer',
} as const;

export type Role = (typeof RoleType)[keyof typeof RoleType];
