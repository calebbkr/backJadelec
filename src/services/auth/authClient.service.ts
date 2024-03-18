// Importation des modules nécessaires
import bcrypt from "bcrypt"; // Module pour le hachage des mots de passe
import nodemailer from "nodemailer"; // Module pour l'envoi d'e-mails
import jwt from "jsonwebtoken"; // Module pour la génération de jetons d'authentification
import Client from "../../db/models/user/client.model"; // Modèle pour les clients
import Employee from "../../db/models/user/employee.model"; // Modèle pour les employés
import Admin from "../../db/models/user/admin.model"; // Modèle pour les administrateurs

const secretKey = process.env.SECRETKEY ?? ""; 
const userKey = process.env.MAIL_GUN_USER_KEY ?? ""; 
const passKey = process.env.MAIL_GUN_PASS_KEY ?? ""; 

// Fonction pour créer un client avec un rôle
export async function createClientWithRole(
  name: string,
  email: string,
  password: string
): Promise<void> {
  // Vérifier si un client avec cet e-mail existe déjà
  const existingClient = await Client.findOne({ where: { email } });
  if (existingClient) {
    throw new Error("Client with this email already exists");
  }

  // Hachage du mot de passe avant de l'enregistrer dans la base de données
  const hashedPassword = await bcrypt.hash(password, 10);
  // Création du client dans la base de données
  await Client.create({ name, email, password: hashedPassword });
}

// Fonction pour générer un code OTP (One-Time Password)
export function generateOtp(): string {
  return Math.random().toString().substr(2, 6); // Génère un code OTP de 6 chiffres
}

// Fonction pour envoyer un e-mail avec l'OTP
export async function sendOtpByEmail(
  email: string,
  otp: string
): Promise<void> {
  const transporter = nodemailer.createTransport({
    host: "smtp.mailgun.org",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: userKey,
      pass: passKey,
    },
  });

  // Envoi de l'e-mail avec l'OTP
  await transporter.sendMail({
    from: '"Lenex.fr" <noreply@lenex.com>',
    to: email,
    subject: "One-Time Password (OTP) for Login",
    text: `Your One-Time Password (OTP) for login is: ${otp}`,
  });
}

// Fonction pour générer un jeton d'authentification
function generateAccessToken(user: any): string {
  return jwt.sign(user, secretKey, { expiresIn: 60 * 100 }); // Jeton expirant en 60 minutes
}

// Fonction pour authentifier un utilisateur avec son e-mail et son mot de passe
export async function authenticateWithEmail(
  email: string,
  password: string
): Promise<string> {
  const user: any = await Client.findOne({ where: { email } });
  if (!user) throw new Error("Invalid email or password");

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) throw new Error("Invalid email or password");

  // Génération du jeton d'authentification pour l'utilisateur
  const accessToken = generateAccessToken({ id: user.id, email: user.email });
  return accessToken;
}

// Fonction pour vérifier un OTP et générer un jeton d'authentification
export async function verifyOtp(
  email: string,
  otp: string,
  otptoken: any
): Promise<string> {
  const user: any = await Client.findOne({ where: { email } });

  const validOtp = await bcrypt.compare(otp, otptoken);

  if (!user || !validOtp) throw new Error("Invalid OTP");

  // Génération du jeton d'authentification pour l'utilisateur
  const token = jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    secretKey,
    { expiresIn: 3600000 * 8 }
  );
  return token;
}

// Fonction pour changer le mot de passe d'un utilisateur
export async function changePassword(
  userId: string,
  oldPassword: string,
  newPassword: string
): Promise<void> {
  try {
    // Récupération de l'utilisateur par son ID
    const user: any = await Client.findByPk(userId);

    // Vérification si l'ancien mot de passe correspond au mot de passe actuel
    const passwordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!passwordMatch) {
      throw new Error("Incorrect old password.");
    }

    // Hachage du nouveau mot de passe et mise à jour dans la base de données
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashedNewPassword });
  } catch (error: any) {
    throw new Error("Error changing password: " + error.message);
  }
}

// Fonction pour récupérer tous les clients
export async function getAllClients(): Promise<any[]> {
  return await Client.findAll();
}

// Fonction pour récupérer un client par son ID
export async function getClientById(id: string): Promise<any | null> {
  return await Client.findByPk(id);
}

// Fonction pour récupérer le nom d'un client par son ID
export async function getClientNameById(
  clientId: string
): Promise<any | null> {
  const client: any = await Client.findByPk(clientId);
  if (!client) {
    throw new Error("Client not found");
  }

  const infos = {
    name: client.name,
    email: client.email,
  };
  return infos;
}

// Fonction pour récupérer le nom d'un utilisateur par son ID
export async function getNameById(id: string): Promise<string> {
  let name: string | null = null;

  // Recherche du client par son identifiant
  const client: any = await Client.findByPk(id);
  if (client) {
    name = client.name;
  } else {
    // Si le client n'est pas trouvé, recherche de l'employé
    const employee: any = await Employee.findByPk(id);
    if (employee) {
      name = employee.name;
    } else {
      // Si l'employé n'est pas trouvé, recherche de l'administrateur
      const admin: any = await Admin.findByPk(id);
      if (admin) {
        name = admin.name;
      } else {
        // Si aucune personne correspondante n'est trouvée, lance une erreur
        throw new Error(
          "Aucune personne ne correspond à l'identifiant spécifié"
        );
      }
    }
  }

  // Retourne le nom si trouvé, sinon lance une erreur
  if (name === null) {
    throw new Error("Aucun nom trouvé pour l'identifiant spécifié");
  } else {
    return name;
  }
}

// Fonction pour récupérer un utilisateur par son ID et retourner son type (client, employé, admin)
export async function getUserById(id: string): Promise<any> {
  let user: any = null;

  // Recherche de l'utilisateur par son identifiant
  user = await Client.findByPk(id);
  if (user) {
    return "client";
  }

  user = await Employee.findByPk(id);
  if (user) {
    return "employee";
  }

  user = await Admin.findByPk(id);
  if (user) {
    return "admin";
  }

  // Si aucune personne correspondante n'est trouvée, lance une erreur
  throw new Error("Aucune personne ne correspond à l'identifiant spécifié");
}

// Fonction pour supprimer un client par son ID
export async function deleteClientById(clientId: string): Promise<void> {
  // Recherche du client par son identifiant
  const client = await Client.findByPk(clientId);

  // Vérifie si le client existe
  if (!client) {
    throw new Error("Client not found");
  }

  // Supprimer le client
  await client.destroy();
}
