<template>
  <div class="unauthorized-view">
    <div class="error-container">
      <h1>⛔ Доступ запрещен</h1>
      <p>У вас недостаточно прав для просмотра этой страницы.</p>

      <div v-if="authStore.userData" class="user-info">
        <p>
          Ваша роль: <strong>{{ roleText }}</strong>
        </p>
        <p>Email: {{ authStore.userData.email }}</p>
        <p>
          Текущий путь: <code>{{ currentRoute }}</code>
        </p>
      </div>

      <div v-else class="user-info">
        <p>Информация о пользователе не доступна</p>
      </div>

      <div class="actions">
        <button class="btn-primary" @click="goToDashboard">На главную</button>
        <button class="btn-secondary" @click="logout">Выйти</button>
        <button class="btn-tertiary" @click="reloadPage">Обновить страницу</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import { authStore } from '@/main'; // Используем тот же экземпляр store
import { computed } from 'vue';

const router = useRouter();
const route = useRoute();

const roleText = computed(() => {
  if (!authStore.userData) return 'Не определена';
  return authStore.userData.role === 'trainer' ? 'Тренер' : 'Ученик';
});

const currentRoute = computed(() => route.path);

const goToDashboard = () => {
  router.push('/dashboard');
};

const logout = async () => {
  await authStore.logout();
  router.push('/login');
};

const reloadPage = () => {
  window.location.reload();
};
</script>

<style scoped>
.unauthorized-view {
  display: flex;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.error-container {
  max-width: 500px;
  padding: 3rem;
  border-radius: 12px;
  background: white;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.error-container h1 {
  margin-bottom: 1rem;
  color: #e74c3c;
}

.user-info {
  padding: 1rem;
  border-radius: 4px;
  margin: 1.5rem 0;
  background: #f8f9fa;
  text-align: left;
}

.user-info code {
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
  background: #e9ecef;
  font-family: monospace;
}

.actions {
  display: flex;
  flex-direction: column;
  margin-top: 2rem;
  gap: 0.75rem;
}

.btn-primary {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  background: #3498db;
  color: white;
  cursor: pointer;
}

.btn-secondary {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  background: #95a5a6;
  color: white;
  cursor: pointer;
}

.btn-tertiary {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  background: #f39c12;
  color: white;
  cursor: pointer;
}
</style>
