// Importe la connexion sequelize depuis l'instance
import { sequelize } from "./instance";
// Importe les modèles de la base de données
import Role from "./models/user/roles.model";
import User from "./models/user/admin.model";
import "./associations";
import Permission from "./models/user/permissions.model";
import Folder from "./models/other/folders.model";
import Group from "./models/user/groups.model";
import File from "./models/other/file.model";
import Image from "./models/other/image.model";
import Admin from "./models/user/admin.model";
import Client from "./models/user/client.model";
import Employee from "./models/user/employee.model";
import Projet from "./models/other/projet.model";
import EmployeeGroup from "./models/user/employeeGroup.model";
import Repertoire from "./models/other/repertoire.model";
import FileValidation from "./models/other/fileValidation.model";

// Fonction asynchrone pour établir la connexion à la base de données
async function connect() {
  try {
    // Authentification à la base de données
    await sequelize.authenticate();
    console.log("La connexion à la base de données a été établie avec succès.");
  } catch (error) {
    console.error("Impossible de se connecter à la base de données:", error);
  }
}

// Fonction asynchrone pour effectuer les migrations de la base de données
async function migrate() {
  // Synchronisation des tables des différents modèles avec l'option 'force: true'
  // Cela supprimera et recréera les tables si elles existent déjà
  await Role.sync({ force: true });
  console.log("La table pour le modèle Role vient d'être créée!");

  await Admin.sync({ force: true });
  console.log("La table pour le modèle Admin vient d'être créée!");

  await Client.sync({ force: true });
  console.log("La table pour le modèle Client vient d'être créée!");

  await Employee.sync({ force: true });
  console.log("La table pour le modèle Employee vient d'être créée!");

  await Projet.sync({ force: true });
  console.log("La table pour le modèle Projet vient d'être créée!");

  await Folder.sync({ force: true });
  console.log("La table pour le modèle Folder vient d'être créée!");

  await Group.sync({ force: true });
  console.log("La table pour le modèle Group vient d'être créée!");

  await Permission.sync({ force: true });
  console.log("La table pour le modèle Permission vient d'être créée!");

  await File.sync({ force: true });
  console.log("La table pour le modèle File vient d'être créée!");

  await Image.sync({ force: true });
  console.log("La table pour le modèle Image vient d'être créée!");

  await EmployeeGroup.sync({ force: true });
  console.log("La table pour le modèle EmployeeGroup vient d'être créée!");

  await Repertoire.sync({ force: true });
  console.log("La table pour le modèle Repertoire vient d'être créée!");

  await FileValidation.sync({ force: true });
  console.log("La table pour le modèle FileValidation vient d'être créée!");
}

// Appelle la fonction de migration pour initialiser les tables de la base de données
migrate();

// Appelle la fonction de connexion pour établir la connexion à la base de données
connect();
