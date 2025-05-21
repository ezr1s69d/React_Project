import { createBrowserRouter } from 'react-router-dom';
import HomePage from './pages/Homepage.tsx';
import TodoPage from './pages/TodoPage.tsx';
import DetailPage from './pages/DetailPage.tsx'


const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
    errorElement: <div className="text-red-500 p-4">頁面發生錯誤</div>,
  },
  {
    path: '/todo',
    element: <TodoPage />,
    errorElement: <div className="text-red-500 p-4">Todo 頁面出錯</div>,
  },
  {
    path: '/todos/:id',
    element: <DetailPage />,
    errorElement: <div className="text-red-500 p-4">找不到該項目或資料異常</div>,
  },
])


export default router