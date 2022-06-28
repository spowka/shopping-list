import { TCategory } from './categories.model';

export interface IShoppingItem {
    id?: string,
    name: string,
    description: string,
    date: string,
    categoryId: string
};
