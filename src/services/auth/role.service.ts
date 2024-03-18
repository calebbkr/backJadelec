import Role from "../../db/models/user/roles.model";

export async function createRole(name: string): Promise<void> {
    await Role.create({ name });
}