import { Request, Response } from "express";
import * as authService from "../../services/auth/authEmployee.service";
import bcrypt from "bcrypt";
interface AuthenticatedRequest extends Request {
  user: { id: string };
}

interface AuthenticatedReq extends Request {
  user?: any;
}

export async function register(req: Request, res: Response): Promise<any> {
  const { name, email, password, roleId, createdBy } = req.body;

  try {
    const MIN_PASSWORD_LENGTH = 8;

    if (password.length < MIN_PASSWORD_LENGTH) {
      return res.status(400).json({ message: `Le mot de passe doit contenir au moins ${MIN_PASSWORD_LENGTH} caractères` });
    }
    
    await authService.createEmployeeWithRole(
      name,
      email,
      password,
      roleId,
      createdBy
    );
    res.status(201).json({ message: "Employee created successfully" });
  } catch (error: any) {
    if (error.message === "Employee with this email already exists") {
      res
        .status(400)
        .json({ message: "Employee with this email already exists" });
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
    res.status(401).json({ message: "Erreur contacter le service Employee" });
  }

  try {
    const tokenEmployee = await authService.verifyOtp(email, otp, tokenotp);

    res.cookie("authorizationToken", tokenEmployee, {
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

  res.status(200).json({ message: "Employee logged out successfully." });
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

export function getEmployeeInfo(req: AuthenticatedReq, res: Response): void {
  const userInfo = {
    id: req.user.id,
    email: req.user.email,
    role: req.user.role
  };
  res.status(200).json(userInfo);
}

export async function getAllEmployeesController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const employees = await authService.getAllEmployees();
    res.status(200).json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getEmployeeByIdController(
  req: Request,
  res: Response
): Promise<void> {
  const { id } = req.params;
  try {
    const employee = await authService.getEmployeeById(id);
    if (employee) {
      res.status(200).json(employee);
    } else {
      res.status(404).json({ message: "Employee not found" });
    }
  } catch (error) {
    console.error("Error fetching employee:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
