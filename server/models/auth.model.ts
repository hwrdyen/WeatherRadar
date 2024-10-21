import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prismaClient = new PrismaClient();

export const register = async (req: Request, res: Response) => {
  const { id, username, email, password, avatar } = req.body;
  try {
    const userAlreadyExisted = await prismaClient.user.findUnique({
      where: { email: email },
    });
    if (userAlreadyExisted) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prismaClient.user.create({
      data: {
        id,
        username,
        email,
        password: hashedPassword,
        avatar,
      },
    });

    res.status(200).json({ message: `User ${username} created successfully!` });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to create user!" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const userFound = await prismaClient.user.findUnique({
      where: { email: email },
    });
    if (!userFound) {
      res.status(401).json({ message: "No user associated with this email!" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, userFound.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid Credentials!" });
      return;
    }

    const token = jwt.sign(
      { userId: userFound.id },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: "10m" }
    );

    const { password: userFoundPassword, ...userFoundInfo } = userFound;

    // create a cookie called auth_token with jwtToken value
    res
      .cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 86400000, // in ms
      })
      .status(200)
      .json(userFoundInfo);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to login!" });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    res
      .cookie("auth_token", "", {
        expires: new Date(0),
      })
      .status(200)
      .json({ message: "Logout successfully!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to lougout!" });
  }
};
