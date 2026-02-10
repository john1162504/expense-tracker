import {
    LoginInput,
    PublicUser,
    RegisterInput,
    UpdateUserInput,
} from "@/schemas/user.schema";

export interface UserService {
    register(data: RegisterInput): Promise<PublicUser>;
    login(data: LoginInput): Promise<{ token: string; user: PublicUser }>;
    getUserInfo(userId: number): Promise<PublicUser>;
    updateUser(userId: number, data: UpdateUserInput): Promise<PublicUser>;
    deleteUser(userId: number): Promise<void>;
}
