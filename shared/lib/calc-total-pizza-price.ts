import { Ingredient, ProductItem } from "@/generated/prisma/client";
import { PizzaSize, PizzaType } from "../constants/pizza";


/**
 * Функция для подсчёта общей стоимости пиццы
 * 
 * @param type - тип теста выбранной пиццы
 * @param size - размер выбранной пиццы 
 * @param items - список вариаций
 * @param ingredients - список ингредиентов
 * @param selectedIngredients - выбранные ингредиенты
 * 
 * @returns number общую стоимость
 */


export const calcTotalPizzPrice = (type: PizzaType, size: PizzaSize, items: ProductItem[], ingredients: Ingredient[], selectedIngredients: Set<number>) => {
    const pizzaPrice = items.find((item) => item.pizzaType === type && item.size === size)?.price || 0;
    const totalIngredintsPrice = ingredients.filter((ingredient) => selectedIngredients.has(ingredient.id)).reduce((acc, ingredient) => acc + ingredient.price, 0);
    const totalPrice = pizzaPrice + totalIngredintsPrice;
    return totalPrice;
}