import { Ingredient, ProductItem } from "@/generated/prisma/client";
import { calcTotalPizzPrice } from ".";
import { PizzaType, PizzaSize, mapPizzaType } from "../constants/pizza";

export const getPizzaDetails = (type: PizzaType, size: PizzaSize, items: ProductItem[], ingredients: Ingredient[], selectedIngredients: Set<number>) => {
    const totalPrice = calcTotalPizzPrice(type, size, items, ingredients, selectedIngredients);

    const textDetails = `${size} см, ${mapPizzaType[type]} тесто`;

    return { totalPrice, textDetails };
}