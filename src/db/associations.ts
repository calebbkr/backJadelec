// Importe les modèles de la base de données
import Folder from "./models/other/folders.model";
import Group from "./models/user/groups.model";
import Permission from "./models/user/permissions.model";
import Role from "./models/user/roles.model";
import File from "./models/other/file.model";
import Admin from "./models/user/admin.model";
import Client from "./models/user/client.model";
import Employee from "./models/user/employee.model";
import Projet from "./models/other/projet.model";
import EmployeeGroup from "./models/user/employeeGroup.model";
import Repertoire from "./models/other/repertoire.model";
import FileValidation from "./models/other/fileValidation.model";

// Associations entre les modèles de la base de données
Employee.belongsTo(Role, { foreignKey: "roleId" });
Role.hasMany(Employee, { foreignKey: "roleId" });

Folder.hasMany(Permission, { foreignKey: "folderId" });
Folder.belongsTo(Admin, { foreignKey: "createdBy", as: "creator" });

Group.hasMany(Permission, { foreignKey: "groupId" });
Group.belongsToMany(Employee, { through: "GroupUser", foreignKey: "groupId" });

Permission.belongsTo(Folder, { foreignKey: "folderId" });
Permission.belongsTo(Group, { foreignKey: "groupId" });

File.belongsTo(Employee, { foreignKey: "createdBy", constraints: false });
File.belongsTo(Client, { foreignKey: "createdBy", constraints: false });
File.belongsTo(Admin, { foreignKey: "createdBy", constraints: false });
File.belongsTo(Folder, { foreignKey: "folderId", as: "folder", constraints: false });
File.belongsTo(Repertoire, { foreignKey: "folderId", as: "repertoire", constraints: false });

Admin.hasMany(Client, { foreignKey: "createdBy" });
Client.belongsTo(Admin, { foreignKey: "createdBy" });

Admin.hasMany(Employee, { foreignKey: "createdBy" });
Employee.belongsTo(Admin, { foreignKey: "createdBy" });

Admin.hasMany(Projet, { foreignKey: "adminId" });
Projet.belongsTo(Admin, { foreignKey: "adminId" });

Projet.belongsTo(Client, { foreignKey: "clientId" });
Client.hasMany(Projet, { foreignKey: "clientId" });

Projet.hasMany(Folder, { foreignKey: "projectId" });
Folder.belongsTo(Projet, { foreignKey: "projectId" });

Employee.belongsToMany(Group, { through: "EmployeeGroup", foreignKey: "employeeId" });
Employee.hasMany(EmployeeGroup, { foreignKey: "employeeId" });
Group.belongsToMany(Employee, { through: "EmployeeGroup", foreignKey: "groupId" });
EmployeeGroup.belongsTo(Employee, { foreignKey: "employeeId" });

Repertoire.hasMany(Repertoire, { as: "subRepertoires", foreignKey: "parentId" });
Repertoire.belongsTo(Repertoire, { as: "parentRepertoire", foreignKey: "parentId" });
Repertoire.belongsTo(Folder, { as: "parentFolder", foreignKey: "folderId" });
Repertoire.belongsTo(Employee, { foreignKey: "createdBy", constraints: false });
Repertoire.belongsTo(Client, { foreignKey: "createdBy", constraints: false });
Repertoire.belongsTo(Admin, { foreignKey: "createdBy", constraints: false });

FileValidation.belongsTo(File, { foreignKey: "fileId", onDelete: "CASCADE" });
File.hasMany(FileValidation, { foreignKey: "fileId" });

FileValidation.belongsTo(Employee, { as: "requesterEmployee", foreignKey: "requestedBy", constraints: false });
Employee.hasMany(FileValidation, { as: "requestedValidationsEmployee", foreignKey: "requestedBy", constraints: false });

FileValidation.belongsTo(Admin, { as: "requesterAdmin", foreignKey: "requestedBy", constraints: false });
Admin.hasMany(FileValidation, { as: "requestedValidationsAdmin", foreignKey: "requestedBy", constraints: false });

FileValidation.belongsTo(Client, { as: "validator", foreignKey: "validatedBy" });
Client.hasMany(FileValidation, { as: "validatedValidations", foreignKey: "validatedBy" });
