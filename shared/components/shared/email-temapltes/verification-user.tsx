import React from 'react';

interface Props {
    code: string;
}

export const VerificationUserTemplate: React.FC<Props> = ({ code }) => {
    return <div>
        <p>Код подтверждения: <h2>{code}</h2></p>

        <p>
            <a href={`https://cuddly-space-winner-x54577767w7p26rpq-3000.app.github.dev/api/auth/verify?code=${code}`}>Подтвердить регистрацию</a>
        </p>
    </div>

};