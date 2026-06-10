// index.js — головний файл: демонстрація роботи модулів

// Named imports з data.js
import { LIBRARY_NAME, books } from "./data.js";

// Default import + named imports з utils.js
// (getAveragePages імпортуємо з перейменуванням через as)
import BookCollection, {
  getBooksByGenre,
  getAveragePages as avgPages,
  getOldestBook,
} from "./utils.js";

console.log("=== Завдання 5: Модулі ===");
console.log("Бібліотека:", LIBRARY_NAME);
console.log("Всього книг:", books.length);

// Функції з utils.js
console.log("Книги з програмування:", getBooksByGenre(books, "програмування"));
console.log("Середня кількість сторінок:", avgPages(books));
console.log("Найстаріша книга:", getOldestBook(books));

// Клас BookCollection (default export)
const collection = new BookCollection(books);
console.log("Книг у колекції:", collection.count);

collection.addBook({
  title: "You Don't Know JS",
  author: "Kyle Simpson",
  year: 2015,
  pages: 278,
  genre: "програмування",
});
console.log("Після addBook — книг у колекції:", collection.count);

console.log(
  "Відсортовано за роком:",
  collection.getSortedByYear().map((b) => `${b.title} (${b.year})`),
);
