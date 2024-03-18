// Importation du modèle de groupe depuis la base de données
import Group from "../../db/models/user/groups.model";

// Fonction pour créer un groupe avec un nom spécifié
export async function createGroup(name: string, createdBy: string): Promise<any> {
  // Vérification si un groupe avec ce nom existe déjà
  const existingGroup = await Group.findOne({ where: { name } });
  if (existingGroup) {
    throw new Error('A group with the same name already exists');
  }
  // Création du groupe dans la base de données avec les détails fournis
  const group = await Group.create({ name, createdBy });
  return group; // Retourne le groupe créé
}

// Fonction pour mettre à jour le nom d'un groupe spécifié par son ID
export async function updateGroup(groupId: number, name: string): Promise<any> {
  // Recherche du groupe par son ID
  const group: any = await Group.findByPk(groupId);
  if (!group) {
    throw new Error("Group not found"); // Si le groupe n'est pas trouvé, une erreur est levée
  }
  // Mise à jour du nom du groupe
  group.name = name;
  await group.save(); // Enregistrement des modifications dans la base de données
  return group; // Retourne le groupe mis à jour
}

// Fonction pour récupérer un groupe par son ID
export async function getGroupById(groupId: number): Promise<any> {
  const group = await Group.findByPk(groupId); // Recherche du groupe par son ID
  if (!group) {
    throw new Error("Group not found"); // Si le groupe n'est pas trouvé, une erreur est levée
  }
  return group; // Retourne le groupe trouvé
}

// Fonction pour récupérer tous les groupes de la base de données
export async function getAllGroups(): Promise<any[]> {
  const groups = await Group.findAll(); // Récupération de tous les groupes
  return groups; // Retourne la liste de tous les groupes
}

// Fonction pour supprimer un groupe par son ID
export async function deleteGroup(groupId: number): Promise<void> {
  const group = await Group.findByPk(groupId); // Recherche du groupe par son ID
  if (!group) {
    throw new Error("Group not found"); // Si le groupe n'est pas trouvé, une erreur est levée
  }
  await group.destroy(); // Suppression du groupe de la base de données
}
