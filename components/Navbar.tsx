import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-[var(--color-border)]">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    <div className="flex-shrink-0 flex items-center gap-2">
                        <div className="w-7 h-7 bg-indigo-600 rounded-md flex items-center justify-center shadow-sm">
                            <span className="text-white font-bold text-sm">S</span>
                        </div>
                        <Link href="/" className="text-xl font-bold tracking-tight text-[var(--color-text-main)]">
                            Sprout
                        </Link>
                    </div>

                    <div className="flex items-center space-x-6">
                        <Link href="/history" className="text-[var(--color-text-muted)] hover:text-indigo-600 font-medium text-sm transition-colors">
                            History
                        </Link>

                        <Link href="/log" className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition-all">
                            Add Activity
                        </Link>
                    </div>

                </div>
            </div>
        </nav>
    );
}