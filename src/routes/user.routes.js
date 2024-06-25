import { Router } from "express";
import { prisma } from "../db.js";
import { z } from "zod";
import { parseStringToInteger } from "../../utils/parseStringToInteger.js";

const router = Router();

const userSchema = z.object({
  username: z.string(),
  email: z.string().email("Invalid email"),
  password: z.string(),
});

const idSchema = z.object({
  id: parseStringToInteger(),
});

const emailSchema = z.object({ email: z.string().email() });

router.post("/users", async (req, res) => {
  try {
    if (!req.body)
      return res.status(404).json({
        message: "Invalid payload",
      });

    const { error, data: user } = userSchema.safeParse(req.body);

    if (error) {
      return res.status(404).json({
        message: "Bad payload",
        data: error.formErrors.fieldErrors,
      });
    }

    const foundUser = await prisma.user.findUnique({
      where: {
        email: user.email,
      },
    });

    if (foundUser)
      return res.status(400).json({
        message: "Email already exists",
      });

    const newUser = await prisma.user.create({
      data: user,
    });
    return res.json(newUser);
  } catch (error) {
    return res.status(500).json({ message: "error" });
  }
});

router.get("/all-users", async (req, res) => {
  try {
    const allUsers = await prisma.user.findMany();
    return res.json(allUsers);
  } catch (error) {
    return res.status(500).json({ message: "error" });
  }
});

router.get("/users/:id", async (req, res) => {
  try {
    const { error, data: params } = idSchema.safeParse(req.params);

    if (error) {
      return res.status(404).json({
        message: "Bad payload",
        data: error.formErrors.fieldErrors,
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!user)
      return res.status(400).json({
        message: "User doesn't exists",
      });

    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: "error" });
  }
});

router.get("/user-email/:email", async (req, res) => {
  try {
    const { error, data: params } = emailSchema.safeParse(req.params);

    if (error) {
      return res.status(404).json({
        message: "Bad payload",
        data: error.formErrors.fieldErrors,
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: params.email,
      },
    });

    if (!user)
      return res.status(400).json({
        message: "User doesn't exists",
      });

    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: "error" });
  }
});

router.put("/user/:id", async (req, res) => {
  try {
    const { error, data: params } = idSchema.safeParse(req.params);

    if (error) {
      return res.status(404).json({
        message: "Bad payload",
        data: error.formErrors.fieldErrors,
      });
    }

    const user = prisma.user.update({
      where: {
        id: parseInt(req.params.id),
      },
      data: req.body,
    });

    if (!user)
      return res.status(400).json({
        message: "User doesn't exists",
      });

    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: "error" });
  }
});

export default router;
