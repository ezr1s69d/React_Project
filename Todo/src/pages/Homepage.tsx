import NavBar from "../components/NavBar.tsx"

export default function HomePage() {
    return (
        <div className="text-center min-h-screen">
            <NavBar />
            <h1 className="text-3xl font-bold mb-4">Welcome to todo app!</h1>
            <p className="text-lg text-gray-600">please go /todo for more content</p>
        </div>
    )
}