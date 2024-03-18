import { Op } from "sequelize";
import Repertoire from "../../db/models/other/repertoire.model";
import File from "../../db/models/other/file.model";
import * as fileService from "../../services/file/file.service";

export async function createRepertoire(data: {
  name: string;
  folderId?: number | null;
  parentId?: number | null;
  createdBy: string;
}): Promise<any> {
  // Vérifier si le répertoire existe déjà avec le même nom et le même folderId ou parentId
  const existingRepertoire = await Repertoire.findOne({
    where: {
      name: data.name,
      [Op.or]: [{ folderId: data.folderId }, { parentId: data.parentId }],
    },
  });
  if (existingRepertoire) {
    throw new Error("Le répertoire existe déjà");
  }
  return Repertoire.create(data);
}

export async function getAllRepertoires(): Promise<any[]> {
  return Repertoire.findAll();
}

export async function getRepertoireById(id: number): Promise<any | null> {
  return Repertoire.findByPk(id);
}

export async function updateRepertoire(id: number, data: any): Promise<any> {
  return Repertoire.update(data, { where: { id } });
}

export async function deleteRepertoire(id: number): Promise<void> {
  // Récupérer tous les fichiers associés au répertoire
  const files = await File.findAll({ where: { folderId: id } });

  // Supprimer tous les fichiers
  await Promise.all(
    files.map(async (file: any) => {
      await fileService.deleteFile(file.id);
    })
  );

  // Récupérer tous les sous-dossiers associés au répertoire
  const subFolders = await Repertoire.findAll({ where: { parentId: id } });

  // Supprimer récursivement tous les sous-dossiers et leurs contenus
  await Promise.all(
    subFolders.map(async (subFolder: any) => {
      await deleteRepertoire(subFolder.id);
    })
  );

  // Supprimer le répertoire lui-même
  await Repertoire.destroy({ where: { id } });
}


export async function getRepertoiresByFolderId(
  folderId: number
): Promise<any[]> {
  return Repertoire.findAll({ where: { folderId } });
}

export async function getRepertoiresByParentId(
  parentId: number
): Promise<any[]> {
  return Repertoire.findAll({ where: { parentId } });
}
