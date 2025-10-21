<template>
  <div class="unauthorized-view">
    <div class="error-container">
      <h1>⛔ Доступ запрещен</h1>
      <p>У вас недостаточно прав для просмотра этой страницы.</p>

      <div class="user-info" v-if="authStore.userData">
        <p>
          Ваша роль: <strong>{{ roleText }}</strong>
        </p>
        <p>Email: {{ authStore.userData.email }}</p>
        <p>
          Текущий путь: <code>{{ currentRoute }}</code>
        </p>
      </div>

      <div class="user-info" v-else>
        <p>Информация о пользователе не доступна</p>
      </div>

      <div class="actions">
        <button @click="goToDashboard" class="btn-primary">На главную</button>
        <button @click="logout" class="btn-secondary">Выйти</button>
        <button @click="reloadPage" class="btn-tertiary">Обновить страницу</button>
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
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
}

.error-container {
  background: white;
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 500px;
}

.error-container h1 {
  color: #e74c3c;
  margin-bottom: 1rem;
}

.user-info {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 4px;
  margin: 1.5rem 0;
  text-align: left;
}

.user-info code {
  background: #e9ecef;
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
  font-family: monospace;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 2rem;
}

.btn-primary {
  padding: 0.75rem 1.5rem;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-secondary {
  padding: 0.75rem 1.5rem;
  background: #95a5a6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-tertiary {
  padding: 0.75rem 1.5rem;
  background: #f39c12;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
