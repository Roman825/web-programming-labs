// task-2.js — Методи масивів (тільки map / filter / reduce / sort, без циклів)

import { VARIANT } from "./config.js";

const products = [
  { id: 1, name: "Ноутбук", price: 25000 + VARIANT * 100, category: "electronics", inStock: true },
  { id: 2, name: "Навушники", price: 2500 + VARIANT * 10, category: "electronics", inStock: true },
  { id: 3, name: "Футболка", price: 800 + VARIANT * 5, category: "clothing", inStock: false },
  { id: 4, name: "Книга 'JavaScript'", price: 450 + VARIANT * 3, category: "books", inStock: true },
  { id: 5, name: "Рюкзак", price: 1500 + VARIANT * 8, category: "accessories", inStock: true },
  { id: 6, name: "Клавіатура", price: 3200 + VARIANT * 15, category: "electronics", inStock: false },
  { id: 7, name: "Кросівки", price: 4200 + VARIANT * 20, category: "clothing", inStock: true },
  { id: 8, name: "Книга 'TypeScript'", price: 520 + VARIANT * 4, category: "books", inStock: true },
  { id: 9, name: "Чохол для телефону", price: 350 + VARIANT * 2, category: "accessories", inStock: true },
  { id: 10, name: "Монітор", price: 12000 + VARIANT * 50, category: "electronics", inStock: true },
];

// 2.1. Спочатку відбираємо тільки товари в наявності (filter),
// потім перетворюємо кожен об'єкт на його назву (map).
function getAvailableProducts(products) {
  return products.filter((p) => p.inStock).map((p) => p.name);
}

// 2.2. Відбираємо товари потрібної категорії,
// робимо копію через spread (бо sort мутує масив!)
// і сортуємо за ціною за зростанням.
function getProductsByCategory(products, category) {
  return [...products.filter((p) => p.category === category)].sort(
    (a, b) => a.price - b.price,
  );
}

// 2.3. Залишаємо тільки наявні товари і через reduce
// складаємо їхні ціни в одну суму.
function getTotalPrice(products) {
  return products
    .filter((p) => p.inStock)
    .reduce((sum, p) => sum + p.price, 0);
}

// 2.4. reduce будує об'єкт-підсумок: для кожного товару
// беремо його категорію, якщо її ще нема в акумуляторі — створюємо
// з нулями, і додаємо кількість та ціну.
function getProductsSummary(products) {
  return products.reduce((summary, p) => {
    const current = summary[p.category] ?? { count: 0, totalPrice: 0 };
    return {
      ...summary,
      [p.category]: {
        count: current.count + 1,
        totalPrice: current.totalPrice + p.price,
      },
    };
  }, {});
}

// === Демонстрація ===
console.log("=== Завдання 2: Методи масивів ===");
console.log("Варіант:", VARIANT);
console.log("2.1:", getAvailableProducts(products));
console.log("2.2:", getProductsByCategory(products, "electronics"));
console.log("2.3:", getTotalPrice(products));
console.log("2.4:", getProductsSummary(products));
