import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prismaClient = new PrismaClient();

export const getPersonalProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.userId;

  if (!userId) {
    res.status(400).json({ message: "Unauthorized: No user id provided!" });
    return;
  }

  try {
    const user = await prismaClient.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, username: true, avatar: true }, // Select only the fields you want
    });

    if (!user) {
      res.status(400).json({ message: "User not found!" });
      return;
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong!" });
  }
};

export const deletePersonalProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.userId;
  try {
    const user = await prismaClient.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      res.status(400).json({ message: "Unauthorized: No user id provided!" });
      return;
    }

    // Delete the user
    await prismaClient.user.delete({
      where: { id: userId },
    });

    // Send success response
    res
      .cookie("auth_token", "", {
        expires: new Date(0),
      })
      .status(200)
      .json({ message: "User deleted successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong!" });
  }
};
