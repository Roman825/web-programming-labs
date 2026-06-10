// task-3.js — Класи та наслідування

// Базовий клас для будь-якого медіа-елемента
class MediaItem {
  // Статичний лічильник — спільний для всіх екземплярів,
  // завдяки йому кожен новий об'єкт отримує унікальний id
  static #nextId = 1;

  // Приватне поле — ззовні до нього доступу нема, тільки через getter
  #id;

  constructor(title, year) {
    this.#id = MediaItem.#nextId++;
    this.title = title;
    this.year = year;
  }

  get id() {
    return this.#id;
  }

  // Вік рахуємо як різницю між поточним роком та роком видання
  get age() {
    return new Date().getFullYear() - this.year;
  }

  getInfo() {
    return `[${this.#id}] ${this.title} (${this.year})`;
  }

  // Статичний метод-компаратор для sort(): сортує за роком видання
  static compare(a, b) {
    return a.year - b.year;
  }
}

// Книга наслідує MediaItem і додає автора та кількість сторінок
class Book extends MediaItem {
  constructor(title, year, author, pages) {
    super(title, year); // викликаємо конструктор батька
    this.author = author;
    this.pages = pages;
  }

  // Перевизначаємо метод батька — формат рядка інший
  getInfo() {
    return `[${this.id}] ${this.title} — ${this.author} (${this.year}, стор. ${this.pages})`;
  }
}

// Фільм наслідує MediaItem і додає режисера та тривалість
class Movie extends MediaItem {
  constructor(title, year, director, duration) {
    super(title, year);
    this.director = director;
    this.duration = duration;
  }

  getInfo() {
    return `[${this.id}] ${this.title} — ${this.director} (${this.year}, ${this.duration} хв)`;
  }
}

// === Демонстрація ===
console.log("=== Завдання 3: Класи ===");

const book1 = new Book("Кобзар", 1840, "Тарас Шевченко", 280);
const book2 = new Book("Clean Code", 2008, "Robert Martin", 464);
const movie1 = new Movie("Тіні забутих предків", 1965, "Сергій Параджанов", 97);

console.log(book1.getInfo());
console.log(movie1.getInfo());
console.log("Вік книги:", book1.age, "років");

const items = [book1, book2, movie1];
// Копіюємо масив через spread, щоб sort не мутував оригінал
const sorted = [...items].sort(MediaItem.compare);
console.log(
  "Відсортовано за роком:",
  sorted.map((i) => i.getInfo()),
);
