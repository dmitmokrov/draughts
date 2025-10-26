#!/usr/bin/env node

// Скрипт для проверки типов, игнорирующий аргументы от lint-staged
// lint-staged передает пути файлов в команду, но vue-tsc --noEmit
// не принимает отдельные файлы, а работает с конфигурацией TypeScript

import { execSync } from 'child_process';

try {
  // Запускаем проверку типов без передачи аргументов, игнорируя все, что передано извне
  execSync('vue-tsc --noEmit', { stdio: 'inherit' });
  console.log('Проверка типов завершена успешно');
} catch (error) {
  console.error('Ошибка при проверке типов:', error.message);
  process.exit(1);
}