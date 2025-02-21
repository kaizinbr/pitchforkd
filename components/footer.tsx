import Link from 'next/link'

export default function Footer() {
    return (
        <footer className={`
                w-full bg-bunker-950 border-t border-bunker-700 
                text-bunker-300 text-xs text-center 
                flex flex-col items-center 
                p-5
            `}>
            <nav className="flex flex-row flex-wrap gap-3 mb-3 max-w-2xl">
                <Link href="/about" className="hover:underline transition-all duration-200">Sobre</Link>
                <Link href="/help" className="hover:underline transition-all duration-200">Ajuda</Link>
                <Link href="/contact" className="hover:underline transition-all duration-200">Contato</Link>
            </nav>
            <p>© 2025 - All rights reserved</p>
        </footer>
    )
}