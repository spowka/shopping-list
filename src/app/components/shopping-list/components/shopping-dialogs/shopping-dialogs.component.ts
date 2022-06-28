import { FormGroup, FormBuilder, Validators, AbstractControl, FormControl } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ShoppingListService } from '../../services/shopping-list.service';
import { IShoppingItem } from '../../models/shopping-list.model';

@Component({
  selector: 'app-shopping-dialogs',
  templateUrl: './shopping-dialogs.component.html',
  styleUrls: ['./shopping-dialogs.component.scss'],
})
export class ShoppingDialogsComponent implements OnInit {
  @Input() item?: IShoppingItem;

  public form: FormGroup;
  public isNew: boolean = false;

  get title() {
    return this.isNew ? 'Add Item' : 'Update Item'
  }

  get categoryId() {
    return this.form.get('categoryId') as AbstractControl;
  }

  constructor(
    private activeModal: NgbActiveModal,
    private shoppingListService: ShoppingListService,
    private _fb: FormBuilder
  ) {
    this.form = this._fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      categoryId: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (!this.item) {
      this.isNew = true;
      return;
    }

    
    this.form.patchValue({
      name: this.item.name,
      description: this.item.description,
      categoryId: this.item.categoryId
    })

    this.form.addControl('id', this._fb.control(this.item.id))
  }

  onSubmit() {
    if (this.form.valid) {
      this.activeModal.close(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }

  public closeDialog() {
    this.activeModal.close();
  }

  public onChangeCategory(categoryId?: string) {
    this.categoryId.patchValue(categoryId);
  }
}
