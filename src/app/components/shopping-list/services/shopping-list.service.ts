import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
  import { IShoppingItem } from '../models/shopping-list.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ICategory, IGroupedCategory } from '../models/categories.model';
import { BehaviorSubject, Subscription, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ShoppingListService {
  private _loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public loading$ = this._loading$.asObservable();

  private _categoriesCollection: AngularFirestoreCollection<ICategory>;
  private _categories$: BehaviorSubject<IGroupedCategory> = new BehaviorSubject<IGroupedCategory>({});
  public categories$ = this._categories$.asObservable();

  private _shoppingListCollection: AngularFirestoreCollection<IShoppingItem>
  private _shoppingList$: BehaviorSubject<IShoppingItem[]> = new BehaviorSubject<IShoppingItem[]>([]);
  public shoppingList$ = this._shoppingList$.asObservable();

  public subscribtion!: Subscription;

  constructor(
    public afAuth: AngularFireAuth,
    public router: Router,
    private _afs: AngularFirestore,
    private authService: AuthService
  ) {
    this._categoriesCollection = this._afs.collection<ICategory>('categories')
    this._shoppingListCollection = this._afs.collection<IShoppingItem>(`users/${this.authService.uid}/shopping-list`);
  }

  public fetchCategories() {
    this._loading$.next(true);
    this._categoriesCollection.valueChanges({ idField: 'id' })
      .pipe(take(1))
      .subscribe({
        next: (categories) => {
          const groupedCategories: IGroupedCategory = {};
          categories.map(category => {
            groupedCategories[category.id] = category.name;
          })
          this._categories$.next(groupedCategories);
        },
        complete: () => {
          this._loading$.next(false);
        },
      });
  }

  public fetchShoppingList(categoryId?: string) {
    this._loading$.next(false);

    return this._afs.collection<IShoppingItem>(`users/${this.authService.uid}/shopping-list`, ref => (categoryId ? ref.where('categoryId', '==', categoryId) : ref))
    .valueChanges({ idField: 'id' })
  }

  public filterExpiredItems() {
    const checkingDate = new Date().getTime()
  
    const shoppingListQuery = this._shoppingListCollection.ref.where('date', '<=', checkingDate);

    shoppingListQuery.get().then(shoppingList => {
      shoppingList.forEach(element => {
        element.ref.delete()
      })
    })
  }

  public addShoppingItem(data: IShoppingItem) {
    this._loading$.next(true);
    this._shoppingListCollection
      .add(data)
      .finally(() => {
        this._loading$.next(false);
      });
  }

  public editShoppingItem(data: IShoppingItem) {
    this._loading$.next(true);
    this._shoppingListCollection.doc(data.id)
      .update(data)
      .finally(() => {
        this._loading$.next(false);
      });
  }

  public deleteShoppingItem(id: string) {
    this._loading$.next(true);
    this._shoppingListCollection.doc(id)
      .delete()
      .finally(() => {
        this._loading$.next(false);
      });
  }
}
