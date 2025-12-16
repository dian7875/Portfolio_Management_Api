import { User } from "generated/prisma/client";


export interface UserResponse{

    user: Partial<User>,
    acces_token:string
}