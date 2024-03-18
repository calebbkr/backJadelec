import express from 'express';
import { createProjet, getAllProjets, getProjetById, updateProjet, deleteProjet, getProjetByClientId } from '../../controllers/file/projet.controller';
import * as authMiddleware from '../../middlewares/authMiddleware';

const router = express.Router();

// Route pour créer un projet
router.post('/', authMiddleware.authenticateUser, authMiddleware.checkAdmin, createProjet);

// Route pour récupérer tous les projets
router.get('/', authMiddleware.authenticateUser, authMiddleware.checkAdmin, getAllProjets);

// Route pour récupérer un seul projet par ID
router.get('/:id', authMiddleware.authenticateUser, getProjetById);

// Route pour récupérer un tous les projets associé a un client

router.get('/all/:clientId', authMiddleware.authenticateUser, getProjetByClientId);

// Route pour mettre à jour un projet
router.put('/:id', authMiddleware.authenticateUser, authMiddleware.checkAdmin, updateProjet);

// Route pour supprimer un projet
router.delete('/:id', deleteProjet);

export default router;