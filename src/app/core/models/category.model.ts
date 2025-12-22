/**
 * Represents a product category with optional subcategories
 */
export interface Category {
    id: number;
    name: string;
    description: string;
    parentId: number | null;
    subcategories: Category[];
}
