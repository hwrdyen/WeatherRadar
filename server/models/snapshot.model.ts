import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prismaClient = new PrismaClient();

export const createSnapshotWeatherToday = async (
  req: Request,
  res: Response
) => {
  const userId = req.userId;
  const { id, time, interval, temperature_2m } = req.body;

  if (!userId) {
    res.status(400).json({ message: "Unauthorized: No user id provided!" });
    return;
  }

  try {
    const newSnapShot = await prismaClient.weatherToday.create({
      data: {
        id,
        userId,
        time,
        interval,
        temperature_2m,
      },
    });

    res.status(200).json({ message: `Snapshot is stored successfully!` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong!" });
  }
};

export const getSnapshotWeatherToday = async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    res.status(400).json({ message: "Unauthorized: No user id provided!" });
    return;
  }
  try {
    const SnapshotArray = await prismaClient.weatherToday.findMany({
      where: { userId },
      orderBy: {
        createdAt: "desc", // Order by the most recent first
      },
      take: 5, // Limit the number of results to 5
    });

    res.status(200).json(SnapshotArray);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong!" });
  }
};
