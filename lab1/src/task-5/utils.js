// utils.js — функції для роботи з книгами (named exports + default export)

// Фільтрація книг за жанром
export function getBooksByGenre(books, genre) {
  return books.filter((book) => book.genre === genre);
}

// Середня кількість сторінок: сума всіх сторінок поділена на кількість книг
export function getAveragePages(books) {
  if (books.length === 0) return 0;
  const total = books.reduce((sum, book) => sum + book.pages, 0);
  return Math.round(total / books.length);
}

// Найстаріша книга — та, в якої найменший рік видання
export function getOldestBook(books) {
  return books.reduce((oldest, book) =>
    book.year < oldest.year ? book : oldest,
  );
}

// Default export — клас-колекція книг
export default class BookCollection {
  constructor(books) {
    this.books = [...books]; // копія, щоб не мутувати вхідний масив
  }

  // Копія масиву, відсортована за роком (від старих до нових)
  getSortedByYear() {
    return [...this.books].sort((a, b) => a.year - b.year);
  }

  addBook(book) {
    this.books.push(book);
  }

  get count() {
    return this.books.length;
  }
}
