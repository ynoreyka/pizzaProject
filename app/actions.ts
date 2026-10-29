'use server';

import { OrderStatus } from "@/generated/prisma/enums";
import { prisma } from "@/prisma/prisma-client";
import { CheckoutFormValues } from "@/shared/constants";
import { createPayment, sendEmail } from "@/shared/lib";
import { cookies } from "next/headers";
import { PayOrderTemplate } from "@/shared/components";
import React from "react";
import { Prisma } from "@/generated/prisma/client";
import { getUserSession } from "@/shared/lib/get-user-session";
import { hashSync } from "bcrypt";
import { VerificationUserTemplate } from "@/shared/components/shared/email-temapltes/verification-user";


export async function createOrder(data: CheckoutFormValues) {
    try {
        const cookieStore = cookies();

        const cartToken = (await cookieStore).get('cartToken')?.value;

        if (!cartToken) {
            throw new Error('Cart token not found');
        }

        /* Находим корзину по токену */

        const userCart = await prisma.cart.findFirst({
            include: {
                user: true,
                cartItems: {
                    include: {
                        ingredients: true,
                        productItem: {
                            include: {
                                product: true,
                            },
                        },
                    },
                },
            },
            where: {
                tokenId: cartToken,
            },
        });

        /* Если корзина не найдена возращаем ошибку */

        if (!userCart) {
            throw new Error('Cart not found');
        }

        if (userCart?.totalAmount === 0) {
            throw new Error('Cart is empty');
        }

        /* Создаем заказ */

        const order = await prisma.order.create({
            data: {
                token: cartToken,
                totalAmount: userCart.totalAmount,
                status: OrderStatus.PENDING,
                items: JSON.stringify(userCart.cartItems),
                fullname: data.firstName + '' + data.lastName,
                email: data.email,
                phone: data.phone,
                address: data.address,
                comment: data.comment
            }
        });

        /* Очищаем корзину */

        await prisma.cart.update({
            where: {
                id: userCart.id,
            },
            data: {
                totalAmount: 0,
            },
        })



        await prisma.cartItem.deleteMany({
            where: { cartId: userCart.id },
        });

        // Создание сcылки оплаты

        const paymentData = await createPayment({ amount: order.totalAmount, orderId: order.id, description: 'Оплата заказа №' + order.id });

        if (!paymentData) {
            throw new Error('Payment data not found');
        }

        await prisma.order.update({
            where: {
                id: order.id,
            },
            data: {
                paymentID: paymentData.id,
            }
        })

        const paymentUrl = paymentData.confirmation.confirmation_url;

        const { renderToString } = await import("react-dom/server");

        const emailComponent = PayOrderTemplate({
            orderId: order.id,
            totalAmount: order.totalAmount,
            paymentUrl
        }) as React.ReactNode;

        sendEmail(data.email, `Next Pizza / Оплатите заказ №${order.id}`, renderToString(emailComponent));


        return paymentUrl;

    } catch (error) {
        console.log('[CreateOrder] Server error', error);
    }

}


export async function updateUserInfo(body: Prisma.UserUpdateInput) {
    try {
        const currentUser = await getUserSession();

        if (!currentUser) {
            throw new Error('Пользователь не найден');
        }

        const findUser = await prisma.user.findFirst({
            where: {
                id: Number(currentUser.id)
            }
        })

        await prisma.user.update({
            where: {
                id: Number(currentUser.id),
            },
            data: {
                fullname: body.fullname,
                email: body.email,
                password: body.password ? hashSync(body.password as string, 10) : findUser?.password,
            }
        })

    } catch (error) {
        console.log('Error [UPDATE_USER', error);
        throw error;
    }
}

export async function registerUser(body: Prisma.UserCreateInput) {
    try {
        const user = await prisma.user.findFirst({
            where: {
                email: body.email,
            }
        });

        if (user) {
            if (!user.verified) {
                throw new Error("Почта не подтверждена");
            }

            throw new Error('Пользователь уже существует');

        }

        const createdUser = await prisma.user.create({
            data: {
                fullname: body.fullname,
                email: body.email,
                password: hashSync(body.password, 10),
            }
        })

        const code = Math.floor(100000 + Math.random() * 900000).toString();

        await prisma.verificationCode.create({
            data: {
                code,
                userId: createdUser.id,
            }
        });

        const { renderToString } = await import("react-dom/server");

        const emailComponent = VerificationUserTemplate({
            code: code,
        }) as React.ReactNode;

        sendEmail(createdUser.email, `Next Pizza / Подтвердите регистрацию`, renderToString(emailComponent));


    } catch (error) {
        console.log("Error [CREATE_USER", error);
        throw error;
    }
}