import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-[var(--color-border)]">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    {/* Brand Logo - Minimalist */}
                    <div className="flex-shrink-0 flex items-center gap-2">
                        <div className="w-6 h-6 bg-[var(--color-primary)] rounded-md flex items-center justify-center">
                            <span className="text-white font-bold text-xs">S</span>
                        </div>
                        <Link href="/" className="text-xl font-bold tracking-tight text-[var(--color-text-main)]">
                            Sprout
                        </Link>
                    </div>

                    <div className="flex items-center space-x-6">
                        <Link
                            href="/history"
                            className="text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] font-medium text-sm transition-colors"
                        >
                            History
                        </Link>

                        {/* Primary SaaS Button */}
                        <Link
                            href="/log"
                            className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                            Add Activity
                        </Link>
                    </div>

                </div>
            </div>
        </nav>
    );
}