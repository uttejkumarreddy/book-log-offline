import { Component } from '@angular/core';
import { BookService } from '../services/book.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  books = this.bookService.books;

  constructor(public bookService: BookService, private router: Router) { }

  ngOnInit() {
    this.bookService.loadSavedEntries();
  }

  navigateToBook(position: number) {
    this.router.navigate(['/book', position]);
  }
}
