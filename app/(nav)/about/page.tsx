import Link from "next/link";

export const metadata = {
    title: "Sobre | Pitchforkd",
    description: "Avalie álbuns de música e veja o que a comunidade acha deles",
};

export default function About() {
    return (
        <div className="flex flex-col items relative px-5 pt-16 text-bunker-200 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-bunker-100">Sobre</h1>
            <p className="text-base mb-3">
                A <strong>Pitchforkd</strong> é uma plataforma para avaliação de
                álbuns de música. Aqui você pode avaliar álbuns, ver o que a
                comunidade acha deles e descobrir novos álbuns.
            </p>
            <p className="text-base mb-3">
                Todos os dados dos álbuns são obtidos através da Web API do{" "}
                <strong>Spotify</strong>, e qualquer pessoa pode criar uma conta
                para fazer suas avaliações, que são públicas para toda a
                comunidade. Se você gosta de música e quer compartilhar suas
                opiniões, o Pitchforkd é o lugar certo para você.
            </p>
            <h2 className="font-semibold text-lg text-bunker-100 mb-3">
                Nome e criação
            </h2>
            <p className="text-base mb-3">
                O nome <strong>Pitchforkd</strong> surgiu da junção das palavras
                Pitchfork, um site de crítica de música, e Letterboxd, um site
                de avaliação de filmes. A ideia é trazer a experiência de
                avaliar álbuns de música para um site com uma interface
                atrativa, simples e intuitiva.
            </p>
            <p className="text-base mb-3">
                A plataforma foi criada por{" "}
                <Link href="https://www.kaizin.com.br" target="_blank">
                    <strong className="underline">Kaio Nunes</strong>
                </Link>{" "}
                de maneira independente, apenas para fins de estudo e
                aprendizado. O código fonte do projeto está disponível no{" "}
                <Link
                    href="https://github.com/kaizinbr/pitchforkd"
                    target="_blank"
                >
                    <span className="underline">GitHub</span>
                </Link>
                .
            </p>
            <p className="text-base mb-3">
                O projeto foi criado utilizando várias tecnologias e
                bibliotecas, mas as principais são Next.Js, Tailwind CSS,
                TypeScript e Supabase.
            </p>
            <h2 className="font-semibold text-lg text-bunker-100 mb-3" id="privacidade">
                Políticas de privacidade
            </h2>
            <p className="text-base mb-3">
                A Pitchforkd coleta apenas os dados pessoais essenciais para
                criação dos perfis dos usuários. Os dados e imagens coletados
                são armazenados de forma segura e não são compartilhados com
                terceiros.
            </p>
            <p className="text-base mb-3">
                Para fazer login na plataforma, basta utilizar e-mail e senha. A
                senha é criptografada e não é armazenada em texto puro.
            </p>
            <p className="text-base mb-3">
                Caso encontre alguma falha de segurança ou tenha alguma dúvida
                sobre a privacidade dos seus dados, entre em contato através do
                e-mail{" "}
                <Link href="mailto:kaiolucas1812@gmail.com" target="_blank">
                    <strong className="underline">
                        kaiolucas1812@gmail.com
                    </strong>
                </Link>
                .
            </p>
            <h2 className="font-semibold text-lg text-bunker-100 mb-3" id="ajuda">
                Exclusão de conta e problemas de acesso
            </h2>
            <p className="text-base mb-3">
                Caso deseje excluir sua conta ou esteja enfrentando problemas
                para acessar sua área logada, entre em contato através do e-mail{" "}
                <Link href="mailto:kaiolucas1812@gmail.com" target="_blank">
                    <strong className="underline">
                        kaiolucas1812@gmail.com
                    </strong>
                </Link>
                . A exclusão da conta é permanente e irreversível, e todos os
                dados associados à conta serão apagados.
            </p>
            <p className="text-base mb-3">
                A exclusão da conta inclui todos os dados pessoais, como nome,
                e-mail, senha e imagem de perfil. Além disso, todas as
                avaliações e curtidas feitas pela conta serão removidas da
                plataforma.
            </p>
            <p className="text-base mb-3">
                As informçãos relacionadas diretamente aos álbuns, músicas e
                artistas não podem ser removidas, pois fazem parte da base de
                dados do Spotify, não são provenientes da plataforma.
            </p>
            <h2 className="font-semibold text-lg text-bunker-100 mb-3" id="relatar">
                Questões legais
            </h2>
            <p className="text-base mb-3">
                A Pitchforkd não se responsabiliza por conteúdos postados por
                usuários, como avaliações, comentários e imagens de perfil. A
                plataforma é um espaço aberto para a comunidade compartilhar
                suas opiniões e experiências.
            </p>
            <p className="text-base mb-3">
                Contudo, a Pitchforkd se reserva o direito de remover conteúdos
                que violem as regras da comunidade, como conteúdos ofensivos,
                discriminatórios, impróprios ou que violem direitos autorais.
            </p>
            <p className="text-base mb-3">
                Para relatar esses conteúdos, entre em contato através do e-mail{" "}
                <Link href="mailto:kaiolucas1812@gmail.com" target="_blank">
                    <strong className="underline">
                        kaiolucas1812@gmail.com
                    </strong>
                </Link>
                . Sinta-se livre para descrever toda a situação e enviar{" "}
                <i>links</i> ou imagens.
            </p>
            <p className="text-base mb-3">
                A Pitchforkd não possui relação alguma com as
                empresas/plataformas citadas acima, tampouco com as marcas e
                produtos associados a elas. A plataforma é um projeto
                independente e sem fins lucrativos.
            </p>
            <h2 className="font-semibold text-lg text-bunker-100 mb-3" id="contato">
                Contato
            </h2>
            <p className="text-base mb-3">
                Para entrar em contato com o criador da plataforma para remoção
                de algum conteúdo, LGPD ou algum motivo específico, envie um
                e-mail para{" "}
                <Link href="mailto:kaiolucas1812@gmail.com" target="_blank">
                    <strong className="underline">
                        kaiolucas1812@gmail.com
                    </strong>
                </Link>
                .
            </p>
        </div>
    );
}
