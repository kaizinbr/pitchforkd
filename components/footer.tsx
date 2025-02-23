import Link from "next/link";

export default function Footer() {
    return (
        <footer
            className={`
                w-full bg-bunker-950 border-t border-bunker-700 
                text-bunker-300 text-xs text-center 
                flex flex-col items-center 
                p-5 pb-20
            `}
        >
            <nav className="flex flex-row flex-wrap gap-3 mb-3 max-w-2xl">
                <Link
                    href="/about"
                    className="hover:underline transition-all duration-200"
                >
                    Sobre
                </Link>
                <Link
                    href="/about#ajuda"
                    className="hover:underline transition-all duration-200"
                >
                    Ajuda
                </Link>
                <Link
                    href="/about#privacidade"
                    className="hover:underline transition-all duration-200"
                >
                    Políticas de privacidade/LGPD
                </Link>
                <Link
                    href="/about#relatar"
                    className="hover:underline transition-all duration-200"
                >
                    Denunciar
                </Link>
                <Link
                    href="/about#contato"
                    className="hover:underline transition-all duration-200"
                >
                    Contato
                </Link>
            </nav>
            <p>
                Algumas imagens e informações dispostas aqui pertencem ao
                Spotify.
            </p>
            <p>
                Este site não possui filização com a empresa Spotify, tampouco
                utiliza as informações dispostas para fins comerciais.
            </p>
            <p>© 2025 - Feito por <Link href={'https://kaizin.com.br'} target="_blank" className="underline">Kaizin</Link> </p>
        </footer>
    );
}
