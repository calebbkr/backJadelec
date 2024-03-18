# Documentation du Projet Jadelec Dashboard

Ce projet contient le code source du back-end pour le dashboard de l'entreprise Jadelec. Il est développé par Caleb BACKEKOLO.

## Structure des Fichiers

Le projet est organisé selon une structure modulaire, avec des répertoires pour chaque fonctionnalité principale :

```
src/
├── controllers/
│   ├── auth/
│   │   ├── authAdmin.controller.ts
│   │   ├── authClient.controller.ts
│   │   ├── authEmployee.controller.ts
│   │   ├── employeeGroup.controller.ts
│   │   ├── group.controller.ts
│   │   ├── permission.controller.ts
│   │   └── role.controller.ts
│   ├── file/
│   │   ├── file.controller.ts
│   │   ├── fileValidation.controller.ts
│   │   ├── folder.controller.ts
│   │   ├── image.controller.ts
│   │   ├── projet.controller.ts
│   │   └── repertoire.controller.ts
├── db/
│   ├── models/
│   │   ├── other/
│   │   │   ├── file.model.ts
│   │   │   ├── fileValidation.model.ts
│   │   │   ├── folders.model.ts
│   │   │   ├── image.model.ts
│   │   │   ├── projet.model.ts
│   │   │   └── repertoire.model.ts
│   │   └── user/
│   │       ├── admin.model.ts
│   │       ├── client.model.ts
│   │       ├── employee.model.ts
│   │       ├── employeeGroup.model.ts
│   │       ├── groups.model.ts
│   │       ├── permissions.model.ts
│   │       └── roles.model.ts
│   ├── associations.ts
│   ├── instance.ts
│   └── migrate.ts
├── middlewares/
│   ├── authMiddleware.ts
│   └── logMiddleware.ts
├── routes/
│   ├── auth/
│   │   ├── authAdmin.route.ts
│   │   ├── group.router.ts
│   │   ├── permission.router.ts
│   │   └── role.route.ts
│   ├── config/
│   │   └── multer.ts
│   └── file/
│       ├── file.router.ts
│       ├── fileValidation.router.ts
│       ├── folder.route.ts
│       ├── image.router.ts
│       ├── projet.router.ts
│       └── repertoire.router.ts
└── services/
    ├── auth/
    │   ├── authAdmin.service.ts
    │   ├── authClient.service.ts
    │   ├── authEmployee.service.ts
    │   ├── group.service.ts
    │   ├── permission.service.ts
    │   └── role.service.ts
    └── file/
        ├── file.service.ts
        ├── fileValidation.service.ts
        ├── folder.service.ts
        ├── image.service.ts
        └── repertoire.service.ts
```

## Composants Principaux

- **Controllers:** Ces fichiers sont responsables de la logique métier de l'application. Ils reçoivent les requêtes HTTP, effectuent les opérations nécessaires à leur traitement et renvoient les réponses appropriées.

- **Routes:** Les routes définissent les points d'entrée de l'API. Ils lient les requêtes HTTP aux fonctions des contrôleurs.

- **Services:** Ces modules fournissent des fonctionnalités réutilisables pour les contrôleurs. Ils encapsulent la logique métier qui peut être partagée entre plusieurs contrôleurs.

- **Middlewares:** Les middlewares sont des fonctions intermédiaires qui ont accès à l'objet de requête (req), à l'objet de réponse (res) et à la fonction middleware suivante dans le cycle de demande-réponse de l'application. Ils sont utilisés pour effectuer des opérations transversales telles que l'authentification, la gestion des journaux, etc.

- **Modèles de Base de Données:** Ces fichiers définissent les modèles de données utilisés par l'application. Ils définissent la structure et les relations entre les données stockées dans la base de données.

## Configuration et Utilisation

### Prérequis

Assurez-vous d'avoir Node.js et npm installés sur votre machine.

### Installation

1. Clonez le dépôt depuis GitHub.
2. Exécutez `npm install` pour installer les dépendances.

### Scripts NPM

- `npm run compile`: Compile les fichiers TypeScript en JavaScript.
- `npm run dev`: Lance le serveur de développement avec nodemon.
- `npm start`: Lance le serveur en production.
- `npm run migrate`: Exécute les migrations de base de données.

## Dépendances Principales

- **Express:** Framework web minimaliste pour Node.js.
- **Sequelize:** ORM pour Node.js qui prend en charge plusieurs bases de données relationnelles.
- **bcrypt:** Bibliothèque de hachage de mots de passe.
- **jsonwebtoken:** Implémente la génération et la vérification de JSON Web Tokens (JWT).
- **multer:** Middleware pour la gestion des fichiers multipart/form-data.
- **dotenv:** Charge les variables d'environnement à partir d'un fichier `.env`.

Pour plus de détails sur les dépendances, consultez le fichier `package.json`.

## Licence

Ce projet est sous licence ISC. Veuillez consulter le fichier `LICENSE` pour plus d'informations.

---

Cette documentation fournit une vue d'ensemble du projet Jadelec Dashboard et de sa structure de fichiers. Pour plus d'informations sur chaque composant, veuillez consulter le code source correspondant dans le répertoire `src`.
