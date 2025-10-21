import { createRouter, createWebHistory } from 'vue-router';
import { authStore } from '@/main';

const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue'),
    meta: { requiresGuest: true },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/DashboardView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/trainer/students',
    name: 'TrainerStudents',
    component: () => import('../views/trainer/StudentsView.vue'),
    meta: { requiresAuth: true, requiresRole: 'trainer' },
  },
  {
    path: '/trainer/problems',
    name: 'TrainerProblems',
    component: () => import('../views/trainer/ProblemsView.vue'),
    meta: { requiresAuth: true, requiresRole: 'trainer' },
  },
  {
    path: '/student/assignments',
    name: 'StudentAssignments',
    component: () => import('../views/student/AssignmentsView.vue'),
    meta: { requiresAuth: true, requiresRole: 'student' },
  },
  {
    path: '/student/progress',
    name: 'StudentProgress',
    component: () => import('../views/student/ProgressView.vue'),
    meta: { requiresAuth: true, requiresRole: 'student' },
  },
  {
    path: '/unauthorized',
    name: 'Unauthorized',
    component: () => import('../views/UnauthorizedView.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Guard для аутентификации и ролей
router.beforeEach(async (to, from, next) => {
  // Если данные еще грузятся - ждем их загрузки
  if (authStore.isLoading) {
    try {
      // Ждем завершения инициализации
      await new Promise((resolve) => {
        const checkInitialization = () => {
          if (!authStore.isLoading) {
            resolve(true);
            return;
          }
          // Проверяем каждые 100ms
          setTimeout(checkInitialization, 100);
        };
        checkInitialization();
      });
    } catch (error) {
      console.error('Error waiting for auth:', error);
    }
  }

  // Проверяем требует ли маршрут аутентификации
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login');
    return;
  }

  // Проверяем требует ли маршрут гостя (неаутентифицированного пользователя)
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/dashboard');
    return;
  }

  // Проверка ролей
  if (to.meta.requiresRole) {
    const userRole = authStore.userRole;

    if (!userRole) {
      next('/unauthorized');
      return;
    }

    if (userRole !== to.meta.requiresRole) {
      next('/unauthorized');
      return;
    }
  }

  next();
});

export default router;
