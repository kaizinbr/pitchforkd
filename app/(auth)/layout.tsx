type Props = {
    children: React.ReactNode;
};

export const metadata = {
    title: "Entrar | Pitchforkd - Avalie álbuns de música",
    description: "Avalie álbuns de música e veja o que a comunidade acha deles",
};

export default async function AuthLayout({ children }: Props) {
    return (
        <div className="flex flex-col items-center relative max-w-2xl w-full">{children}</div>
    );
}
