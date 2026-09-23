export interface User {

    id?: string;

    name: string;

    email: string;

    password: string;
    phone: string;
    

    role: 'user' | 'admin';
    active: boolean;


}