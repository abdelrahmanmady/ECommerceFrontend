/**
 * Available user roles in the system
 */
export const RoleType = {
    Admin: 'Admin',
    Seller: 'Seller',
    Customer: 'Customer'
} as const;

/**
 * TypeScript type for role values
 */
export type Role = typeof RoleType[keyof typeof RoleType];
