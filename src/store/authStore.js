import { create } from "zustand";
import { persist } from "zustand/middleware";
import authApi from "@/services/authApi";

export const useAuthStore = create(
   persist(
      (set, get) => ({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        
        login: async (loginData) => {
          // 1. Store tokens immediately so the /me request is authenticated
          set({
            accessToken: loginData.accessToken,
            refreshToken: loginData.refreshToken,
            isAuthenticated: true,
            user: {
              id: loginData.userId,
              firstName: loginData.firstName,
              lastName: loginData.lastName,
              role: loginData.role,
              status: loginData.status,
              roleEntityId: loginData.roleEntityId,
              firstLogin: loginData.firstLogin,
            },
          });
          
          // 2. Fetch full profile including schoolId
          try {
            const res = await authApi.me();
            set((state) => ({
              user: { ...state.user, ...res.data.data },
            }));
          } catch (err) {
            console.warn("Could not fetch /auth/me:", err.message);
          }
        },
        
        setTokens: (accessToken, refreshToken) => {
          set({ accessToken, refreshToken });
        },
        
        logout: () => {
          set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
        },
      }),
      {
        name: "skooly-auth",
        partialize: (state) => ({
          user: state.user,
          accessToken: state.accessToken,
          refreshToken: state.refreshToken,
          isAuthenticated: state.isAuthenticated,
        }),
      }
   )
);