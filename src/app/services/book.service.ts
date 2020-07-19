import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class BookService {
  public books: Book[] = [];
  private BOOK_STORAGE: string = "books";

  constructor() { }

  public addNewEntry(newEntry: Book, callbackFunction) {
    this.books.unshift(newEntry);
    this.cleanEntryData(newEntry);

    Storage.set({
      key: this.BOOK_STORAGE,
      value: JSON.stringify(this.books),
    })
      .then((res) => callbackFunction(true))
      .catch((err) => callbackFunction(false));
  }

  public async loadSavedEntries() {
    const books = await Storage.get({ key: this.BOOK_STORAGE });
    this.books = JSON.parse(books.value) || [];
  }

  public getEntryAtPosition(position: number) {
    return this.books[position];
  }

  public updateEntry(book: Book, position: number, callbackFunction) {
    if (this.books[position]) {
      book.name ? (this.books[position].name = book.name) : null;
      book.status ? (this.books[position].status = book.status) : null;
      book.author ? (this.books[position].author = book.author) : null;
      book.started ? (this.books[position].started = book.started) : null;
      book.ended ? (this.books[position].ended = book.ended) : null;
      book.notes ? (this.books[position].notes = book.notes) : null;

      this.cleanEntryData(book);

      Storage.set({
        key: this.BOOK_STORAGE,
        value: JSON.stringify(this.books),
      })
        .then((res) => callbackFunction(true))
        .catch((err) => callbackFunction(false));
    } else {
      return callbackFunction(false);
    }
  }

  public removeEntry(position: number, callbackFunction) {
    if (this.books.length < position) return callbackFunction(false);

    this.books.splice(position, 1);

    Storage.set({
      key: this.BOOK_STORAGE,
      value: JSON.stringify(this.books),
    })
      .then((res) => callbackFunction(true))
      .catch((err) => callbackFunction(false));
  }

  private cleanEntryData(book: Book) {
    if (book.status === 'past') {

    } else if (book.status === 'present') {
      book.ended = null;
    } else if (book.status === 'future') {
      book.started = null;
      book.ended = null;
    }
  }
}

export interface Book {
  name: string;
  status: string;
  author?: string;
  started?: Date;
  ended?: Date;
  notes?: string;
}