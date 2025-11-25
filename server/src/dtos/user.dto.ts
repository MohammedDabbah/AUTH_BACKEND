import z, { email } from "zod";

export interface CreateUserDTO {
    name: string,
    email: string,
    password: string
};

export const RegisterSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

export type RegisterDTO = z.infer<typeof RegisterSchema>;


export const LoginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

export type LoginDTO = z.infer<typeof LoginSchema>;

// export interface RegisterDTO {
//   name: string;
//   email: string;
//   password: string;
// }

// export interface LoginDTO {
//   email: string;
//   password: string;
// }
