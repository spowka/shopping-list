export interface ICategory {
    id: string
    name: TCategory;
};

export interface IGroupedCategory {
    [key: string]: TCategory
};

export enum ECategories {
    fruits = 'Fruits',
    cleaning = 'Cleaning',
    health = 'Health',
    washing = 'Washing',
    beauty = 'Beauty',
    air_condition_kits = 'Air Condition Kits'
};

export type TCategory = 'fruits' | 'cleaning' | 'health' | 'washing' | 'beauty';

