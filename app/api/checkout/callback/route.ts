import { PaymentCallbackData } from "@/@types/yookassa";
import { OrderStatus } from "@/generated/prisma/enums";
import { prisma } from "@/prisma/prisma-client";
import { OrderSuccessTemplate } from "@/shared/components/shared/email-temapltes/order-success";
import { sendEmail } from "@/shared/lib";
import { CartItemDTO } from "@/shared/services/dto/cart.dto";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = (await req.json()) as PaymentCallbackData;

        const order = await prisma.order.findFirst({
            where: {
                id: Number(body.object.metadata.order_id),
            },
        });

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }


        const isSucceeded = body.object.status === 'succeeded';

        await prisma.order.update({
            where: {
                id: order.id,
            },
            data: {
                status: isSucceeded ? OrderStatus.SUCCESSED : OrderStatus.CANCELED
            }
        });

        const items = JSON.parse(order?.items as string) as unknown as CartItemDTO[];


        const emailComponent = OrderSuccessTemplate({
            orderId: order.id,
            items
        }) as React.ReactNode;

        const { renderToString } = await import('react-dom/server');

        if (isSucceeded) {
            await sendEmail(order.email, `Next Pizza / Ваш заказ №${order.id} оформлен`, renderToString(emailComponent));
        } else {
            await sendEmail(order.email, `Next Pizza / Ваш заказ №${order.id} не оформлен. Произошла ошибка оплаты.`, renderToString(emailComponent));
        }

        return NextResponse.json({ message: 'Webhook processed' }, { status: 200 });

    } catch (error) {
        console.log('[Checkout Callback] Error:', error);
        return NextResponse.json({ error: 'Server error' });
    }
}  