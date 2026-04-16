import { prisma } from "@/prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";
import crypto from 'crypto';
import { findOrCreateCart } from "@/shared/lib/find-or-create-cart";
import { CreateCartItemValues } from "@/shared/services/dto/cart.dto";
import { updateCartTotalAmount } from "@/shared/lib/update-cart-total-amount";
import { ingredients } from "@/prisma/constants";

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get('cartToken')?.value;

        if (!token) {
            return NextResponse.json({ totalAmount: 0, items: [] });
        }

        const userCart = await prisma.cart.findFirst({
            where: {
                OR: [
                    { tokenId: token }
                ]
            },
            include: {
                cartItems: {
                    orderBy: {
                        createdAt: 'desc'
                    },
                    include: {
                        productItem: {
                            include: {
                                product: true
                            }
                        },
                        ingredients: true,
                    }
                }
            }
        });
        return NextResponse.json(userCart);
    } catch (error) {
        console.log('[CART_GET] Server error', error);
        return NextResponse.json({ message: 'Не удалось получить корзину' }, { status: 500 });
    }
}


export async function POST(req: NextRequest) {
    try {
        let token = req.cookies.get('cartToken')?.value;

        if (!token) {
            token = crypto.randomUUID();
        }

        const userCart = await findOrCreateCart(token);

        const data = (await req.json()) as CreateCartItemValues;


        const findCartItem = await prisma.cartItem.findFirst({
            where: {
                cartId: userCart.id,
                productItemId: data.productItemId,
                ingredients: { every: { id: { in: data.ingredients } } }
            }
        });

        // Если товар точно совпадающий найден, то делаем + 1

        if (findCartItem) {
            await prisma.cartItem.update({
                where: {
                    id: findCartItem.id
                },
                data: {
                    quantity: findCartItem.quantity + 1
                }
            });

        } else {
            // Если товар не найден
            await prisma.cartItem.create({
                data: {
                    cartId: userCart.id,
                    productItemId: data.productItemId,
                    quantity: 1,
                    ingredients: {
                        connect: data.ingredients?.map((ingredient) => ({ id: ingredient }))
                    }
                }
            });
        }

        const updatedUserCart = await updateCartTotalAmount(token);

        const resp = NextResponse.json(updatedUserCart);

        resp.cookies.set('cartToken', token, {
            httpOnly: true,
            secure: true,
            maxAge: 60 * 60 * 24,
            path: '/',
        })

        return resp;
    } catch (error) {
        console.log('[CART_POST] Server error', error);
        return NextResponse.json({ message: 'Не удалось создать корзину' }, { status: 500 });
    }
}