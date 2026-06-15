import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App.tsx'

// Єдиний екземпляр QueryClient для всього застосунку —
// він зберігає кеш та керує станами запитів
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Повторні спроби при помилці: 1 раз (замість 3 за замовчуванням)
      retry: 1,
      // Вважаємо дані «свіжими» 30 секунд — не робимо зайвих запитів
      staleTime: 30_000,
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* QueryClientProvider дає всім дочірнім компонентам доступ до кешу */}
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)
