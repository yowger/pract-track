export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center h-screen space-y-4">
            <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
            <p>The page you are looking for does not exist.</p>
            <a href="/" className="text-blue-600 hover:underline">
                Go back home
            </a>
        </div>
    )
}
