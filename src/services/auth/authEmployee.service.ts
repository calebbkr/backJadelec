// Importation des modules nécessaires
import bcrypt from 'bcrypt'; 
import nodemailer from 'nodemailer'; 
import jwt from 'jsonwebtoken';
import Employee from '../../db/models/user/employee.model';

// Récupération des clés secrètes et d'accès depuis les variables d'environnement
const secretKey = process.env.SECRETKEY ?? ""; // Clé secrète pour la génération des jetons d'authentification
const userKey = process.env.MAIL_GUN_USER_KEY ?? ""; // Clé utilisateur pour l'envoi d'e-mails avec Mailgun
const passKey = process.env.MAIL_GUN_PASS_KEY ?? ""; // Clé de mot de passe pour l'envoi d'e-mails avec Mailgun

// Fonction pour créer un employé avec un rôle spécifié
export async function createEmployeeWithRole(name: string, email: string, password: string, roleId: number, createdBy: any): Promise<void> {
    // Vérification si un employé avec cet e-mail existe déjà
    const existingEmployee = await Employee.findOne({ where: { email } });
    if (existingEmployee) {
        throw new Error('Employee with this email already exists');
    }

    // Hachage du mot de passe avant de l'enregistrer dans la base de données
    const hashedPassword = await bcrypt.hash(password, 10);
    // Création de l'employé dans la base de données avec les détails fournis
    await Employee.create({ name, email, password: hashedPassword, roleId, createdBy });
}

// Fonction pour générer un code OTP (One-Time Password)
export function generateOtp(): string {
    return Math.random().toString().substr(2, 6); // Génère un code OTP de 6 chiffres
}

// Fonction pour envoyer un e-mail avec l'OTP
export async function sendOtpByEmail(email: string, otp: string): Promise<void> {
    const transporter = nodemailer.createTransport({
        host: 'smtp.mailgun.org',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: userKey, // Utilisation de la clé utilisateur pour l'authentification Mailgun
            pass: passKey // Utilisation de la clé de mot de passe pour l'authentification Mailgun
        }
    });

    // Envoi de l'e-mail avec l'OTP au destinataire spécifié
    await transporter.sendMail({
        from: '"Lenex.fr" <noreply@lenex.com>',
        to: email,
        subject: 'One-Time Password (OTP) for Login',
        text: `Your One-Time Password (OTP) for login is: ${otp}`
    });
}

// Fonction pour générer un jeton d'authentification
function generateAccessToken(user: any): string {
    return jwt.sign(user, secretKey, { expiresIn: 60 * 100 }); // Jeton expirant en 60 minutes
}

// Fonction pour authentifier un employé avec son e-mail et son mot de passe
export async function authenticateWithEmail(email: string, password: string): Promise<string> {
    // Recherche de l'employé dans la base de données par son e-mail
    const user: any = await Employee.findOne({ where: { email } });
    if (!user) throw new Error('Invalid email or password');

    // Vérification de la validité du mot de passe fourni
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) throw new Error('Invalid email or password');

    // Génération du jeton d'authentification pour l'employé
    const accessToken = generateAccessToken({ id: user.id, email: user.email });
    return accessToken;
}

// Fonction pour vérifier un OTP et générer un jeton d'authentification
export async function verifyOtp(email: string, otp: string, otptoken: any): Promise<string> {
    // Recherche de l'employé dans la base de données par son e-mail
    const user: any = await Employee.findOne({ where: { email } });

    // Vérification de la validité de l'OTP fourni
    const validOtp = await bcrypt.compare(otp, otptoken);

    if (!user || !validOtp) throw new Error('Invalid OTP');

    // Génération du jeton d'authentification pour l'employé
    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, secretKey, { expiresIn: 3600000 * 8 });
    return token;
}

// Fonction pour changer le mot de passe d'un employé
export async function changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void> {
    try {
        // Récupération de l'employé par son ID
        const user: any = await Employee.findByPk(userId);

        // Vérification de la correspondance du mot de passe actuel avec l'ancien mot de passe fourni
        const passwordMatch = await bcrypt.compare(oldPassword, user.password);
        if (!passwordMatch) {
            throw new Error('Incorrect old password.');
        }

        // Hachage du nouveau mot de passe et mise à jour dans la base de données
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await user.update({ password: hashedNewPassword });
    } catch (error: any) {
        throw new Error('Error changing password: ' + error.message);
    }
}

// Fonction pour récupérer tous les employés de la base de données
export async function getAllEmployees(): Promise<any[]> {
    return await Employee.findAll();
}

// Fonction pour récupérer un employé par son ID
export async function getEmployeeById(id: string): Promise<any | null> {
    return await Employee.findByPk(id);
}
