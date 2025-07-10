// TODO : user routes working fine add zod validation 
import express from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { signupInput , signinInput } from '@100xdevs/medium-common';


export const userRouter = express.Router();
const prisma = new PrismaClient();

userRouter.post("/signup", async (req, res) => {
  const body =   req.body;
  const { success } = signupInput.safeParse(body)
  if(!success){
    res.json({
      message:"Invalid credentials"
    })
    return
  }
  
  try {
    const user = await prisma.user.create({
      data: {
        username: body.username,
        password: body.password,
        name: body.name
      }
    });

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET as string
    );

    res.send(token);
  } catch (e) {
    console.log(e);
    res.status(411).send("Error while creating user");
  }
});





userRouter.post("/signin", async (req, res ) => {
    const body =   req.body;
  const { success } = signinInput.safeParse(body)
  if(!success){
    res.json({
      message:"Invalid credentials"
    })
    return
  }
  try {
    const user = await prisma.user.findFirst({
      where: {
        username: body.username,
        password: body.password,
        
      }
    });

    if(!user){
      res.json({
        message: " Invalid user"
      })
    }else{
      const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET as string
    );
    res.send(token);
    }
  } catch (e) {
    console.log(e);
    res.status(411).send("Invalid user");
  }
});





