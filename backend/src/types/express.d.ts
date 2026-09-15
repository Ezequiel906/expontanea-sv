import type { user_role } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        role: user_role;
      };
    }
  }
}

export {};
