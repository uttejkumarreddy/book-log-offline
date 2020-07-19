import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Book, BookService } from '../services/book.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-book',
  templateUrl: './book.page.html',
  styleUrls: ['./book.page.scss'],
})
export class BookPage implements OnInit {
  position: number;
  isBookPresent: boolean = false;
  isDisabled: boolean = true;
  book: Book;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookService: BookService,
    private alertController: AlertController) {
    this.route.params.subscribe(params => {
      this.position = params['position'];
    });
  }

  ngOnInit() {
    this.bookService.loadSavedEntries();
    let bookAtPosition = this.bookService.getEntryAtPosition(this.position);
    if (bookAtPosition) {
      this.isBookPresent = true;
      this.book = JSON.parse(JSON.stringify(bookAtPosition));
    } else {
      this.showLoadingError();
    }
  }

  showLoadingError() {
    let createErrorAlert = this.alertController.create({
      message: 'Error retrieving book.',
      buttons: [{
        text: 'Dismiss',
        handler: () => {
          this.router.navigate(['/tabs/tab2']);
        }
      }]
    });
    createErrorAlert.then(errorAlert => errorAlert.present());
  }

  toggleEdit() {
    this.isDisabled = false;
  }

  saveChanges() {
    if (!this.book.name || !this.book.status) {
      let createErrorAlert = this.alertController.create({
        message: `Name and status are mandatory`,
        buttons: ['Dismiss']
      });
      createErrorAlert.then(errorAlert => errorAlert.present());
      return;
    }

    this.bookService.updateEntry(this.book, this.position, (isSuccessful) => {
      if (isSuccessful) {
        let createSuccessAlert = this.alertController.create({
          message: `Updated entry.`,
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
          message: `Update failed.`,
          buttons: [{
            text: 'Dismiss',
            handler: () => {
              this.router.navigate(['/tabs/tab2']);
            }
          }]
        });
        createErrorAlert.then(errorAlert => errorAlert.present());
      }
    })
  }

  deleteBook() {
    let createDeleteAlert = this.alertController.create({
      message: 'Confirm deletion.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => { }
        },
        {
          text: 'Delete',
          handler: data => {
            this.bookService.removeEntry(this.position, (isSuccessful) => {
              if (isSuccessful) {
                let createSuccessAlert = this.alertController.create({
                  message: `Entry deleted.`,
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
                  message: `Deletion failed.`,
                  buttons: ['Dismiss']
                });
                createErrorAlert.then(errorAlert => errorAlert.present());
              }
            });
          }
        }
      ]
    });
    createDeleteAlert.then(deleteAlert => deleteAlert.present());
  }
}