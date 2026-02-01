import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

export default createConfigForNuxt({
  rules: {
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-empty-object-type': 'off',
    'vue/multi-word-component-names': 'off',
    'vue/no-multiple-template-root': 'off',
    'vue/html-self-closing': 'warn',
    'vue/attributes-order': 'warn',
    'vue/require-default-prop': 'warn',
  },
  ignores: [
    'node_modules',
    '.nuxt',
    '.output',
    'dist',
    'coverage',
    '*.d.ts',
    'vitest.config.ts',
  ],
})
