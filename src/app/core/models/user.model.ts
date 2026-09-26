export interface User {
    id?: string;
    name: string;
    email: string;
    phone: string;
    password: string;
    role: 'user' | 'admin';
    active: boolean;
    profileImage?: string;

    address?: {
        house: string;
        street: string;
        city: string;
        state: string;
        pincode: string;
    };
}