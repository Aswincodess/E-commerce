import { products } from "./product.model";

export interface CustomBuild{

    minBudget: number;
    maxBudget:number;
    products: products[];
    total:number;

}
