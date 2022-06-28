import { ShoppingListComponent } from './view/shopping-list.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShoppingListRoutingModule } from './shopping-list-routing.module';
import { ShoppingDialogsComponent } from './components/shopping-dialogs/shopping-dialogs.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [ShoppingListComponent, ShoppingDialogsComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ShoppingListRoutingModule,
    SharedModule
  ],
  exports: [ShoppingListComponent, ShoppingDialogsComponent],
})
export class ShoppingListModule {}
