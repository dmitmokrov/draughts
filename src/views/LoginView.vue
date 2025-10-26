<template>
  <div class="login-container">
    <div class="login-card">
      <h2>Вход в систему обучения шашкам</h2>

      <form class="login-form" @submit.prevent="handleLogin">
        <div class="field">
          <label for="email">Email</label>
          <InputText
            id="email"
            v-model="email"
            :class="{ 'p-invalid': formErrors.email }"
            fluid
            placeholder="Введите ваш email"
            type="email"
          />
          <small v-if="formErrors.email" class="error-text">{{ formErrors.email }}</small>
        </div>

        <div class="field">
          <label for="password">Пароль</label>
          <Password
            id="password"
            v-model="password"
            :class="{ 'p-invalid': formErrors.password }"
            :feedback="false"
            fluid
            placeholder="Введите пароль"
            toggleMask
          />
          <small v-if="formErrors.password" class="error-text">{{ formErrors.password }}</small>
        </div>

        <Button class="login-button" label="Войти" :loading="isLoading" type="submit" />

        <div v-if="error" class="error-message">
          {{ error }}
        </div>
      </form>

      <div class="login-info">
        <p>Если у вас нет аккаунта, обратитесь к тренеру</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';

const router = useRouter();
const { login, isLoading, error } = useAuth();

const email = ref('');
const password = ref('');

const formErrors = reactive({
  email: '',
  password: '',
});

const validateForm = () => {
  let isValid = true;

  // Очищаем предыдущие ошибки
  formErrors.email = '';
  formErrors.password = '';

  if (!email.value) {
    formErrors.email = 'Email обязателен';
    isValid = false;
  } else if (!/\S+@\S+\.\S+/.test(email.value)) {
    formErrors.email = 'Неверный формат email';
    isValid = false;
  }

  if (!password.value) {
    formErrors.password = 'Пароль обязателен';
    isValid = false;
  }

  return isValid;
};

const handleLogin = async () => {
  if (!validateForm()) return;

  await login(email.value, password.value);
  router.push('/dashboard');
};
</script>

<style scoped>
.login-container {
  display: flex;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-card {
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  border-radius: 12px;
  background: white;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.login-card h2 {
  margin-bottom: 1.5rem;
  color: #333;
  text-align: center;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.field label {
  color: #555;
  font-weight: 500;
}

.error-text {
  color: #e74c3c;
  font-size: 0.875rem;
}

.login-button {
  width: 100%;
  height: 3rem;
}

.error-message {
  padding: 0.75rem;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  background: #fee;
  color: #721c24;
  text-align: center;
}

.login-info {
  padding-top: 1.5rem;
  border-top: 1px solid #eee;
  margin-top: 1.5rem;
  color: #666;
  text-align: center;
}
</style>
