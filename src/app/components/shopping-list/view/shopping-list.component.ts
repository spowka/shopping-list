import { ShoppingDialogsComponent } from './../components/shopping-dialogs/shopping-dialogs.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { Observable, Subscription } from 'rxjs';
import { ShoppingListService } from './../services/shopping-list.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ICategory, ECategories, TCategory, IGroupedCategory } from '../models/categories.model';
import { IShoppingItem } from '../models/shopping-list.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss'],
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  public modalRef!: NgbModalRef;
  public loading$: Observable<boolean>;

  public categories$: Observable<IGroupedCategory>;
  public shoppingList$: Observable<IShoppingItem[]>;

  public selectedCategory: string | undefined;
  public ECategories = ECategories;

  private unsubscribe$ = new Subscription()

  constructor(
    private shoppingListService: ShoppingListService,
    private authService: AuthService,
    private afs: AngularFirestore,
    private modalService: NgbModal
  ) {
    this.loading$ = shoppingListService.loading$;
    this.shoppingList$ = this.shoppingListService.fetchShoppingList();
    this.categories$ = shoppingListService.categories$;
  }

  ngOnInit(): void {
    this.shoppingListService.fetchCategories();
    this.shoppingListService.fetchShoppingList();
  }

  public onChangeCategory(categoryId?: string) {
    this.selectedCategory = categoryId
    this.shoppingList$ = this.shoppingListService.fetchShoppingList(categoryId)
  }

  public onAddItem() {
    this.modalRef = this.modalService.open(ShoppingDialogsComponent, {
      centered: true,
    });

    this.unsubscribe$.add(
      this.modalRef.closed.subscribe(res => {
        if (res) {
          const date = new Date();
          this.shoppingListService.addShoppingItem({ ...res, date })
        }
      })
    )
  }

  public onEditItem(item: IShoppingItem) {
    this.modalRef = this.modalService.open(ShoppingDialogsComponent, {
      centered: true,
    });

    this.modalRef.componentInstance.item = item;

    this.unsubscribe$.add(
      this.modalRef.closed.subscribe(res => {
        if (res) {
          this.shoppingListService.editShoppingItem(res)
        }
      })
    )
  }

  public onDeleteItem(id: string) {
    if (!id) return

    this.shoppingListService.deleteShoppingItem(id)
  }

  ngOnDestroy(): void {
    this.unsubscribe$.unsubscribe()
  }

}
