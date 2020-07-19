import { Component } from '@angular/core';
import { BookService, Book } from '../services/book.service';
import { AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.page.html',
  styleUrls: ['./add-book.page.scss'],
})
export class AddBookPage {
  status: string;
  books = this.bookService.books;
  book: Book;

  constructor(
    public bookService: BookService,
    private alertController: AlertController,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.route.params.subscribe(params => {
      this.status = params['status'] || '';
      this.book = {
        name: '', status: this.status, started: null, ended: null, author: '', notes: ''
      }
    });
  }

  addBook() {
    if (!this.book.name || !this.book.status) {
      let createErrorAlert = this.alertController.create({
        message: `Name and status are mandatory`,
        buttons: ['Dismiss']
      });
      createErrorAlert.then(errorAlert => errorAlert.present());
      return;
    }

    this.bookService.addNewEntry(this.book, (isSuccessful) => {
      if (isSuccessful) {
        let createSuccessAlert = this.alertController.create({
          message: `New entry added.`,
          buttons: [{
            text: 'Dismiss',
            handler: () => {
              this.router.navigate(['/tabs/tab2']);
            }
          }]
        });
        createSuccessAlert.then(successAlert => successAlert.present());
      } else {
        let createErrorAlert = this.alertController.create({
          message: `Insert failed.`,
          buttons: ['Dismiss']
        });
        createErrorAlert.then(errorAlert => errorAlert.present());
      }
    });
  }
}
