import { z } from 'zod';


export const passwordShema = z.string().min(6, { message: "Введите корректный пароль" })

export const formLoginSchema = z.object({
    email: z.email({ error: "Введите корректную почту" }),
    password: passwordShema,
})

export const formRegisterSchema = formLoginSchema.merge(
    z.object({
        fullname: z.string().min(2, { message: "Введите имя и фамилию" }),
        confirmPassword: passwordShema
    })
).refine(data => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword']
})


export type TFormLoginValues = z.infer<typeof formLoginSchema>;
export type TFormRegisterValues = z.infer<typeof formRegisterSchema>;
