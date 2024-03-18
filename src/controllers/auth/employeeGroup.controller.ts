import { Request, Response } from "express";
import EmployeeGroup from "../../db/models/user/employeeGroup.model";
import Employee from "../../db/models/user/employee.model";
import Group from "../../db/models/user/groups.model";

export async function EmployeeGroupController(req: Request, res: Response) {
    const employeeGroupData = req.body; // Attend un tableau d'objets représentant les associations entre les employés et le groupe
  
    try {
      const existingEmployeeGroups = await EmployeeGroup.findAll({ where: employeeGroupData });
  
      // Vérifiez si des associations existent déjà pour les mêmes employés et groupe
      if (existingEmployeeGroups.length > 0) {
        return res.status(400).json({ message: "Employees are already assigned to the group" });
      }
  
      // Utilisez la méthode bulkCreate pour insérer plusieurs associations d'employés et de groupes en une seule opération
      const employeeGroups = await EmployeeGroup.bulkCreate(employeeGroupData);
  
      res.status(200).json({
        message: "Employees assigned to group successfully:",
        employeeGroups,
      });
    } catch (error) {
      res.status(400).json({ message: "Error assigning employees to group:", error });
      console.error("Error assigning employees to group:", error);
    }
}

export async function getEmployeesByGroupId(req: Request, res: Response) {
    const { groupId } = req.body;
    try {
      // Récupérez les `employeeId` associés au groupe spécifié à partir de la table EmployeeGroup
      const employeeIds = await EmployeeGroup.findAll({
        where: { groupId },
        attributes: ['employeeId'], // Sélectionnez uniquement les `employeeId`
      });
  
      // Extrayez les `employeeId` du résultat sous forme de tableau
      const ids = employeeIds.map((empId: any) => empId.employeeId);
  
      // Récupérez toutes les informations des employés correspondant aux `employeeId` trouvés
      const employeesInfo = await Employee.findAll({
        where: { id: ids }, // Filtrez par les `employeeId` trouvés
      });
  
      res.status(200).json({
        message: "Success",
        employeesInfo,
      });
    } catch (error) {
      res.status(400).json({ message: "Error fetching employees info by group ID:", error });
      console.error("Error fetching employees info by group ID:", error);
    }
  }

export async function removeUserFromGroup(req: Request, res: Response) {
    const {employeeId, groupId} = req.body
    try {
        const deletedRows = await EmployeeGroup.destroy({
            where: {
                employeeId: employeeId,
                groupId: groupId
            }
        });
        if (deletedRows > 0) {
            res.status(200).json({message: 'User removed from group successfully'})
        } else {
            res.status(400).json({message: 'User not found in group or already removed'})
        }
    } catch (error) {
        res.status(404).json({mesage : 'Error removing user from group:'})
        console.error('Error removing user from group:', error);
    }
}

export async function getGroupIdByEmployeeId(req: Request, res: Response): Promise<void> {
  const { employeeId } = req.params; // Récupérez l'employeeId de la requête

  try {
    // Recherchez toutes les entrées dans la table EmployeeGroup où l'ID de l'employé correspond
    const employeeGroupEntries = await EmployeeGroup.findAll({
      where: { employeeId },
      attributes: ['groupId'], // Sélectionnez uniquement l'attribut groupId
    });

    // Si aucune entrée n'est trouvée, retournez un message indiquant que l'employé n'est pas associé à un groupe
    if (employeeGroupEntries.length === 0) {
      res.status(404).json({ message: "Employee is not associated with any group" });
      return;
    }

    // Extraire les IDs de groupe associés à l'employé
    const groupIds = employeeGroupEntries.map((entry: any) => entry.groupId);
    res.status(200).json({ groupIds });
  } catch (error) {
    console.error("Error fetching group IDs by employee ID:", error);
    res.status(500).json({ message: "Error fetching group IDs by employee ID" });
  }
}