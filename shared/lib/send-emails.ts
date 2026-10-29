// Используется Uniseder Go


export const sendEmail = async (to: string, subject: string, template: string) => {

    const apiKey = process.env.UNISENDER_API_KEY;

    if (!apiKey) {
        console.log("UNISENDER_API_KEY не настроен в переменных окружения");
        throw new Error("API ключ не настроен");
    }

    try {
        const requestBody = {
            message: {
                recipients: [{ email: to }],
                subject: subject,
                body: { html: template },
                from_email: `${process.env.UNISENDER_URL}`,
                from_name: "Пиццерия Next-pizza",
            },
        };

        const response = await fetch('https://goapi.unisender.ru/ru/transactional/api/v1/email/send.json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': apiKey,
            },
            body: JSON.stringify(requestBody),
        });

        const data = await response.json();


        if (!response.ok) {
            console.error('Ошибка Unisender:', data);
            throw new Error('Не удалось отправить письмо');
        }

        return data;

    } catch (error) {
        console.log("Send email error:", error);
        throw error;
    }
}; 