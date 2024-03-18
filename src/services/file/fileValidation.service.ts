// Importe le modèle de validation de fichier depuis le chemin spécifié
import FileValidation from "../../db/models/other/fileValidation.model";

// Fonction pour créer une nouvelle validation de fichier
export async function createFileValidation(data: {
  fileId: number;
  requestedBy: any;
  validatedBy: any;
}): Promise<any> {
  // Vérifie si une validation existe déjà pour ce fichier
  const existingValidation = await FileValidation.findOne({
    where: {
      fileId: data.fileId,
    },
  });

  // Si une validation existe déjà, lance une erreur
  if (existingValidation) {
    throw new Error("Une demande de validation pour ce fichier existe déjà");
  }

  // Crée une nouvelle validation si aucune existe déjà
  return FileValidation.create(data);
}

// Fonction pour obtenir la validation de fichier par l'ID du fichier
export async function getFileValidationByFileId(
  fileId: number
): Promise<any | null> {
  // Recherche la validation de fichier par l'ID du fichier
  return FileValidation.findOne({
    where: {
      fileId: fileId,
    },
  });
}

// Fonction pour obtenir toutes les validations de fichier
export async function getAllFileValidations(): Promise<any[]> {
  // Renvoie toutes les validations de fichier
  return FileValidation.findAll();
}

// Fonction pour obtenir la validation de fichier par son ID
export async function getFileValidationById(id: number): Promise<any | null> {
  // Recherche la validation de fichier par son ID
  return FileValidation.findByPk(id);
}

// Fonction pour mettre à jour la validation de fichier
export async function updateFileValidation(
  id: number,
  data: any
): Promise<any> {
  // Met à jour la validation de fichier avec les données spécifiées
  return FileValidation.update(data, { where: { fileId: id } });
}

// Fonction pour supprimer la validation de fichier par son ID
export async function deleteFileValidation(id: number): Promise<any> {
  // Supprime la validation de fichier par son ID
  return FileValidation.destroy({ where: { id } });
}
