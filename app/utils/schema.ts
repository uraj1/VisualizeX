import { z } from "zod"

export const signUpSchema = z.object({
    name: z.string().min(2, "Name is required").max(255),
    email: z.string().email("Invalid Email").max(255),
    password: z.string().min(8, "Password must be at least 8 characters")
})

export const signInSchema = z.object({
    email: z.string().email("Invalid Email").max(255),
    password: z.string().min(8, "Password must be at least 8 characters")
})


export type signUp = z.infer<typeof signUpSchema>
export type signIn = z.infer<typeof signInSchema>