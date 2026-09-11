import { EntityState } from "@ngrx/entity";
import { products } from "../../core/models/product.model";

export interface ProductState extends EntityState<products>{
    loading: boolean;
    error: string | null
}
