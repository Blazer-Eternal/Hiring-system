import { Response } from "express";
import { CustomRequestInterface } from "../../interfaces";
import { RoleEnum } from "../../enums/roleEnum";
import Models from "../../models";

export class UserController {
  // Admin: get all users
  static async getAllUsers(req: CustomRequestInterface, res: Response) {
    try {
      const users = await Models.Users.findAll({
        attributes: ['id', 'firstName', 'lastName', 'email', 'role'],
        order: [['id', 'ASC']],
      });
      return res.status(200).json({ success: true, data: users });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  // Admin: assign role to a user (user → recruiter, recruiter → user, etc.)
  static async assignRole(req: CustomRequestInterface, res: Response) {
    const { id } = req.params;
    const { role } = req.body;
    try {
      if (!Object.values(RoleEnum).includes(role)) {
        return res.status(400).json({ success: false, message: `Invalid role. Must be one of: ${Object.values(RoleEnum).join(', ')}` });
      }
      const user = await Models.Users.findByPk(Number(id));
      if (!user) return res.status(404).json({ success: false, message: "User not found" });

      await Models.Users.update({ role }, { where: { id: Number(id) } });

      return res.status(200).json({
        success: true,
        message: `Role updated to '${role}' successfully`,
        data: { id: Number(id), role },
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  // Admin: delete a user
  static async deleteUser(req: CustomRequestInterface, res: Response) {
    const { id } = req.params;
    try {
      const user = await Models.Users.findByPk(Number(id));
      if (!user) return res.status(404).json({ success: false, message: "User not found" });
      await Models.Users.destroy({ where: { id: Number(id) } });
      return res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }
}
