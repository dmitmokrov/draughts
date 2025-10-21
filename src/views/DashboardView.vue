<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h1>Панель управления</h1>
      <div class="user-actions">
        <span class="user-info"> {{ userData?.name }} ({{ userRoleText }}) </span>
        <button @click="handleLogout" class="logout-btn" :disabled="isLoading">
          {{ isLoading ? 'Выход...' : 'Выйти' }}
        </button>
      </div>
    </div>

    <div class="dashboard-content">
      <!-- Для тренера -->
      <div v-if="isTrainer" class="trainer-section">
        <h2>Панель тренера</h2>
        <div class="action-cards">
          <div class="action-card" @click="navigateTo('/trainer/students')">
            <div class="card-icon">👥</div>
            <h3>Ученики</h3>
            <p>Управление учениками и создание аккаунтов</p>
          </div>
          <div class="action-card" @click="navigateTo('/trainer/problems')">
            <div class="card-icon">🎯</div>
            <h3>Задачи</h3>
            <p>Создание и назначение задач по шашкам</p>
          </div>
        </div>
      </div>

      <!-- Для ученика -->
      <div v-else class="student-section">
        <h2>Панель ученика</h2>
        <div class="action-cards">
          <div class="action-card" @click="navigateTo('/student/assignments')">
            <div class="card-icon">📚</div>
            <h3>Мои задания</h3>
            <p>Просмотр и решение задач</p>
          </div>
          <div class="action-card" @click="navigateTo('/student/progress')">
            <div class="card-icon">📊</div>
            <h3>Прогресс</h3>
            <p>Статистика и достижения</p>
          </div>
        </div>
      </div>

      <!-- Общая информация -->
      <div class="info-section">
        <h3>Система обучения шашкам</h3>
        <p>Добро пожаловать в систему обучения русским шашкам!</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import { computed } from 'vue';

const router = useRouter();
const { userData, isTrainer, logout, isLoading } = useAuth();

const userRoleText = computed(() => {
  return isTrainer ? 'Тренер' : 'Ученик';
});

const handleLogout = async () => {
  try {
    await logout();
    router.push('/login');
  } catch (error) {
    console.error('Logout error:', error);
  }
};

const navigateTo = (path: string) => {
  router.push(path);
};
</script>

<style scoped>
.dashboard {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-info {
  color: #666;
  font-weight: 500;
}

.logout-btn {
  padding: 0.5rem 1rem;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.logout-btn:hover:not(:disabled) {
  background: #c0392b;
}

.logout-btn:disabled {
  background: #cccccc;
  cursor: not-allowed;
}

.dashboard-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.action-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.action-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  cursor: pointer;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  text-align: center;
}

.action-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.action-card h3 {
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

.action-card p {
  color: #666;
  margin: 0;
}

.info-section {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin-top: 2rem;
}

.info-section h3 {
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .action-cards {
    grid-template-columns: 1fr;
  }
}
</style>
