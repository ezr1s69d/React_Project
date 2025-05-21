// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './index.css'
import router from './router.tsx'
import { TodoProvider } from './TodoContext.tsx'

createRoot(document.getElementById('root')!).render(
  <TodoProvider>
    <RouterProvider router={router} />
  </TodoProvider>
)
