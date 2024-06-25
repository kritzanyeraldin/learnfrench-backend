import { Router } from "express";
import { prisma } from "../db.js";
import { z } from "zod";
import { parseStringToInteger } from "../../utils/parseStringToInteger.js";

const router = Router();

const sublevelSchema = z.object({
  name: z.string(),
  alias: z.string(),
  levelId: z.number(),
});

const aliasSchema = z.object({ alias: z.string() });
const levelIdSchema = z.object({ id: parseStringToInteger() });

router.get("/sublevel-alias/:alias", async (req, res) => {
  try {
    const { error, data: params } = aliasSchema.safeParse(req.params);
    if (error) {
      return res.status(404).json({
        message: "Bad payload",
        data: error.formErrors.fieldErrors,
      });
    }
    const sublevel = await prisma.sublevel.findUnique({
      where: {
        alias: params.alias,
      },
      // include: {
      //   level: true,
      // },
    });

    if (!sublevel)
      return res.status(400).json({
        message: "Level doesn't exists",
      });

    return res.json(sublevel);
  } catch (error) {
    return res.status(500).json({ message: "error" });
  }
});

router.get("/sublevels-level/:id", async (req, res) => {
  try {
    const { error, data: params } = levelIdSchema.safeParse(req.params);
    if (error) {
      return res.status(404).json({
        message: "Bad payload",
        data: error.formErrors.fieldErrors,
      });
    }
    const sublevel = await prisma.sublevel.findUnique({
      where: {
        levelId: params.id,
      },
      // include: {
      //   level: true,
      // },
    });

    if (!sublevel)
      return res.status(400).json({
        message: "Level doesn't exists",
      });

    return res.json(sublevel);
  } catch (error) {
    return res.status(500).json({ message: "error" });
  }
});

router.post("/new-sublevel", async (req, res) => {
  try {
    if (!req.body)
      return res.status(404).json({
        message: "Invalid payload",
      });

    const { error, data: sublevel } = sublevelSchema.safeParse(req.body);

    if (error) {
      return res.status(404).json({
        message: "Bad payload",
        data: error.formErrors.fieldErrors,
      });
    }
    const foundSublevel = await prisma.sublevel.findUnique({
      where: {
        alias: sublevel.alias,
      },
    });

    if (foundSublevel)
      return res.status(400).json({
        message: "Sublevel already exists",
      });

    const newLevel = await prisma.sublevel.create({
      data: sublevel,
    });
    return res.json(newLevel);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "error" });
  }
});

router.get("/all-sublevels", async (req, res) => {
  try {
    const allSubLevels = await prisma.sublevel.findMany();

    return res.json(
      Object.fromEntries(
        allSubLevels.map((elemento) => [elemento.alias, elemento])
      )
    );
  } catch (error) {
    return res.status(500).json({ message: "error" });
  }
});

export default router;
