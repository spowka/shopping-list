import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategorySelectComponent } from './components/category-select/category-select.component';
import { NgbDropdownModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [CategorySelectComponent],
  imports: [
    CommonModule,
    NgbDropdownModule,
    NgbModalModule,
  ],
  exports: [
    CategorySelectComponent
  ]
})
export class SharedModule { }
