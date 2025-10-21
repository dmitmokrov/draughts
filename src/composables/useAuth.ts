import { useAuthStore } from '@/stores/auth';

export function useAuth() {
  const authStore = useAuthStore();

  return {
    // State
    user: authStore.user,
    userData: authStore.userData,
    isLoading: authStore.isLoading,
    error: authStore.error,
    isAuthenticated: authStore.isAuthenticated,
    isTrainer: authStore.isTrainer,
    isStudent: authStore.isStudent,

    // Actions
    login: authStore.login,
    registerTrainer: authStore.registerTrainer,
    logout: authStore.logout,
  };
}
