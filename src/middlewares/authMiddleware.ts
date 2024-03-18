import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../db/models/user/admin.model";
import Admin from "../db/models/user/admin.model";
import Employee from "../db/models/user/employee.model";
import Client from "../db/models/user/client.model";
const secretKey = process.env.SECRETKEY ?? ""; // Clé secrète pour signer les tokens JWT

// Interface pour une requête authentifiée
interface AuthenticatedReq extends Request {
  user?: any;
}

// Interface pour une requête authentifiée avec des informations sur l'utilisateur
interface AuthenticatedRequest extends Request {
  user: { id: string };
}

// Middleware pour vérifier le token JWT d'authentification
export async function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({ message: "Accès non autorisé." });
  }

  try {
    const decodedToken = jwt.verify(token, secretKey) as { email: string };

    (req as AuthenticatedReq).user = { email: decodedToken.email };
    next();
  } catch (error) {
    console.error("Erreur lors de la vérification du token:", error);
    return res.status(401).json({ message: "Token invalide ou expiré" });
  }
}

// Middleware pour vérifier si l'OTP est en cours
export async function isVerifyOtp(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.cookies.accessToken;

  if (token) {
    return res.status(401).json({ message: "OTP en cours" });
  }

  next();
}

// Middleware pour vérifier si l'utilisateur est déjà connecté
export async function isLog(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.authorizationToken;

  if (token) {
    return res.status(201).json({ message: "Déjà connecté" });
  }

  next();
}

// Middleware pour vérifier le token JWT d'authentification de l'utilisateur
export async function authenticateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authToken = req.cookies.authorizationToken;

  if (!authToken) {
    return res.status(401).json({ message: "Accès non autorisé." });
  }

  try {
    const decodedToken = jwt.verify(authToken, secretKey) as { id: string };

    (req as AuthenticatedRequest).user = { id: decodedToken.id };

    next();
  } catch (error) {
    console.error("Erreur lors de l'authentification de l'utilisateur:", error);
    return res
      .status(401)
      .json({ message: "Token d'autorisation invalide ou expiré" });
  }
}

// Middleware pour vérifier si l'utilisateur est un administrateur
export async function checkAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authenticatedReq = req as AuthenticatedRequest;

  const userId = authenticatedReq.user.id;

  try {
    const user: any = await User.findByPk(userId);

    if (!user) {
      return res
        .status(403)
        .json({ message: "Accès refusé : rôle d'administrateur requis" });
    }

    next();
  } catch (error) {
    console.error(
      "Erreur lors de la vérification du rôle d'administrateur:",
      error
    );
    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
}

// Middleware pour extraire les informations de l'utilisateur à partir du token JWT
export async function extractUserInfo(
  req: AuthenticatedReq,
  res: Response,
  next: NextFunction
) {
  const token = req.cookies.authorizationToken;

  if (!token) {
    return res.status(401).json({ message: "Token non fourni" });
  }

  try {
    const decoded = jwt.verify(token, secretKey) as {
      id: string;
      email: string;
    };

    const email = decoded.email;
    let role = "";

    const admin: any = await Admin.findOne({ where: { email } });
    if (admin) {
      role = "admin";
    } else {
      const employee: any = await Employee.findOne({ where: { email } });
      if (employee) {
        role = "employee";
      } else {
        const client: any = await Client.findOne({ where: { email } });
        if (client) {
          role = "client";
        } else {
          role = "";
        }
      }
    }

    req.user = { id: decoded.id, email: decoded.email, role };
    next();
  } catch (error) {
    console.error("Erreur lors du décodage du token:", error);
    return res.status(401).json({ message: "Token invalide" });
  }
}
