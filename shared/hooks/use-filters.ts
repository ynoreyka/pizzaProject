import { useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useSet } from 'react-use';


interface PriceRange {
    priceFrom?: number;
    priceTo?: number;
}

interface QueryFilters extends PriceRange {
    pizzaTypes: string;
    sizes: string;
    ingredients: string;
}

export interface Filters {
    pizzaTypes: Set<string>;
    sizes: Set<string>;
    selectedIngredients: Set<string>;
    prices: PriceRange
}

interface ReturnProps extends Filters {
    setPrices: (name: keyof PriceRange, value: number) => void;
    setPizzaTypes: (value: string) => void;
    setSizes: (value: string) => void;
    setSelectedIngredients: (value: string) => void;
}

export const useFilters = (): ReturnProps => {
    const searchParams = useSearchParams() as unknown as Map<keyof QueryFilters, string>;

    // Фильтр ингредиентов
    const [selectedIngredients, { toggle: toggleIngredients }] = useSet(new Set<string>(searchParams.get('ingredients')?.split(',')));

    // Фильтр цен
    const [prices, setPrices] = useState<PriceRange>({ priceFrom: Number(searchParams.get('priceFrom')) || undefined, priceTo: Number(searchParams.get('priceTo')) || undefined });

    // Фильтр размеров
    const [sizes, { toggle: toggleSizes }] = useSet(new Set<string>(searchParams.has('sizes') ? searchParams.get('sizes')?.split(',') : []));

    // Фильтр теста
    const [pizzaTypes, { toggle: togglePizzaType }] = useSet(new Set<string>(searchParams.has('pizzaTypes') ? searchParams.get('pizzaTypes')?.split(',') : []));

    const updatePrice = (name: keyof PriceRange, value: number) => {
        setPrices((prev) => ({
            ...prev,
            [name]: value
        }))
    };

    return useMemo(() => ({ selectedIngredients, prices, sizes, pizzaTypes, setPrices: updatePrice, setPizzaTypes: togglePizzaType, setSizes: toggleSizes, setSelectedIngredients: toggleIngredients }), [sizes, pizzaTypes, selectedIngredients, prices]);
};   