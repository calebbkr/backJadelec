import multer from 'multer';
import path from 'path';

// Configurer multer pour stocker les fichiers sur le disque
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

// Créer l'instance multer avec la configuration de stockage
const upload = multer({ storage: storage });

export default upload;
