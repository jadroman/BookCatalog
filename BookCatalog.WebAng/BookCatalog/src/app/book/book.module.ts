import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookListComponent } from './book-list/book-list.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxPaginationModule } from 'ngx-pagination';
import { ReactiveFormsModule } from '@angular/forms';
import { BookDetailsComponent } from './book-details/book-details.component';
import { BookUpdateComponent } from './book-update/book-update.component';



@NgModule({
  declarations: [
    BookListComponent,
    BookDetailsComponent,
    BookUpdateComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    CommonModule,
    RouterModule.forChild([
      { path: '', component: BookListComponent },
      { path: 'list', component: BookListComponent },
      { path: 'details/:id', component: BookDetailsComponent },
      { path: 'update/:id', component: BookUpdateComponent }
      /* { path: 'create', component: CategoryCreateComponent },
      { path: 'delete/:id', component: CategoryDeleteComponent } */
    ]),
    ReactiveFormsModule,
    NgxPaginationModule,  
    NgxSpinnerModule
  ]
})
export class BookModule { }