import { z } from 'zod'

export const registrationSchema = z.object({
  username: z.string()
    .min(8, 'Имя пользователя должно содержать минимум 8 символов'),
  password: z.string()
    .min(8, 'Пароль должен содержать минимум 8 символов')
    .regex(/[A-Z]/, 'Пароль должен содержать минимум 1 заглавную букву')
    .regex(/[0-9]/, 'Пароль должен содержать минимум 1 цифру'),
  passwordConfirmation: z.string()
}).refine(data => data.password === data.passwordConfirmation, {
  message: 'Пароли должны совпадать',
  path: ['passwordConfirmation']
})

export const loginSchema = z.object({
  username: z.string().min(1, 'Имя пользователя обязательно'),
  password: z.string().min(1, 'Пароль обязателен')
})

export type RegistrationFormData = z.infer<typeof registrationSchema>
export type LoginFormData = z.infer<typeof loginSchema>
