import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { ECategories, ICategory, IGroupedCategory, TCategory } from 'src/app/components/shopping-list/models/categories.model';
import { ShoppingListService } from 'src/app/components/shopping-list/services/shopping-list.service';

@Component({
  selector: 'app-category-select',
  templateUrl: './category-select.component.html',
  styleUrls: ['./category-select.component.scss']
})
export class CategorySelectComponent implements OnInit {
  @Input() selected: string | undefined;
  @Input() canSelectAll: boolean = false;

  public categories$: Observable<IGroupedCategory>;
  public ECategories = ECategories;

  @Output() categoryChange: EventEmitter<string | undefined> = new EventEmitter();

  constructor(private shoppingListService: ShoppingListService) {
    this.categories$ = shoppingListService.categories$;
  }

  ngOnInit(): void {

  }

  public onCategoryChange(categoryId?: string) {
    this.categoryChange.emit(categoryId);
  }

}
