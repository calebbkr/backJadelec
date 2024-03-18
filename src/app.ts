import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import RoleRoute from "./routes/auth/role.route";
import authRoutes from "./routes/auth/authAdmin.route";
import folderRoutes from "./routes/file/folder.route";
import groupRoutes from "./routes/auth/group.router";
import permissionRoutes from "./routes/auth/permission.router";
import fileRoutes from "./routes/file/file.router";
import projetRoutes from "./routes/file/projet.router";
import fileValidation from "./routes/file/fileValidation.router";
import imageRoutes from "./routes/file/image.router";
import repertoireRoutes from "./routes/file/repertoire.router";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan"; // Importez morgan depuis le package

import "dotenv/config";
import { logMiddleware } from "./middlewares/logMiddleware";

const app = express();
const port = 3000;

app.use(
  cors({
    origin: "http://localhost:3001",
    credentials: true,
  })
);
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(morgan('combined'));

app.use("/role", RoleRoute);
app.use("/auth", authRoutes);
app.use("/folder", folderRoutes);
app.use("/projet", projetRoutes);
app.use("/group", groupRoutes);
app.use("/permission", permissionRoutes);
app.use("/file", fileRoutes);
app.use("/image", imageRoutes);
app.use("/repertoire", repertoireRoutes);
app.use("/fileValidation", fileValidation);

app.get("/", logMiddleware, (req: Request, res: Response) => {
  res.send("Bienvenue sur le serveur de Jadelec développé par lenex.fr");
});

app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
