// task-1.js — Деструктуризація та Spread/Rest

// 1.1. Дістаємо поля з об'єкта через деструктуризацію.
// Для middleName ставимо значення за замовчуванням null,
// щоб легко перевірити, чи воно взагалі було передане.
function getFullName(user) {
  const { firstName, lastName, middleName = null } = user;
  // Беремо першу літеру імені та (якщо є) по батькові
  if (middleName) {
    return `${lastName} ${firstName[0]}. ${middleName[0]}.`;
  }
  return `${lastName} ${firstName[0]}.`;
}

// 1.2. Rest (...objects) збирає всі передані об'єкти в масив,
// а spread (...obj) розгортає кожен з них в один новий об'єкт.
// reduce проходить по масиву і поступово "накладає" об'єкти один на одного,
// тому пізніші властивості перезаписують попередні.
function mergeObjects(...objects) {
  return objects.reduce((acc, obj) => ({ ...acc, ...obj }), {});
}

// 1.3. flat() об'єднує масив масивів в один,
// Set автоматично викидає дублікати,
// а spread перетворює Set назад у звичайний масив.
function removeDuplicates(...arrays) {
  return [...new Set(arrays.flat())];
}

// 1.4. Повертаємо НОВИЙ об'єкт (оригінал не мутуємо).
// Спочатку копіюємо user, потім накладаємо updates,
// а вкладений address об'єднуємо окремо, щоб він злився, а не замінився повністю.
function createUpdatedUser(user, updates) {
  return {
    ...user,
    ...updates,
    address: { ...user.address, ...updates.address },
  };
}

// === Демонстрація ===
console.log("=== Завдання 1: Деструктуризація та Spread/Rest ===");

console.log(
  "1.1:",
  getFullName({
    firstName: "Петро",
    lastName: "Іванов",
    middleName: "Сергійович",
  }),
); // "Іванов П. С."
console.log("1.1:", getFullName({ firstName: "Анна", lastName: "Коваль" })); // "Коваль А."

console.log("1.2:", mergeObjects({ a: 1 }, { b: 2 }, { a: 3, c: 4 })); // { a: 3, b: 2, c: 4 }

console.log("1.3:", removeDuplicates([1, 2, 3], [2, 3, 4], [4, 5])); // [1, 2, 3, 4, 5]

const user = { name: "John", age: 25, address: { city: "Kyiv", zip: "01001" } };
const updated = createUpdatedUser(user, { age: 26, address: { zip: "02002" } });
console.log("1.4 updated:", updated); // { name: "John", age: 26, address: { city: "Kyiv", zip: "02002" } }
console.log("1.4 оригінал не змінився:", user);
