import { Sequelize } from "sequelize";
import dotenv from "dotenv";

// Charge les variables d'environnement depuis un fichier .env
dotenv.config();

// Récupère les valeurs des variables d'environnement pour la connexion à la base de données
const user = process.env.USER_DATABASE ?? ""; // Nom d'utilisateur de la base de données
const database = process.env.NAME_DATABASE ?? ""; // Nom de la base de données
const pwd = process.env.PWD_DATABASE ?? ""; // Mot de passe de la base de données

// Vérifie si les variables d'environnement nécessaires sont définies
if (!user || !database || !pwd) {
    throw new Error("Les variables d'environnement ne sont pas correctement définies.");
}

// Crée une instance Sequelize pour la connexion à la base de données
export const sequelize = new Sequelize(database, user, pwd, {
    host: "localhost", // Hôte de la base de données
    dialect: "postgres", // Dialecte de la base de données (dans ce cas, PostgreSQL)
});
