// task-4.js — async/await та Promises

// 4.1. Обгортаємо setTimeout у Promise:
// resolve викличеться через ms мілісекунд, і await "відпустить" виконання далі
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// 4.2. Симуляція мережевого запиту з випадковою затримкою 200–500мс.
// Невалідний URL — одразу reject; валідний — 70% успіх / 30% "падіння сервера".
function simulateFetch(url) {
  return new Promise((resolve, reject) => {
    const randomDelay = 200 + Math.random() * 300;
    setTimeout(() => {
      if (!url.startsWith("https")) {
        reject(new Error(`Invalid URL: ${url}`));
      } else if (Math.random() < 0.7) {
        resolve({ url, status: 200, data: "OK" });
      } else {
        reject(new Error("Server error: 500"));
      }
    }, randomDelay);
  });
}

// 4.3. Повторюємо запит до attempts разів.
// Якщо спроба впала — чекаємо 500мс і пробуємо знову.
// Якщо всі спроби вичерпані — прокидаємо останню помилку нагору.
async function fetchWithRetry(url, attempts) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    console.log(`Спроба ${attempt} з ${attempts}...`);
    try {
      return await simulateFetch(url);
    } catch (error) {
      lastError = error;
      console.log(`Спроба ${attempt} невдала: ${error.message}`);
      if (attempt < attempts) {
        await delay(500);
      }
    }
  }
  throw lastError;
}

// 4.4. Promise.allSettled запускає всі запити ПАРАЛЕЛЬНО
// і чекає завершення кожного (на відміну від Promise.all, не падає на першій помилці).
// Потім розкладаємо результати на успішні та невдалі.
async function fetchMultiple(urls) {
  const results = await Promise.allSettled(urls.map((url) => simulateFetch(url)));

  return {
    successful: results
      .filter((r) => r.status === "fulfilled")
      .map((r) => r.value),
    failed: results
      .filter((r) => r.status === "rejected")
      .map((r) => r.reason.message),
  };
}

// === Демонстрація ===
async function main() {
  console.log("=== Завдання 4: async/await ===");

  // 4.1
  console.time("delay");
  await delay(1000);
  console.timeEnd("delay"); // ~1000ms

  // 4.2
  try {
    const result = await simulateFetch(
      "https://jsonplaceholder.typicode.com/posts",
    );
    console.log("Успіх:", result);
  } catch (error) {
    console.error("Помилка:", error.message);
  }

  // 4.3 — retry для нестабільного сервера
  try {
    const result = await fetchWithRetry(
      "https://jsonplaceholder.typicode.com/posts",
      5,
    );
    console.log("fetchWithRetry результат:", result);
  } catch (error) {
    console.error("Всі спроби невдалі:", error.message);
  }

  // 4.4
  const results = await fetchMultiple([
    "https://jsonplaceholder.typicode.com/posts",
    "http://invalid-url",
    "https://jsonplaceholder.typicode.com/users",
  ]);
  console.log("Результати:", results);
}

main();
