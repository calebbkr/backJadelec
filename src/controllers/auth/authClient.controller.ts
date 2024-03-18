import { Request, Response } from "express";
import * as authService from "../../services/auth/authClient.service";
import bcrypt from "bcrypt";
import { deleteClientById } from "../../services/auth/authClient.service";
interface AuthenticatedRequest extends Request {
  user: { id: string };
}

interface AuthenticatedReq extends Request {
  user?: any;
}

export async function register(req: Request, res: Response): Promise<any> {
  const { name, email, password } = req.body;

  try {

    const MIN_PASSWORD_LENGTH = 8;

    if (password.length < MIN_PASSWORD_LENGTH) {
      return res.status(400).json({ message: `Le mot de passe doit contenir au moins ${MIN_PASSWORD_LENGTH} caractères` });
    }

    await authService.createClientWithRole(name, email, password);
    res.status(201).json({ message: "Client created successfully" });
  } catch (error: any) {
    if (error.message === "Client with this email already exists") {
      res
        .status(400)
        .json({ message: "Client with this email already exists" });
    } else {
      console.error("Error creating user:", error);
      res.status(500).json({ message: "Error creating user" });
    }
  }
}

export async function loginWithEmail(
  req: Request,
  res: Response
): Promise<void> {
  const { email, password } = req.body;

  try {
    const token = await authService.authenticateWithEmail(email, password);

    res.cookie("accessToken", token, { httpOnly: true, maxAge: 60 * 1000 });

    const otp = authService.generateOtp();

    const hashedOtp = await bcrypt.hash(otp, 10);

    res.cookie("otp", hashedOtp, {
      httpOnly: true,
      maxAge: 60 * 1000,
    });

    await authService.sendOtpByEmail(email, otp);

    res.status(200).json({
      message: "Authentification réussie",
    });
  } catch (error: any) {
    console.error("Erreur lors de la connexion avec l'e-mail:", error);
    res.status(401).json({ message: error.message });
  }
}

export async function verifyOtp(
  req: AuthenticatedReq,
  res: Response
): Promise<void> {
  const { otp } = req.body;
  const email = req.user.email;

  const tokenotp = req.cookies.otp;

  if (!tokenotp) {
    res.status(401).json({ message: "Erreur contacter le service client" });
  }

  try {
    const tokenClient = await authService.verifyOtp(email, otp, tokenotp);

    res.cookie("authorizationToken", tokenClient, {
      httpOnly: true,
      maxAge: 3600000 * 8,
    });

    res.status(200).json({ message: "Success" });
  } catch (error: any) {
    console.error("Error verifying OTP:", error);
    res.status(401).json({ message: error.message });
  }
}

export function logout(req: Request, res: Response): void {
  res.clearCookie("accessToken");
  res.clearCookie("authorizationToken");
  res.clearCookie("otp");

  res.status(200).json({ message: "Client logged out successfully." });
}

export async function changePassword(
  req: Request,
  res: Response
): Promise<void> {
  const { oldPassword, newPassword } = req.body;

  const authenticatedReq = req as AuthenticatedRequest;

  const userId = authenticatedReq.user.id;

  try {
    await authService.changePassword(userId, oldPassword, newPassword);
    res.status(200).json({ message: "Password updated successfully." });
  } catch (error: any) {
    console.error("Error changing password:", error);
    res.status(400).json({ message: error.message });
  }
}

export function getClientInfo(req: AuthenticatedReq, res: Response): void {
  const userInfo = {
    id: req.user.id,
    email: req.user.email,
  };
  res.status(200).json(userInfo);
}

export async function getAllClientsController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const Clients = await authService.getAllClients();
    res.status(200).json(Clients);
  } catch (error) {
    console.error("Error fetching Clients:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getClientByIdController(
  req: Request,
  res: Response
): Promise<void> {
  const { id } = req.params;
  try {
    const Client = await authService.getClientById(id);
    if (Client) {
      res.status(200).json(Client);
    } else {
      res.status(404).json({ message: "Client not found" });
    }
  } catch (error) {
    console.error("Error fetching Client:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getClientNameByIdController(req: Request, res: Response): Promise<void> {
  const { clientId } = req.params; 

  try {
      const client = await authService.getClientNameById(clientId);
      res.status(200).json({ client });
  } catch (error: any) {
      res.status(404).json({ message: error.message });
  }
}

export async function getNameByIdController(req: Request, res: Response): Promise<void> {
  const { id } = req.params; 

  try {
      const name = await authService.getNameById(id);
      res.status(200).json({ name });
  } catch (error: any) {
      res.status(404).json({ message: error.message });
  }
}

export async function getUserByIdController(req: Request, res: Response): Promise<void> {
  const { id } = req.params; 

  try {
      const name = await authService.getUserById(id);
      res.status(200).json({ name });
  } catch (error: any) {
      res.status(404).json({ message: error.message });
  }
}

export const deleteClient = async (req: Request, res: Response): Promise<void> => {
  const clientId: string = req.params.id;

  try {
      await deleteClientById(clientId);
      res.status(200).json({ message: 'Client supprimé avec succès' });
  } catch (error: any) {
      res.status(500).json({ message: 'Erreur lors de la suppression du client', error: error.message });
  }
};