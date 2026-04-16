import { useEffect, useState } from "react";
import { Variant } from "../components/shared/group-variants";
import { PizzaSize, PizzaType } from "../constants/pizza";
import { useSet } from "react-use";
import { ProductItem } from "@/generated/prisma/client";
import { getAvailablePizzaSizes } from "../lib";

interface ReturnProps {
    size: PizzaSize;
    type: PizzaType;
    availableSizes: Variant[];
    selectedIngredients: Set<number>;
    currentItemId?: number;
    setSize: (size: PizzaSize) => void;
    setType: (type: PizzaType) => void;
    addIngredient: (id: number) => void;

}

export const usePizzaOptions = (items: ProductItem[]): ReturnProps => {
    const [selectedIngredients, { toggle: addIngredient }] = useSet(new Set<number>([]))
    const [size, setSize] = useState<PizzaSize>(20);
    const [type, setType] = useState<PizzaType>(1);

    const availableSizes = getAvailablePizzaSizes(type, items);

    const currentItemId = items.find((item) => item.pizzaType === type && item.size === size)?.id

    useEffect(() => {
        const isAvailabledSize = availableSizes.find((item) => Number(item.value) === size && !item.disabled);

        const availableSize = availableSizes?.find((item) => !item.disabled);
        if (!isAvailabledSize && availableSize) {
            setSize(Number(availableSize.value) as PizzaSize);
        }
    }, [type]);

    return {
        size,
        type,
        setSize,
        setType,
        selectedIngredients,
        addIngredient,
        availableSizes,
        currentItemId
    }
}