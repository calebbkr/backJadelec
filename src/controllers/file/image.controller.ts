import { Request, Response } from "express";
import * as imageService from "../../services/file/image.service";
import * as fs from "fs";
import sharp from "sharp";
import { UploadService } from "../../services/file/image.service";
import * as path from "path";

interface FileRequest extends Request {
  file?: Express.Multer.File;
}

export class UploadController {
  static async getImage(req: Request, res: Response): Promise<void> {
    const { folder, subFolder, id } = req.params;
    const imagePath = path.join(
      __dirname,
      `../../../uploads/${folder ?? ""}/${subFolder ?? ""}`,
      id
    );

    try {
      if (fs.existsSync(imagePath)) {
        // Si le fichier image existe, renvoyez-le
        res.sendFile(imagePath);
      } else {
        res.status(404).json({ message: "Image not found" });
      }
    } catch (error) {
      console.error("Error fetching image:", error);
      res.status(500).json({ message: "Error fetching image" });
    }
  }

  static async uploadFile(req: FileRequest, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ message: "Aucun fichier téléchargé" });
        return;
      }

      const { folder, subFolder } = req.params;

      const mimeType = req.file.mimetype;
      const supportedTypes = [
        "image/jpeg",
        "image/webp",
        "image/jpg",
        "image/png",
        "video/mp4",
        "application/pdf",
        "application/msword",
      ];

      if (!supportedTypes.includes(mimeType)) {
        fs.unlink(req.file.path, (err) => {
          if (err) {
            console.error("Error deleting local file:", err);
          } else {
            console.log("File deleted");
          }
        });
        res.status(400).json({ message: "Type de fichier non pris en charge" });

        // throw new Error("Type de fichier non pris en charge");
      } else {
        const urldata = await UploadService.uploadFile(
          req.file,
          folder,
          subFolder
        );
        res.status(200).json({ data: urldata });
      }
    } catch (error: any) {
      console.error("Erreur lors du téléchargement du fichier :", error);
      res
        .status(500)
        .json({ message: "Erreur lors du téléchargement du fichier" });
    }
  }

  static async deleteImage(req: Request, res: Response): Promise<void> {
    const { folder, subFolder, id } = req.params;

    try {
      await UploadService.deleteImage(id);
      res.status(200).json({ message: 'Image supprimée avec succès' });
    } catch (error: any) {
      console.error('Erreur lors de la suppression de l\'image :', error);
      res.status(500).json({ message: 'Erreur lors de la suppression de l\'image', error: error.message });
    }
  }
}
