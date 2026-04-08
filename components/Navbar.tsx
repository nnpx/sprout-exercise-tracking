import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/60 border-b border-[var(--color-brand-mint)] shadow-sm">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    {/* Brand Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="text-2xl font-bold text-[var(--color-brand-teal)] tracking-tight">
                            🌱 Sprout
                        </Link>
                    </div>

                    {/* Navigation Links */}
                    <div className="flex items-center space-x-6">
                        <Link
                            href="/history"
                            className="text-[var(--color-brand-teal)]/80 hover:text-[var(--color-brand-teal)] font-medium transition-colors"
                        >
                            History
                        </Link>

                        {/* Primary Action Button with Soft UI */}
                        <Link
                            href="/log"
                            className="bg-[var(--color-brand-mint)] text-[var(--color-brand-teal)] px-5 py-2.5 rounded-2xl font-medium shadow-[var(--shadow-soft)] hover:bg-[var(--color-brand-softTeal)] transition-all"
                        >
                            Add Activity
                        </Link>
                    </div>

                </div>
            </div>
        </nav>
    );
}