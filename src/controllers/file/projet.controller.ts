import { Request, Response } from 'express';
import Projet from '../../db/models/other/projet.model';


// Créer un projet avec vérification de l'existence
export async function createProjet(req: Request, res: Response) {
    const { nom, clientId, adminId } = req.body;
    try {
      // Vérifiez d'abord si le projet existe déjà
      const existingProjet = await Projet.findOne({ where: { nom } });
      if (existingProjet) {
        return res.status(400).json({ message: "Project already exists" });
      }
  
      // Si le projet n'existe pas, créez-le
      const projet = await Projet.create({ nom, clientId, adminId });
      res.status(201).json(projet);
    } catch (error) {
      res.status(400).json({ message: "Error creating project:", error });
      console.error("Error creating project:", error);
    }
  }

// Récupérer tous les projets
export async function getAllProjets(req: Request, res: Response) {
  try {
    const projets = await Projet.findAll();
    res.status(200).json(projets);
  } catch (error) {
    res.status(400).json({ message: "Error fetching projects:", error });
    console.error("Error fetching projects:", error);
  }
}

// Récupérer un seul projet par ID
export async function getProjetById(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const projet = await Projet.findByPk(id);
    if (projet) {
      res.status(200).json(projet);
    } else {
      res.status(404).json({ message: "Project not found" });
    }
  } catch (error) {
    res.status(400).json({ message: "Error fetching project:", error });
    console.error("Error fetching project:", error);
  }
}

export async function getProjetByClientId(req: Request, res: Response) {
  const { clientId } = req.params;
  try {
      // Recherche de tous les projets associés à un client spécifique
      const projets = await Projet.findAll({ where: { clientId } });
      
      // Vérifie si des projets ont été trouvés
      if (projets.length > 0) {
          res.status(200).json(projets);
      } else {
          res.status(404).json({ message: "Aucun projet trouvé pour le client spécifié" });
      }
  } catch (error: any) {
      res.status(500).json({ message: 'Erreur lors de la récupération des projets associés au client', error: error.message });
  }
}

// Mettre à jour un projet
export async function updateProjet(req: Request, res: Response) {
  const { id } = req.params;
  const { nom, clientId, adminId } = req.body;
  try {
    const projet = await Projet.findByPk(id);
    if (projet) {
      await projet.update({ nom, clientId, adminId });
      res.status(200).json(projet);
    } else {
      res.status(404).json({ message: "Project not found" });
    }
  } catch (error) {
    res.status(400).json({ message: "Error updating project:", error });
    console.error("Error updating project:", error);
  }
}

// Supprimer un projet
export async function deleteProjet(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const projet = await Projet.findByPk(id);
    if (projet) {
      await projet.destroy();
      res.status(200).json({ message: "Project deleted successfully" });
    } else {
      res.status(404).json({ message: "Project not found" });
    }
  } catch (error) {
    res.status(400).json({ message: "Error deleting project:", error });
    console.error("Error deleting project:", error);
  }
}
