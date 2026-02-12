'use client';
import React, { useState } from 'react';
import { FilterChecboxProps, FilterCheckbox } from './filter.checkbox';
import { Input } from '../ui/input';
import { Skeleton } from '../ui';


type Item = FilterChecboxProps;

interface Props {
    title: string;
    items: Item[];
    defaultItems: Item[];
    loading?: boolean;
    limit?: number;
    searchInputPlaceholder?: string;
    onClickCheckbox?: (id: string) => void;
    selectedIds?: Set<string>;
    defaultValue?: string[];
    className?: string;
    name: string;
}

export const CheckboxFiltersGroup: React.FC<Props> = ({ title, items, defaultItems, limit = 5, searchInputPlaceholder = "Поиск...", className, loading, onClickCheckbox, selectedIds, name }) => {
    const [showAll, setShowAll] = useState<boolean>(false);
    const [searchValue, setSearchValue] = useState<string>('');

    const onChangeSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    }

    if (loading) {
        return <div className={className}>
            <p className="font-bold mb-3">{title}</p>
            {...Array(limit).fill(0).map((_, index) => (
                <Skeleton key={index} className='h-6 mb-4 rounded-[8px]' />
            ))}

        </div>
    }

    const list = showAll ? items.filter((item) => item.text.toLowerCase().includes(searchValue.toLocaleLowerCase())) : defaultItems?.slice(0, limit);

    return (
        <div className={className}>
            <p className="font-bold mb-3">{title}</p>
            {showAll && <div className="mb-5">
                <Input onChange={onChangeSearchInput} placeholder={searchInputPlaceholder} className="bg-gray-50 border-none" />
            </div>}
            <div className="flex flex-col gap-4 max-h-96 pr-2 overflow-auto scrollbar">
                {list.map((item, index) => {
                    return <FilterCheckbox onCheckedChange={() => onClickCheckbox?.(item.value)}
                        checked={selectedIds?.has(item.value)}
                        name={name}
                        key={String(item.value)}
                        value={item.value}
                        text={item.text}
                        endAdornment={item.endAdornment} />
                })}

            </div>
            {items.length > limit && (
                <div className={showAll ? 'border-t border-t-neutral-100 mt-4' : ''}>
                    <button onClick={() => setShowAll(!showAll)} className="text-primary mt-3">
                        {showAll ? 'Скрыть' : '+ Показать все'}
                    </button>
                </div>
            )}
        </div>
    );
};