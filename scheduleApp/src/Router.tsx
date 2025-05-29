import { createBrowserRouter } from 'react-router';
import App from './App.tsx';


const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <div className="text-red-500 p-4">頁面發生錯誤</div>,
  },
])


export default router