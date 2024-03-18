import { v4 as uuidv4 } from 'uuid'; 
import * as fs from 'fs';
import * as path from 'path'; 

export class UploadService {
  static async uploadFile(file: any, folder: string | null, subFolder: string | null): Promise<string> {
    if (!file) {
      throw new Error('Aucun fichier téléchargé'); // Si aucun fichier n'est téléchargé, lance une erreur
    }

    const filename = uuidv4() + file.originalname; // Génère un nom de fichier unique en utilisant uuidv4 et le nom original du fichier
    const uploadPath = path.join(__dirname, `../../../uploads/${folder ?? ''}/${subFolder ?? ''}`, filename); // Définit le chemin de téléchargement du fichier

    // Vérifie si le dossier de destination existe, sinon le crée
    await fs.promises.mkdir(path.dirname(uploadPath), { recursive: true });

    // Déplace le fichier téléchargé vers le dossier spécifié
    await fs.promises.rename(file.path, uploadPath);

    // Retourne le chemin relatif du fichier téléchargé
    return `/uploads/${folder ?? ''}/${subFolder ?? ''}/${filename}`;
  }

  static deleteImage(id: any): void {
    const imagePath = path.join(__dirname, `../../..${id ?? ''}`); // Définit le chemin complet de l'image à supprimer

    try {
        if (fs.existsSync(imagePath)) {
            // Si le fichier image existe, le supprime
            fs.unlinkSync(imagePath);
        } else {
            throw new Error('Image non trouvée'); // Si le fichier image n'est pas trouvé, lance une erreur
        }
    } catch (error: any) {
        throw new Error(`Erreur lors de la suppression de l'image : ${error.message}`); // Gère les erreurs lors de la suppression de l'image
    }
  }
}
