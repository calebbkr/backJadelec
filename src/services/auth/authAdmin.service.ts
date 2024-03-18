// Importation des modules nécessaires
import bcrypt from 'bcrypt'; 
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken'; 
import User from '../../db/models/user/admin.model'; 
const secretKey = process.env.SECRETKEY ?? ""; 
const userKey = process.env.MAIL_GUN_USER_KEY ?? ""; 
const passKey = process.env.MAIL_GUN_PASS_KEY ?? ""; 

console.log("credent user" + userKey)
console.log("credent pass" + passKey)

// Fonction pour créer un utilisateur avec un rôle
export async function createUserWithRole(name: string, email: string, code: any, password: string): Promise<void> {
    // Vérifier si un utilisateur avec cet e-mail existe déjà
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
        throw new Error('User with this email already exists');
    }

    // Hachage du mot de passe avant de l'enregistrer dans la base de données
    const hashedPassword = await bcrypt.hash(password, 10);
    // Création de l'utilisateur dans la base de données
    await User.create({ name, email, code, password: hashedPassword });
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
            user: userKey,
            pass: passKey,
        }
    });

    // Envoi de l'e-mail avec l'OTP
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

// Fonction pour authentifier un utilisateur avec son e-mail et son mot de passe
export async function authenticateWithEmail(email: string, password: string): Promise<string> {
    const user: any = await User.findOne({ where: { email } });
    if (!user) throw new Error('email ou mot de passe invalide');

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) throw new Error('email ou mot de passe invalide');

    // Génération du jeton d'authentification pour l'utilisateur
    const accessToken = generateAccessToken({ id: user.id, email: user.email });
    return accessToken;
}

// Fonction pour vérifier un OTP et générer un jeton d'authentification
export async function verifyOtp(email: string, otp: string, otptoken: any): Promise<string> {
    const user: any = await User.findOne({ where: { email } });

    const validOtp = await bcrypt.compare(otp, otptoken);

    if (!user || !validOtp) throw new Error('Invalide OTP');

    // Génération du jeton d'authentification pour l'utilisateur
    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, secretKey, { expiresIn: 3600000 * 8 }); // Jeton expirant en 8 heures
    return token;
}

// Fonction pour changer le mot de passe d'un utilisateur
export async function changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void> {
    try {
        // Récupération de l'utilisateur par son ID
        const user: any = await User.findByPk(userId);

        // Vérification si l'ancien mot de passe correspond au mot de passe actuel
        const passwordMatch = await bcrypt.compare(oldPassword, user.password);
        if (!passwordMatch) {
            throw new Error('Ancien mot de passe incorrect.');
        }

        // Hachage du nouveau mot de passe et mise à jour dans la base de données
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await user.update({ password: hashedNewPassword });
    } catch (error: any) {
        throw new Error('Error changing password: ' + error.message);
    }
}
