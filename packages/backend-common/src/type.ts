import z from "zod";

export const UserRegisterSchema = z.object({
    email: z.string().email({message: "Invalid email address"}),
    password: z.string().min(6, {message: "Password must be at least 6 characters long"}).max(100),
});

export const RoomSchema=z.object({
    name:z.string().min(1, {message: "Room name cannot be empty"}).max(100),
    desc:z.string().max(500, {message: "Room description cannot exceed 500 characters"}).optional(),
})