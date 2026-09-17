export interface products {
    id: number;
    name: string;
    price: number;
    image: string;
    category: string;
    subcategory: string;
    description: string;
    brand: string;
    specifications: {
        [key: string]: string;
    };
    stock: number;
    maxQuantity: number;
    rating: number;
}