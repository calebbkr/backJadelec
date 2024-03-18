// Importe le modèle de fichier depuis le chemin spécifié
import File from "../../db/models/other/file.model";
// Importe le service de gestion des téléchargements pour les images
import { UploadService } from "./image.service";

// Fonction pour créer un nouveau fichier
export async function createFile(
  filename: string,
  comment: string,
  createdBy: any,
  urlData: any,
  validation: any,
  folderId: any
): Promise<any> {
  // Crée un nouveau fichier en utilisant le modèle File
  return File.create({
    filename,
    comment,
    createdBy,
    urlData,
    validation,
    folderId,
  });
}

// Fonction pour mettre à jour un fichier existant
export async function updateFile(fileId: number, updates: Partial<File>) {
  // Met à jour le fichier avec les modifications spécifiées
  return File.update(updates, { where: { id: fileId } });
}

// Fonction pour obtenir un fichier par son ID
export async function getFileById(fileId: number): Promise<any | null> {
  // Recherche un fichier par son ID et le renvoie
  return File.findByPk(fileId);
}

// Fonction pour supprimer un fichier par son ID
export async function deleteFile(fileId: number): Promise<any> {
  // Recherche le fichier par son ID
  const file: any = await File.findByPk(fileId);
  // Vérifie si le fichier existe
  if (file) {
    // Si le fichier a une URL de données, supprime l'image correspondante
    if (file.urlData) {
      UploadService.deleteImage(file.urlData);
    }
  }
  // Supprime le fichier de la base de données
  return File.destroy({ where: { id: fileId } });
}

// Fonction pour obtenir tous les fichiers dans un dossier spécifié
export async function getFilesByFolderId(folderId: number): Promise<any[]> {
  // Recherche tous les fichiers dans le dossier spécifié
  return File.findAll({ where: { folderId } });
}
