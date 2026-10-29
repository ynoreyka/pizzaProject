'use client';

import React from 'react';
import { AddressSuggestions } from 'react-dadata';
import 'react-dadata/dist/react-dadata.css';

interface Props {
    onChange?: (value?: string) => void;
}

export const AdressInput: React.FC<Props> = ({ onChange }) => {
    return (
        <AddressSuggestions
            token="4d52d9c115c1e274ad9dabb0b695702781564e68"
            onChange={(data) => onChange?.(data?.value)}
        />
    );
};