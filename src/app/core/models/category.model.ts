
export interface Category { //Input : CategoryDto 
    id: number;
    name: string;
    description: string;
    parentId: number | null;
    subcategories: Category[];
}
