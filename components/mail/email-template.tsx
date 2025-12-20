import {
    Body,
    Button,
    Column,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Img,
    Link,
    Preview,
    Row,
    Section,
    Text,
    Tailwind,
} from "@react-email/components";

interface EmailTemplateProps {
    token: string;
}

export function EmailTemplate({ token }: EmailTemplateProps) {
    return (
        <div>
            <h1>Welcome, {token}!</h1>
        </div>
    );
}

export default function Email({ token }: EmailTemplateProps) {
    const previewText = `Seu código de acesso é: ${token}`;
    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Tailwind>
                <Body className="bg-white my-auto mx-auto font-sans">
                    <Container className="my-10 mx-auto p-5 w-[465px]">
                        {/* <Section className="mt-8">
                            <Img
                                src={`${baseUrl}/static/example-logo.png`}
                                width="80"
                                height="80"
                                alt="Logo Example"
                                className="my-0 mx-auto"
                            />
                        </Section> */}
                        <Heading className="text-2xl font-normal p-0 my-8 mx-0">
                            Seu código de acesso
                        </Heading>
                        <Text className="text-base">Olá,</Text>
                        <Text className="text-base">
                            Insira este código para continuar entrando sem uma
                            senha:
                        </Text>
                        <Section className="text-center my-4">
                            <Text className="text-center text-4xl font-bold my-4 py-2 px-4 border border-gray-300 rounded-md inline-block">
                                {token}
                            </Text>
                        </Section>
                        <Text className="text-base">
                            Esse código é válido por 10 minutos e só pode ser
                            usado uma vez. Ao inseri-lo, você também confirma o
                            endereço de e‑mail associado à sua conta.
                        </Text>
                        <Text className="text-base mt-4">
                            Se você não solicitou este código, pode ignorar este
                            e‑mail com segurança.
                        </Text>
                        <Text className="text-base mt-8">Atenciosamente,</Text>
                        <Text className="text-base">Equipe Kaizin</Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
}
