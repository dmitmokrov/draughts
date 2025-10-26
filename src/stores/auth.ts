import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useStorage } from '@vueuse/core';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '@/services/firebase';

interface UserData {
  email: string;
  name: string;
  role: 'trainer' | 'student';
  createdAt: number; // Using timestamp instead of Date for better serialization
  trainerId?: string;
}

export const useAuthStore = defineStore('auth', () => {
  // State with persistence using VueUse
  const user = ref<User | null>(null);
  const userData = useStorage<UserData | null>('auth-userData', null, localStorage);
  const isLoading = ref(true);
  const error = ref<string | null>(null);
  const lastAuthCheck = useStorage<number | null>('auth-lastAuthCheck', null, localStorage);

  // Getters
  const isAuthenticated = computed(() => {
    if (lastAuthCheck.value && Date.now() - lastAuthCheck.value < 5 * 60 * 1000) {
      return true;
    }
    return !!user.value;
  });

  const isTrainer = computed(() => userData.value?.role === 'trainer');
  const isStudent = computed(() => userData.value?.role === 'student');
  const currentUser = computed(() => userData.value);
  const userRole = computed(() => userData.value?.role);

  // Actions
  async function login(email: string, password: string) {
    isLoading.value = true;
    error.value = null;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await loadUserData(userCredential.user.uid);
      lastAuthCheck.value = Date.now();
    } catch (err: unknown) {
      if (err instanceof Error && 'code' in err) {
        error.value = getErrorMessage(err.code as string);
      } else {
        error.value = 'Произошла ошибка при аутентификации';
      }
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function registerTrainer(email: string, password: string, name: string) {
    isLoading.value = true;
    error.value = null;

    try {
      const trainerCheck = await isTrainerEmail(email);
      if (!trainerCheck) {
        throw new Error('Только тренер может зарегистрироваться');
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      const newUserData: UserData = {
        email,
        name,
        role: 'trainer',
        createdAt: Date.now(),
      };

      await saveUserData(userCredential.user.uid, newUserData);
      await loadUserData(userCredential.user.uid);
      lastAuthCheck.value = Date.now();
    } catch (err: unknown) {
      if (err instanceof Error && 'code' in err) {
        error.value = getErrorMessage(err.code as string) || (err as Error).message;
      } else {
        error.value = 'Произошла ошибка при регистрации';
      }
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function logout() {
    isLoading.value = true;
    try {
      await signOut(auth);
      user.value = null;
      userData.value = null;
      error.value = null;
      lastAuthCheck.value = null;
    } catch (err: unknown) {
      if (err instanceof Error) {
        error.value = (err as Error).message;
      } else {
        error.value = 'Произошла ошибка при выходе из системы';
      }
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function loadUserData(userId: string) {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));

      if (userDoc.exists()) {
        const data = userDoc.data();
        userData.value = {
          email: data.email,
          name: data.name,
          role: data.role,
          createdAt: typeof data.createdAt === 'number' ? data.createdAt : Date.now(),
          trainerId: data.trainerId,
        };
      } else {
        await logout();
        throw new Error('Пользователь не найден в системе');
      }
    } catch (err: unknown) {
      console.error('Error loading user data:', err);
      throw err;
    }
  }

  async function saveUserData(userId: string, data: UserData) {
    await setDoc(doc(db, 'users', userId), data);
  }

  async function isTrainerEmail(email: string): Promise<boolean> {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', email), where('role', '==', 'trainer'));
      const snapshot = await getDocs(q);
      return !snapshot.empty;
    } catch (err: unknown) {
      console.error('Error checking trainer role:', err);
      return false;
    }
  }

  function initializeAuthListener(): Promise<void> {
    return new Promise((resolve) => {
      onAuthStateChanged(auth, async (authUser) => {
        user.value = authUser;
        if (authUser) {
          try {
            await loadUserData(authUser.uid);
            lastAuthCheck.value = Date.now();
          } catch (err: unknown) {
            console.error('Auth state change error:', err);
            lastAuthCheck.value = null;
          }
        } else {
          userData.value = null;
          lastAuthCheck.value = null;
        }
        isLoading.value = false;
        resolve();
      });
    });
  }

  function getErrorMessage(errorCode: string): string {
    const errorMessages: Record<string, string> = {
      'auth/invalid-email': 'Неверный формат email',
      'auth/user-disabled': 'Аккаунт отключен',
      'auth/user-not-found': 'Пользователь не найден',
      'auth/wrong-password': 'Неверный пароль',
      'auth/email-already-in-use': 'Email уже используется',
      'auth/weak-password': 'Пароль слишком простой',
    };
    return errorMessages[errorCode] || 'Произошла ошибка при аутентификации';
  }

  return {
    // State
    user,
    userData,
    isLoading,
    error,
    lastAuthCheck,

    // Getters
    isAuthenticated,
    isTrainer,
    isStudent,
    currentUser,
    userRole,

    // Actions
    login,
    registerTrainer,
    logout,
    loadUserData,
    saveUserData,
    isTrainerEmail,
    initializeAuthListener,
    getErrorMessage,
  };
});
