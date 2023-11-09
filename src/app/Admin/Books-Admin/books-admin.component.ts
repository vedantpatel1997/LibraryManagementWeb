import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Book } from 'src/app/DTO/book';
import { BooksService } from 'src/app/Services/books.service';

@Component({
  selector: 'app-books-admin',
  templateUrl: './books-admin.component.html',
  styleUrls: ['./books-admin.component.css'],
})
export class BooksAdminComponent {
  books: Book[] = [];

  displayedColumns: string[] = [
    'id',
    'title',
    'author',
    'categoryName',
    'price',
    'totalQuantity',
    'availableQuantity',
    'issuedQuantity',
    'action',
  ];
  dataSource: MatTableDataSource<Book>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private bookSvc: BooksService, private router: Router) {
    // Assign the data to the data source for the table to render
    this.bookSvc.getAllBooks().subscribe({
      next: (APIResult) => {
        if (APIResult.isSuccess) {
          this.books = APIResult.data;
          this.books.forEach((cur, i) => {
            cur.categoryName = cur.category.name;
            cur.id = i + 1;
          });
          this.dataSource = new MatTableDataSource(this.books);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          console.log(APIResult);
        }
      },
      error: (error) => {
        // Handle the error here
        console.log(error);
      },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  showBookDetails(bookId: number) {
    // Here, you can navigate to a book details page or display a dialog with book details.
    // You have access to the bookId to load the details of the selected book.
    console.log('BookId: ', bookId);
    this.router.navigateByUrl(`Admin/Books/Info/${bookId}`);
  }
}
