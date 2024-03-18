// Importation du modèle de permission depuis la base de données
import Permission from "../../db/models/user/permissions.model";

// Fonction pour créer une permission avec les détails fournis
export async function createPermission(
  folderId: number,
  groupId: number | null,
  userId: string | null,
  readAccess: boolean,
  writeAccess: boolean,
  deleteAccess: boolean
): Promise<any> {
  // Création de la permission dans la base de données avec les détails fournis
  const permission = await Permission.create({ folderId, groupId, userId, readAccess, writeAccess, deleteAccess });
  return permission; // Retourne la permission créée
}

// Fonction pour mettre à jour une permission spécifiée par son ID avec les droits d'accès spécifiés
export async function updatePermission(
  permissionId: number,
  readAccess: boolean,
  writeAccess: boolean,
  deleteAccess: boolean
): Promise<any> {
  // Recherche de la permission par son ID
  const permission: any = await Permission.findByPk(permissionId);
  if (!permission) {
    throw new Error("Permission not found"); // Si la permission n'est pas trouvée, une erreur est levée
  }
  // Mise à jour des droits d'accès de la permission
  permission.readAccess = readAccess;
  permission.writeAccess = writeAccess;
  permission.deleteAccess = deleteAccess;
  await permission.save(); // Enregistrement des modifications dans la base de données
  return permission; // Retourne la permission mise à jour
}

// Fonction pour récupérer une permission par son ID
export async function getPermissionById(permissionId: number): Promise<any> {
  const permission = await Permission.findByPk(permissionId); // Recherche de la permission par son ID
  if (!permission) {
    throw new Error("Permission not found"); // Si la permission n'est pas trouvée, une erreur est levée
  }
  return permission; // Retourne la permission trouvée
}

// Fonction pour récupérer toutes les permissions de la base de données
export async function getAllPermissions(): Promise<any[]> {
  const permissions = await Permission.findAll(); // Récupération de toutes les permissions
  return permissions; // Retourne la liste de toutes les permissions
}

// Fonction pour supprimer une permission par son ID
export async function deletePermission(permissionId: number): Promise<void> {
  const permission = await Permission.findByPk(permissionId); // Recherche de la permission par son ID
  if (!permission) {
    throw new Error("Permission not found"); // Si la permission n'est pas trouvée, une erreur est levée
  }
  await permission.destroy(); // Suppression de la permission de la base de données
}

// Fonction pour récupérer toutes les permissions associées à un ID de dossier spécifié
export async function getPermissionsByFolderId(folderId: number): Promise<any[]> {
  try {
    // Recherche de toutes les permissions ayant le folderId donné
    const permissions = await Permission.findAll({ where: { folderId } });
    return permissions; // Retourne la liste des permissions trouvées
  } catch (error) {
    console.error("Error fetching permissions by folder ID:", error); // Affiche une erreur en cas d'échec de la recherche
    throw new Error("Error fetching permissions by folder ID"); // Lève une erreur
  }
}
