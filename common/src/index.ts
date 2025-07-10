import z from "zod"

export const signupInput = z.object({
    username: z.string().email(),
    password:z.string(),
    name:z.string()
})

export const signinInput = z.object({
    username:z.string().email(),
    password:z.string().min(6)
})

export const createBlogInput = z.object({
    title:z.string(),
    content:z.string()
})

export const updateBlogInput = z.object({
    title:z.string(),
    content:z.string(),
    id:z.number()
})

export type SignupInput = z.infer<typeof signupInput>
export type SigninInput = z.infer<typeof signinInput>
export type CreateBlogInput = z.infer<typeof createBlogInput>
export type UpdateBlogInput = z.infer<typeof updateBlogInput>

//since we are doing this project like pre yarn or monorepos days
// we are going to publish this module to npm 
// so that we can use this zod types from npm by installing the packages