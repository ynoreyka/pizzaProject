import { Ingredient } from "@/generated/prisma/client";
import { Api } from "@/shared/services/api-client";
import { useEffect, useState } from "react";



export const useIngredients = () => {
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        async function fetchIngredients() {
            try {
                setLoading(true);
                const ingredients = await Api.ingredients.getAll();
                setIngredients(ingredients);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
        fetchIngredients();
    }, []);

    return { ingredients, loading };
}