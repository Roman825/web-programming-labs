// task-4.ts — Наслідування та поліморфізм
export {};

// 4.1. Абстрактний клас не можна інстанціювати безпосередньо —
// тільки через нащадків, які зобов'язані реалізувати send().
// protected readonly name — нащадки бачать поле, але змінити не можуть.
abstract class BaseNotifier {
  constructor(protected readonly name: string) {}

  // Абстрактний метод — лише сигнатура, без реалізації.
  // Кожен нащадок реалізує його по-своєму (поліморфізм).
  abstract send(to: string, subject: string, body: string): void;

  // Шаблонний метод: обгортає виклик send() спільною логікою —
  // лог до і після. Підкласам не треба це дублювати.
  notify(to: string, subject: string, body: string): void {
    console.log(`[${this.name}] Надсилання сповіщення...`);
    this.send(to, subject, body);
    console.log(`[${this.name}] Сповіщення надіслано`);
  }
}

// 4.2. Email-нотифікатор. private readonly через parameter property
// одночасно оголошує і поле smtpServer, і присвоює йому значення.
class EmailNotifier extends BaseNotifier {
  constructor(private readonly smtpServer: string) {
    super("Email"); // обов'язково викликаємо конструктор батька
  }

  send(to: string, subject: string, body: string): void {
    const preview = body.length > 50 ? body.slice(0, 50) + "..." : body;
    console.log(
      `📧 Email → ${to}: "${subject}" | Тіло: ${preview} через ${this.smtpServer}`,
    );
  }
}

// 4.3. SMS-нотифікатор. Значення за замовчуванням для prefix — "+380".
class SmsNotifier extends BaseNotifier {
  constructor(private readonly phonePrefix: string = "+380") {
    super("SMS");
  }

  send(to: string, _subject: string, body: string): void {
    // SMS зазвичай обмежені 160 символами
    const preview = body.length > 160 ? body.slice(0, 160) : body;
    console.log(`📱 SMS → ${this.phonePrefix}${to}: "${preview}"`);
  }
}

// 4.4. Поліморфна функція: приймає масив BaseNotifier, але всередині
// для кожного виклику виконається send() конкретного нащадка.
function sendBulkNotification(
  notifiers: BaseNotifier[],
  to: string,
  subject: string,
  body: string,
): void {
  for (const notifier of notifiers) {
    notifier.notify(to, subject, body);
  }
}

// === Демонстрація ===
console.log("=== Завдання 4: Наслідування та поліморфізм ===");

const notifiers: BaseNotifier[] = [
  new EmailNotifier("smtp.gmail.com"),
  new SmsNotifier(),
];

sendBulkNotification(
  notifiers,
  "user@example.com",
  "Нова задача призначена",
  "Вам призначено задачу 'Розробити API' з пріоритетом high. Дедлайн: 01.02.2025",
);
