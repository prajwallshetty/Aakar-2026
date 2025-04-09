export default function ComingSoon() {
    return (
        <div className="min-h-screen bg-gradient-to-b backdrop-blur-md bg-custom w-screen text-white flex flex-col justify-center">
            <main className="container mx-auto px-4 py-12 text-center">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6">
                        Coming Soon
                    </h1>
                    <p className="text-xl md:text-2xl mb-12 text-blue-200">
                        We're working hard to bring you something amazing.
                    </p>
                </div>
            </main>

            <footer className="py-6 text-center text-blue-300">
                <p>
                    &copy; {new Date().getFullYear()} Aakar 2025. All rights
                    reserved.
                </p>
            </footer>
        </div>
    );
}
