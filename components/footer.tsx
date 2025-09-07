import Link from "next/link";

export default function Footer() {
    return (
        <footer
            className={`
                w-full bg-shark-950 border-t border-shark-700 
                text-shark-300 text-xs text-start md:text-center
                flex flex-col items-start 
                p-5 pb-20 gap-6
                
            `}
        >
            <nav className="flex flex-col md:flex-row items-start justify-center flex-wrap gap-2 w-full max-w-2xl mx-auto">
                {/* <span className=""></span> */}
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
                    Políticas de privacidade
                </Link>
                <Link
                    href="/about#privacidade"
                    className="hover:underline transition-all duration-200"
                >
                    LGPD
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
            <p className="max-w-2xl md:mx-auto">
                Algumas imagens e informações dispostas aqui pertencem ao
                Spotify.
            </p>
            <p className="max-w-2xl md:mx-auto">
                Este site não possui filiação com as empresas Spotify ou Letterboxd, tampouco
                utiliza as informações dispostas para fins comerciais.
            </p>
            <p className="max-w-2xl md:mx-auto">
                © 2025 - Feito por <Link href={'https://kaizin.work'} target="_blank" className="underline">Kaizin</Link> </p>
        </footer>
    );
}
