
import { Request, Response } from 'express';
import * as authService from '../../services/auth/role.service';
import Role from '../../db/models/user/roles.model';

export async function createRole(req: Request, res: Response): Promise<void> {
    const { name } = req.body;

    try {
        await authService.createRole(name);
        res.status(201).json({ message: 'Role created successfully' });
    } catch (error) {
        console.error('Error creating role:', error);
        res.status(500).json({ message: 'Error creating role' });
    }
}

export async function getAllRoles(req: Request, res: Response): Promise<void> {
    try {
        const roles = await Role.findAll();
        res.status(200).json(roles);
    } catch (error) {
        console.error('Error fetching roles:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}