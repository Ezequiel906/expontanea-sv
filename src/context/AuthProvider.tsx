import { useEffect, useState } from "react";
import type { ReactNode } from "react";

import { AuthContext, type AuthUser } from "./authContext";

const LEGACY_TOKEN_STORAGE_KEY = "token";
const LEGACY_USER_STORAGE_KEY = "user";
const CUSTOMER_TOKEN_STORAGE_KEY = "customerToken";
const CUSTOMER_USER_STORAGE_KEY = "customerUser";
const ADMIN_TOKEN_STORAGE_KEY = "adminToken";
const ADMIN_USER_STORAGE_KEY = "adminUser";

interface AuthProviderProps {
  children: ReactNode;
}

interface AuthSession {
  token: string | null;
  user: AuthUser | null;
}

interface JwtPayload {
  exp?: number;
}

const getJwtPayload = (token: string): JwtPayload | null => {
  try {
    const payload = token.split(".")[1];

    if (!payload) {
      return null;
    }

    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padding = "=".repeat((4 - (base64.length % 4)) % 4);

    return JSON.parse(atob(base64 + padding)) as JwtPayload;
  } catch {
    return null;
  }
};

const isTokenExpired = (token: string) => {
  const payload = getJwtPayload(token);

  return Boolean(payload?.exp && payload.exp * 1000 <= Date.now());
};

const clearStoredAuth = (tokenKey: string, userKey: string) => {
  localStorage.removeItem(tokenKey);
  localStorage.removeItem(userKey);
};

const saveStoredAuth = (
  tokenKey: string,
  userKey: string,
  token: string,
  user: AuthUser,
) => {
  localStorage.setItem(tokenKey, token);
  localStorage.setItem(userKey, JSON.stringify(user));
};

const getStoredAuth = (tokenKey: string, userKey: string): AuthSession => {
  const savedToken = localStorage.getItem(tokenKey);
  const savedUser = localStorage.getItem(userKey);

  if (!savedToken || !savedUser || isTokenExpired(savedToken)) {
    clearStoredAuth(tokenKey, userKey);

    return {
      token: null,
      user: null,
    };
  }

  try {
    return {
      token: savedToken,
      user: JSON.parse(savedUser) as AuthUser,
    };
  } catch {
    clearStoredAuth(tokenKey, userKey);

    return {
      token: null,
      user: null,
    };
  }
};

const migrateLegacySession = () => {
  const legacyToken = localStorage.getItem(LEGACY_TOKEN_STORAGE_KEY);
  const legacyUser = localStorage.getItem(LEGACY_USER_STORAGE_KEY);

  if (!legacyToken || !legacyUser || isTokenExpired(legacyToken)) {
    clearStoredAuth(LEGACY_TOKEN_STORAGE_KEY, LEGACY_USER_STORAGE_KEY);
    return;
  }

  try {
    const parsedUser = JSON.parse(legacyUser) as AuthUser;

    if (parsedUser.role === "ADMIN") {
      saveStoredAuth(
        ADMIN_TOKEN_STORAGE_KEY,
        ADMIN_USER_STORAGE_KEY,
        legacyToken,
        parsedUser,
      );
    } else {
      saveStoredAuth(
        CUSTOMER_TOKEN_STORAGE_KEY,
        CUSTOMER_USER_STORAGE_KEY,
        legacyToken,
        parsedUser,
      );
    }
  } catch {
    // Ignore malformed legacy session and clear it below.
  }

  clearStoredAuth(LEGACY_TOKEN_STORAGE_KEY, LEGACY_USER_STORAGE_KEY);
};

function AuthProvider({ children }: AuthProviderProps) {
  migrateLegacySession();

  const [customerSession, setCustomerSession] = useState<AuthSession>(() =>
    getStoredAuth(CUSTOMER_TOKEN_STORAGE_KEY, CUSTOMER_USER_STORAGE_KEY),
  );
  const [adminSession, setAdminSession] = useState<AuthSession>(() =>
    getStoredAuth(ADMIN_TOKEN_STORAGE_KEY, ADMIN_USER_STORAGE_KEY),
  );

  const login = (newToken: string, newUser: AuthUser) => {
    if (newUser.role === "ADMIN") {
      setAdminSession({
        token: newToken,
        user: newUser,
      });

      saveStoredAuth(
        ADMIN_TOKEN_STORAGE_KEY,
        ADMIN_USER_STORAGE_KEY,
        newToken,
        newUser,
      );
      return;
    }

    setCustomerSession({
      token: newToken,
      user: newUser,
    });

    saveStoredAuth(
      CUSTOMER_TOKEN_STORAGE_KEY,
      CUSTOMER_USER_STORAGE_KEY,
      newToken,
      newUser,
    );
  };

  const logout = (role?: AuthUser["role"]) => {
    if (!role || role === "CUSTOMER") {
      setCustomerSession({
        token: null,
        user: null,
      });

      clearStoredAuth(CUSTOMER_TOKEN_STORAGE_KEY, CUSTOMER_USER_STORAGE_KEY);
    }

    if (!role || role === "ADMIN") {
      setAdminSession({
        token: null,
        user: null,
      });

      clearStoredAuth(ADMIN_TOKEN_STORAGE_KEY, ADMIN_USER_STORAGE_KEY);
    }
  };

  useEffect(() => {
    if (!customerSession.token) {
      return;
    }

    const payload = getJwtPayload(customerSession.token);

    if (!payload?.exp) {
      return;
    }

    const timeUntilExpiration = payload.exp * 1000 - Date.now();

    if (timeUntilExpiration <= 0) {
      logout("CUSTOMER");
      return;
    }

    const timeoutId = window.setTimeout(
      () => logout("CUSTOMER"),
      timeUntilExpiration,
    );

    return () => window.clearTimeout(timeoutId);
  }, [customerSession.token]);

  useEffect(() => {
    if (!adminSession.token) {
      return;
    }

    const payload = getJwtPayload(adminSession.token);

    if (!payload?.exp) {
      return;
    }

    const timeUntilExpiration = payload.exp * 1000 - Date.now();

    if (timeUntilExpiration <= 0) {
      logout("ADMIN");
      return;
    }

    const timeoutId = window.setTimeout(
      () => logout("ADMIN"),
      timeUntilExpiration,
    );

    return () => window.clearTimeout(timeoutId);
  }, [adminSession.token]);

  return (
    <AuthContext.Provider
      value={{
        token: adminSession.token,
        user: adminSession.user,
        customerToken: customerSession.token,
        customerUser: customerSession.user,
        adminToken: adminSession.token,
        adminUser: adminSession.user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
