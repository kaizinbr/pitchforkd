import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const id = (await params).id;

    let attempts = 0;
    const maxAttempts = 2;

    if (!id) {
        // Retorne uma resposta de erro, nunca undefined
        return NextResponse.json(
            { error: "ID não fornecido" },
            { status: 400 }
        );
    }

    while (attempts < maxAttempts) {
        try {
            const response = await axios.get(
                `https://lyrics.kaizin.work/?trackid=${id}`,
                { responseType: "text" } // Força resposta como texto
            );

            let data = response.data;

            // Se não for JSON puro, tenta extrair o JSON do final da string
            if (typeof data === "string") {
                const jsonStart = data.indexOf("{");
                if (jsonStart !== -1) {
                    const jsonString = data.slice(jsonStart);
                    try {
                        data = JSON.parse(jsonString);
                    } catch (parseError) {
                        // Se falhar, tenta novamente (retry)
                        attempts++;
                        continue;
                    }
                }
            }

            return NextResponse.json(data);
        } catch (error) {
            // Se for erro 404, retorna imediatamente
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                return NextResponse.json(
                    { error: "Faixa não encontrada" },
                    { status: 404 }
                );
            }
            // Se for outro erro, tenta novamente (retry)
            attempts++;
            if (attempts >= maxAttempts) {
                return NextResponse.json(
                    { error: "Erro ao buscar letras" },
                    { status: 500 }
                );
            }
        }
    }
}
