import jwt from 'jsonwebtoken'
import { createBlogInput,updateBlogInput } from '@100xdevs/medium-common';
import { PrismaClient } from '@prisma/client';
import express from 'express'


export const blogRouter = express.Router();

const prisma = new PrismaClient();

 blogRouter.use(async (req,res,next)=>{
    try{const token = req.headers.authorization || " ";
    const user = jwt.verify(token , process.env.JWT_SECRET!) as {id:number};
//     The ! (non-null assertion operator) tells TypeScript:
// "I guarantee that JWT_SECRET is not undefined or null."
// It's useful when TypeScript can't be sure that the env variable exists, but you (the developer) are sure.
    if(user){
        (req as any).userId = user.id
        next();
// 🔍 1. (req as any).userId = user.id;
// ✅ What's going on:
// req is the Express Request object.
// You're adding a new property to it called userId.
// 🧠 Why the (req as any)?
// By default, TypeScript doesn't know that req has a userId field. Express's Request type doesn't include custom fields like that.
// So you override TypeScript's type checking by using as any:
// “Hey TypeScript, trust me — I know what I’m doing. Let me add a new property.”
// 👇 Without as any, this would throw a TypeScript error like:
// ❌ Property 'userId' does not exist on type 'Request'.
}else{
        res.status(403).json({
            message:"You are not logged in!"
        })
    }}catch(e){
        console.log(e);
        res.status(403).json({
            message:"You are not logged in!"
        })
    }

 })


blogRouter.post("/",async (req , res)=>{
const body = req.body
const { success } = createBlogInput.safeParse(body)
if(!success){
    res.json({
        message:"Invalid Inputs"
    })
}
const userId = (req as any).userId
try{const post = await prisma.blog.create({
        data:{
            title:body.title,
            content:body.content,
            authorId:userId
        }
})

res.json({
    id:post.id
})}catch(e){
    console.log(e);
    res.json({
        message:"Error while creating Blogs"
    })
}
})

blogRouter.put("/",async (req , res)=>{
    const body = req.body
    const {success} = updateBlogInput.safeParse(body);
    if(!success){
        res.status(411).json({
            message:"Invalid inputs"
        })
    }
    try{const post = await prisma.blog.update({
        where:{
            id:body.id,
        },data:{
            title: body.title,
            content:body.content,
        },
    });
    res.json({
        post:post.id
    })}catch(e){
        console.log(e);
        res.status(411).json({
            message:"Error while updating Blogs"
        })
    }

})


blogRouter.get("/bulk",async (req , res)=>{
    try{const blogs = await prisma.blog.findMany({
        select:{
            id:true,
            content:true,
            title:true,
            author:{
                select:{
                    name:true
                }
            }
        }
    });

    res.json({
        blogs
    })}catch(e){
        res.json({
            message:"Error while getting posts"
        })
    }
})


blogRouter.get("/:id",async (req , res)=>{
    const id = req.params.id;

    try{const blog = await prisma.blog.findFirst({
        where:{
            id: Number(id)
        },select:{
            id:true,
            title:true,
            content:true,
            author:{
                select:{
                    name:true
                }
            }
        }
    })
    res.json({
        blog
    })}catch(e){
        console.log(e);
        res.json({
            message:"Error while getting Blog"
        })
    }
})