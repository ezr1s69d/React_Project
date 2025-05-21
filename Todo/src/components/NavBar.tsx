import { useNavigate } from 'react-router-dom'

function NavBar() {
    const navigate = useNavigate();
    const routes = [
        { label: 'Home', path: '/' },
        { label: 'Todo List', path: '/todo'},
    ]
    const ButtonClass = "px-4 py-2 w-32 bg-stone-400 text-white rounded hovering:bg-stone-500 hover:scale-105 hover:shadow-md cursor-pointer transition-transform duration-300";
    
    return (
        <nav className='bg-gray-100 px-4 py-2'>
            <ul className='flex space-x-4'>
                {routes.map(route =>(
                    <li key={route.label} className={ButtonClass} onClick={() => navigate(route.path)}>
                        {route.label}
                    </li>
                ))}
            </ul>
        </nav>
    )
}

export default NavBar