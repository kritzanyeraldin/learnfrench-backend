import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import usersRoutes from "./routes/user.routes.js";
import levelRoutes from "./routes/level.routes.js";
import sublevelRoutes from "./routes/sublevel.routes.js";
import chapterRoutes from "./routes/chapter.routes.js";
import { main } from "./functions.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.use("/api", usersRoutes);
app.use("/api", levelRoutes);
app.use("/api", sublevelRoutes);
app.use("/api", chapterRoutes);

// main();
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log("Server on port", port);
});
