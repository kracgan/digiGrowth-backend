import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import { User } from "../../models/User.model";
import { Organization } from "../../models/Organization.model";
import { Membership } from "../../models/Membership.model";
import { Goal } from "../../models/Goal.model";
import { hashPassword, comparePassword } from "../../utils/hash";
import { generateTokens, verifyRefreshToken } from "../../utils/jwt";
import { ApiError } from "../../utils/ApiError";
import { ApiResponse } from "../../utils/ApiResponse";
import { logAuditEvent } from "../../utils/audit";
import { USER_ROLES } from "../../config/constants";
import { ENV } from "../../config/env";

const setAuthCookies = (
  res: Response,
  accessToken: string,
  refreshToken: string
) => {
  const isProd = ENV.NODE_ENV === "production";

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

const clearAuthCookies = (res: Response) => {
  const isProd = ENV.NODE_ENV === "production";
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
  });
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const {
      name,
      email,
      password,
      businessName,
      category,
      serviceArea,
      primaryGoal,
      primaryChannel,
    } = req.body;

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      throw ApiError.conflict(
        "An account with this email address already exists. Please log in."
      );
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await User.create({
      name,
      email: normalizedEmail,
      passwordHash: hashedPassword,
      status: "active",
    });

    const newOrg = await Organization.create({
      name: businessName,
      category: category || "Retail & Boutique",
      serviceArea: serviceArea || "",
      primaryGoal: primaryGoal || "Get more customer enquiries",
      primaryChannel: primaryChannel || "Instagram",
      ownerUserId: newUser._id,
      status: "active",
    });

    const newMembership = await Membership.create({
      organizationId: newOrg._id,
      userId: newUser._id,
      role: USER_ROLES.OWNER,
      status: "active",
    });

    // Seed initial goals for this organization
    await Goal.create({
      organizationId: newOrg._id,
      period: "monthly",
      followersTarget: 1000,
      enquiriesTarget: 40,
      reviewsTarget: 15,
    });

    const { accessToken, refreshToken } = generateTokens({
      userId: newUser._id.toString(),
      email: newUser.email,
      organizationId: newOrg._id.toString(),
      role: newMembership.role,
    });

    setAuthCookies(res, accessToken, refreshToken);

    await logAuditEvent({
      organizationId: newOrg._id,
      actorUserId: newUser._id,
      action: "REGISTER",
      targetType: "User",
      targetId: newUser._id.toString(),
      metadata: { businessName, email: normalizedEmail },
    });

    return ApiResponse.success(
      res,
      {
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
        },
        organization: {
          id: newOrg._id,
          name: newOrg.name,
          category: newOrg.category,
          primaryGoal: newOrg.primaryGoal,
          primaryChannel: newOrg.primaryChannel,
          role: newMembership.role,
        },
        accessToken,
      },
      "Account registered successfully",
      201
    );
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      throw ApiError.unauthorized("Invalid email or password.");
    }

    if (user.status === "suspended") {
      throw ApiError.forbidden(
        "Your account has been suspended. Please contact support."
      );
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      throw ApiError.unauthorized("Invalid email or password.");
    }

    // Find active membership and organization
    const membership = await Membership.findOne({
      userId: user._id,
      status: "active",
    }).populate("organizationId");

    if (!membership || !membership.organizationId) {
      throw ApiError.notFound("No active business workspace found for this account.");
    }

    const org = membership.organizationId as any;

    const { accessToken, refreshToken } = generateTokens({
      userId: user._id.toString(),
      email: user.email,
      organizationId: org._id.toString(),
      role: membership.role,
    });

    setAuthCookies(res, accessToken, refreshToken);

    await logAuditEvent({
      organizationId: org._id,
      actorUserId: user._id,
      action: "LOGIN",
      targetType: "User",
      targetId: user._id.toString(),
    });

    return ApiResponse.success(
      res,
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
        organization: {
          id: org._id,
          name: org.name,
          category: org.category,
          primaryGoal: org.primaryGoal,
          primaryChannel: org.primaryChannel,
          role: membership.role,
        },
        accessToken,
      },
      "Logged in successfully"
    );
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    clearAuthCookies(res);
    return ApiResponse.success(res, null, "Logged out successfully");
  } catch (error) {
    next(error);
  }
};

export const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) {
      throw ApiError.unauthorized("No refresh token provided.");
    }

    const decoded = verifyRefreshToken(token);
    const user = await User.findById(decoded.userId);
    if (!user || user.status === "suspended") {
      clearAuthCookies(res);
      throw ApiError.unauthorized("User account invalid or suspended.");
    }

    const membership = await Membership.findOne({
      userId: user._id,
      status: "active",
    });

    if (!membership) {
      clearAuthCookies(res);
      throw ApiError.unauthorized("No active organization membership.");
    }

    const tokens = generateTokens({
      userId: user._id.toString(),
      email: user.email,
      organizationId: membership.organizationId.toString(),
      role: membership.role,
    });

    setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

    return ApiResponse.success(
      res,
      { accessToken: tokens.accessToken },
      "Session refreshed"
    );
  } catch (error) {
    next(error);
  }
};

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const userId = req.user?.userId;
    const user = await User.findById(userId).select("-passwordHash");
    if (!user) {
      throw ApiError.notFound("User not found");
    }

    const membership = await Membership.findOne({
      userId: user._id,
      status: "active",
    }).populate("organizationId");

    const org = membership?.organizationId as any;

    return ApiResponse.success(
      res,
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          status: user.status,
        },
        organization: org
          ? {
              id: org._id,
              name: org.name,
              category: org.category,
              serviceArea: org.serviceArea,
              primaryGoal: org.primaryGoal,
              primaryChannel: org.primaryChannel,
              role: membership?.role,
            }
          : null,
      },
      "Current session profile"
    );
  } catch (error) {
    next(error);
  }
};

export const updateMe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const userId = req.user?.userId;
    const { name } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { ...(name && { name }) },
      { new: true }
    ).select("-passwordHash");

    return ApiResponse.success(res, user, "Profile updated successfully");
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      // Security standard: don't reveal if email doesn't exist
      return ApiResponse.success(
        res,
        null,
        "If that email is registered, password reset instructions have been generated."
      );
    }

    const resetToken = crypto.randomBytes(24).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    console.log(`[PASSWORD RESET TOKEN for ${user.email}]: ${resetToken}`);

    // Return token in response for MVP per decision "no email service"
    return ApiResponse.success(
      res,
      { resetToken },
      "Password reset token generated. (For MVP: displayed directly here and logged to console)."
    );
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { token, password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      throw ApiError.badRequest(
        "Invalid or expired password reset token. Please request a new one."
      );
    }

    user.passwordHash = await hashPassword(password);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return ApiResponse.success(
      res,
      null,
      "Password has been reset successfully. You can now log in with your new password."
    );
  } catch (error) {
    next(error);
  }
};
