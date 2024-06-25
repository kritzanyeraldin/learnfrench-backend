import { Router } from "express";
import { prisma } from "../db.js";
import { z } from "zod";

const router = Router();

const levelSchema = z.object({
  name: z.string(),
  alias: z.string(),
});

const aliasSchema = z.object({ alias: z.string() });

router.get("/level-alias/:alias", async (req, res) => {
  try {
    const { error, data: params } = aliasSchema.safeParse(req.params);
    if (error) {
      return res.status(404).json({
        message: "Bad payload",
        data: error.formErrors.fieldErrors,
      });
    }
    const level = await prisma.level.findUnique({
      where: {
        alias: params.alias,
      },
    });

    if (!level)
      return res.status(400).json({
        message: "Level doesn't exists",
      });
  } catch (error) {
    return res.status(500).json({ message: "error" });
  }
});

router.post("/new-level", async (req, res) => {
  try {
    if (!req.body)
      return res.status(404).json({
        message: "Invalid payload",
      });

    const { error, data: level } = levelSchema.safeParse(req.body);

    if (error) {
      return res.status(404).json({
        message: "Bad payload",
        data: error.formErrors.fieldErrors,
      });
    }
    const foundLevel = await prisma.level.findUnique({
      where: {
        alias: level.alias,
      },
    });

    if (foundLevel)
      return res.status(400).json({
        message: "Email already exists",
      });

    const newLevel = await prisma.level.create({
      data: level,
    });
    return res.json(newLevel);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "error" });
  }
});

router.get("/all-levels", async (req, res) => {
  try {
    const allLevels = await prisma.level.findMany();
    return res.json(allLevels);
  } catch (error) {
    return res.status(500).json({ message: "error" });
  }
});

export default router;
