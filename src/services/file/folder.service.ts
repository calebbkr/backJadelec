import Folder from "../../db/models/other/folders.model";
import Repertoire from "../../db/models/other/repertoire.model";
import * as repertoireService from '../../services/file/repertoire.service';

// Fonction pour créer un nouveau dossier
export async function createFolderService(clientId: any, projectId: any, folderName: string | null, createdBy: any) {
  try {
    // Vérifie si un dossier avec le même nom existe déjà pour ce projet
    const existingFolder = await Folder.findOne({ where: { folderName: `${folderName}` } });
    if (existingFolder) {
      return { success: false, message: "Un dossier portant le même nom existe déjà pour ce projet" };
    }

    // Si le dossier n'existe pas, le créer
    const folder = await Folder.create({
      clientId,
      projectId,
      folderName: `${folderName}`,
      createdBy,
    });
    return { success: true, folder };
  } catch (error) {
    return { success: false, message: "Erreur lors de la création du dossier", error };
  }
}

// Fonction pour mettre à jour un dossier existant
export async function updateFolder(
  folderId: any,
  updatedFolder: any
){
  return await Folder.update(updatedFolder, { where: { id: folderId } });
}

// Fonction pour obtenir un dossier par son ID
export async function getFolderById(folderId: number){
  return await Folder.findByPk(folderId);
}

// Fonction pour obtenir tous les dossiers d'un projet
export async function getAllFolders(projectId: number){
  return await Folder.findAll({ where: { projectId: projectId } });
}

// Fonction pour obtenir tous les dossiers
export async function getAll(){
  return await Folder.findAll();
}

// Fonction pour supprimer un dossier
export async function deleteFolder(folderId: number) {
  // Trouve tous les répertoires associés à ce dossier
  const files = await Repertoire.findAll({ where: { folderId: folderId } });

  // Supprime tous les répertoires et leurs sous-répertoires ainsi que tous les fichiers associés
  await Promise.all(
    files.map(async (repertoire: any) => {
      await repertoireService.deleteRepertoire(repertoire.id)
    })
  );
  
  return await Folder.destroy({ where: { id: folderId } });
}
