'use client';
import { cn } from '@/shared/lib/utils';
import React from 'react';

import { Title } from './title';
import { Button } from '../ui';
import { PizzaImage } from './pizza-image';
import { GroupVariants } from './group-variants';
import { PizzaSize, PizzaType, pizzaTypes } from '@/shared/constants/pizza';
import { Ingredient, ProductItem } from '@/generated/prisma/client';
import { IngredientItem } from '.';
import { getPizzaDetails } from '@/shared/lib';
import { usePizzaOptions } from '@/shared/hooks/use-pizza-options';


interface Props {
  imageUrl: string;
  name: string;
  ingredients: Ingredient[];
  items: ProductItem[];
  loading?: boolean;
  onSubmit: (itemId: number, ingredients: number[]) => void;
  className?: string;
}

export const ChoosePizzaForm: React.FC<Props> = ({
  imageUrl,
  name,
  ingredients,
  items,
  onSubmit,
  loading,
  className }) => {

  const { size, type, selectedIngredients, availableSizes, currentItemId, setSize, setType, addIngredient } = usePizzaOptions(items);

  const { textDetails, totalPrice } = getPizzaDetails(type, size, items, ingredients, selectedIngredients);

  const handleCkickAdd = () => {
    if (currentItemId) {
      onSubmit(currentItemId, Array.from(selectedIngredients));
    }

  }

  return (
    <div className={cn('flex flex-1', className,)}>
      <PizzaImage imageUrl={imageUrl} size={size} />

      <div className="w-[490px] bg-[#f7f6f5] p-7">
        <Title text={name} size="md" className="font-extrabold mb-1" />
        <p className="text-gray-400">{textDetails}</p>

        <div className='flex flex-col gap-4 mt-5'>
          <GroupVariants items={availableSizes} value={String(size)} onClick={(value) => setSize(Number(value) as PizzaSize)} />

          <GroupVariants items={pizzaTypes} value={String(type)} onClick={(value) => setType(Number(value) as PizzaType)} />
        </div>

        <div className='bg-gray-50 p-5 rounded-md h-[420px] overflow-auto scrollbar mt-5'>
          <div className='grid grid-cols-3 gap-3' >
            {ingredients.map((ingredient) => (
              <IngredientItem key={ingredient.id} imageUrl={ingredient.imageUrl} name={ingredient.name} price={ingredient.price} onClick={() => addIngredient(ingredient.id)} active={selectedIngredients.has(ingredient.id)} />
            ))}
          </div>
        </div>

        <Button onClick={handleCkickAdd} loading={loading}
          className="h-[55px] px-10 text-base rounded-[18px] w-full mt-10">
          Добавить в корзину за {totalPrice} ₽
        </Button>
      </div>
    </div>
  );
};