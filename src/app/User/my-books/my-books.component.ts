import { Component, OnInit } from '@angular/core';
import { IssueBook } from 'src/app/DTO/IssueBook';
import { BooksService } from 'src/app/Services/books.service';
import { LoginService } from 'src/app/Services/login.service';

@Component({
  selector: 'app-my-books',
  templateUrl: './my-books.component.html',
  styleUrls: ['./my-books.component.css'],
})
export class MyBooksComponent implements OnInit {
  myBooks: IssueBook[] = [];
  curUserId: any;

  constructor(private bookSvc: BooksService, private loginSvc: LoginService) {
    this.curUserId = Number(this.loginSvc.getLoggedinUserId());
  }

  ngOnInit(): void {
    this.getBooksforCurUser();
  }

  getBooksforCurUser() {
    this.bookSvc.getBooksByUserId(this.curUserId).subscribe(
      (APIResult) => {
        if (APIResult.isSuccess) {
          this.myBooks = APIResult.data;
          console.log(APIResult.data);
        } else {
          console.log(APIResult);
        }
      },
      (error) => {
        // Handle network or unexpected errors here

        console.log('Network Error:', error);
      }
    );
  }

  formatDate(isoDate: string): string {
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  getEstimateReturnDate(days: number, issueDate: string): string {
    const issueDateObj = new Date(issueDate);
    const returnDateObj = new Date(
      issueDateObj.getTime() + days * 24 * 60 * 60 * 1000
    ); // Add days in milliseconds

    return returnDateObj.toISOString(); // Returns the calculated date in the ISO format
  }

  calculateDaysRemaining(endDate: string): number {
    const currentDate = new Date();
    const endDateObj = new Date(endDate);

    // Set both dates to midnight (00:00:00) to ensure accurate day count
    currentDate.setHours(0, 0, 0, 0);
    endDateObj.setHours(0, 0, 0, 0);

    // Calculate the time difference in milliseconds
    const timeDifference = endDateObj.getTime() - currentDate.getTime();

    // Calculate the number of days remaining
    const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    return daysRemaining;
  }

  submitBook(bookId: number) {
    let submitData = {
      bookId: bookId,
      userId: this.curUserId,
    };
    this.bookSvc.submitBook(submitData).subscribe({
      next: (APIResult) => {
        if (APIResult.isSuccess) {
          console.log(APIResult);
          this.getBooksforCurUser();
          this.bookSvc.showMessage('Successfully submited Book !', 'success');
        } else {
          console.log(APIResult);
          this.bookSvc.showMessage(APIResult.errorMessage, 'warning');
        }
      },
      error: (error) => {
        // Handle the error here
        if (error.status == 401) {
          console.log(error);
        }
      },
    });
  }
}