import jwt from "jsonwebtoken";
import { ENV } from "../config/env";

export interface ITokenPayload {
  userId: string;
  email: string;
  organizationId: string;
  role: string;
}

export const generateTokens = (payload: ITokenPayload) => {
  const accessToken = jwt.sign(payload, ENV.JWT_ACCESS_SECRET, {
    expiresIn: ENV.JWT_ACCESS_EXPIRY as any,
  });

  const refreshToken = jwt.sign(payload, ENV.JWT_REFRESH_SECRET, {
    expiresIn: ENV.JWT_REFRESH_EXPIRY as any,
  });

  return { accessToken, refreshToken };
};

export const verifyAccessToken = (token: string): ITokenPayload => {
  return jwt.verify(token, ENV.JWT_ACCESS_SECRET) as ITokenPayload;
};

export const verifyRefreshToken = (token: string): ITokenPayload => {
  return jwt.verify(token, ENV.JWT_REFRESH_SECRET) as ITokenPayload;
};
