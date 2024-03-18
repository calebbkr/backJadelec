import { NextFunction, Request, Response } from "express";
import * as authService from "../../services/auth/authAdmin.service";
import bcrypt from "bcrypt"; 
const code_secret = process.env.CODE_SECRET_KEY ?? ""; 

// Interface pour la requête authentifiée contenant l'ID de l'utilisateur
interface AuthenticatedRequest extends Request {
  user: { id: string };
}

// Interface pour la requête authentifiée
interface AuthenticatedReq extends Request {
  user?: any;
}

// Fonction pour enregistrer un nouvel utilisateur
export async function register(req: Request, res: Response): Promise<any> {
  const { name, email, code, password } = req.body; // Récupère les données de la requête

  try {
    if (code != code_secret) { // Vérifie si le code fourni correspond au code secret
      res.status(400).json({ message: "Le code fourni est incorrect" }); // Renvoie une réponse avec un message d'erreur si le code est incorrect
    }

    const MIN_PASSWORD_LENGTH = 8; // Longueur minimale du mot de passe

    if (password.length < MIN_PASSWORD_LENGTH) { // Vérifie la longueur minimale du mot de passe
      return res.status(400).json({ message: `Le mot de passe doit contenir au moins ${MIN_PASSWORD_LENGTH} caractères` }); // Renvoie une réponse avec un message d'erreur si la longueur du mot de passe est inférieure à la longueur minimale
    }

    await authService.createUserWithRole(name, email, code, password); // Crée un nouvel utilisateur avec le rôle spécifié
    res.status(201).json({ message: "Utilisateur créé avec succès" }); // Renvoie une réponse avec un message de succès
  } catch (error: any) {
    if (error.message === "User with this email already exists") { // Vérifie si l'utilisateur avec cet e-mail existe déjà
      res.status(400).json({ message: "Un utilisateur avec cet e-mail existe déjà" }); // Renvoie une réponse avec un message d'erreur si l'utilisateur existe déjà
    } else {
      console.error("Erreur lors de la création de l'utilisateur:", error); // Affiche l'erreur dans la console
      res.status(500).json({ message: "Erreur lors de la création de l'utilisateur" }); // Renvoie une réponse avec un message d'erreur
    }
  }
}

// Fonction pour la connexion avec l'e-mail et le mot de passe
export async function loginWithEmail(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body; // Récupère l'e-mail et le mot de passe à partir du corps de la requête

  try {
    const token = await authService.authenticateWithEmail(email, password); // Authentifie l'utilisateur avec l'e-mail et le mot de passe

    res.cookie("accessToken", token, { httpOnly: true, maxAge: 60 * 1000 }); // Configure le cookie d'accès avec le jeton

    const otp = authService.generateOtp(); // Génère un code OTP
    const hashedOtp = await bcrypt.hash(otp, 10); // Hache le code OTP
    res.cookie("otp", hashedOtp, { httpOnly: true, maxAge: 60 * 1000 }); // Configure le cookie OTP

    await authService.sendOtpByEmail(email, otp); // Envoie le code OTP par e-mail

    res.status(200).json({ message: "Authentification réussie" }); // Renvoie une réponse avec un message de succès
  } catch (error: any) {
    console.error("Erreur lors de la connexion avec l'e-mail:", error); // Affiche l'erreur dans la console
    res.status(401).json({ message: error.message }); // Renvoie une réponse avec un message d'erreur
  }
}

// Fonction pour vérifier le code OTP
export async function verifyOtp(req: AuthenticatedReq, res: Response): Promise<void> {
  const { otp } = req.body; // Récupère le code OTP à partir du corps de la requête
  const email = req.user.email; // Récupère l'e-mail de l'utilisateur à partir de la requête
  const tokenotp = req.cookies.otp; // Récupère le code OTP haché du cookie

  if (!tokenotp) {
    res.status(401).json({ message: "Erreur contacter le service client" }); // Renvoie une réponse avec un message d'erreur si le code OTP n'est pas trouvé dans le cookie
  }

  try {
    const tokenUser = await authService.verifyOtp(email, otp, tokenotp); // Vérifie le code OTP

    res.cookie("authorizationToken", tokenUser, { httpOnly: true, maxAge: 3600000 * 8 }); // Configure le cookie d'autorisation

    res.status(200).json({ message: "Succès" }); // Renvoie une réponse avec un message de succès
  } catch (error: any) {
    console.error("Erreur lors de la vérification du code OTP:", error); // Affiche l'erreur dans la console
    res.status(401).json({ message: error.message }); // Renvoie une réponse avec un message d'erreur
  }
}

// Fonction pour la déconnexion de l'utilisateur
export function logout(req: Request, res: Response): void {
  res.clearCookie("accessToken"); // Supprime le cookie d'accès
  res.clearCookie("authorizationToken"); // Supprime le cookie d'autorisation
  res.clearCookie("otp"); // Supprime le cookie OTP

  res.status(200).json({ message: "Utilisateur déconnecté avec succès." }); // Renvoie une réponse avec un message de succès
}

// Fonction pour changer le mot de passe de l'utilisateur
export async function changePassword(req: Request, res: Response): Promise<void> {
  const { oldPassword, newPassword } = req.body; // Récupère l'ancien et le nouveau mot de passe à partir du corps de la requête

  const authenticatedReq = req as AuthenticatedRequest; // Cast la requête à une requête authentifiée
  const userId = authenticatedReq.user.id; // Récupère l'ID de l'utilisateur à partir de la requête

  try {
    await authService.changePassword(userId, oldPassword, newPassword); // Change le mot de passe de l'utilisateur
    res.status(200).json({ message: "Mot de passe mis à jour avec succès." }); // Renvoie une réponse avec un message de succès
  } catch (error: any) {
    console.error("Erreur lors du changement de mot de passe:", error); // Affiche l'erreur dans la console
    res.status(400).json({ message: error.message }); // Renvoie une réponse avec un message d'erreur
  }
}

// Fonction pour vérifier si l'utilisateur est connecté
export async function isLog(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.authorizationToken; // Récupère le jeton d'autorisation du cookie

  if (token) {
    res.status(200).json({ message: "Déjà connecté" }); // Renvoie une réponse avec un message indiquant que l'utilisateur est déjà connecté
  } else {
    res.status(400).json({ message: "Accès refusé" }); // Renvoie une réponse avec un message d'erreur si l'utilisateur n'est pas connecté
  }

  // next();
}

// Fonction pour récupérer les informations de l'utilisateur
export function getUserInfo(req: AuthenticatedReq, res: Response): void {
  const userInfo = { // Crée un objet contenant les informations de l'utilisateur
    id: req.user.id,
    email: req.user.email,
    role: req.user.role,
  };
  res.status(200).json(userInfo); // Renvoie les informations de l'utilisateur
}
