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
        return NextResponse.json(
            { error: "ID não fornecido" },
            { status: 400 }
        );
    }

    while (attempts < maxAttempts) {
        try {
            const response = await axios.get(
                `https://lyrics.kaizin.work/?trackid=${id}`,
                { responseType: "text" }
            );

            let data = response.data;

            if (typeof data === "string") {
                const jsonStart = data.indexOf("{");
                if (jsonStart !== -1) {
                    const jsonString = data.slice(jsonStart);
                    try {
                        data = JSON.parse(jsonString);
                    } catch (parseError) {
                        attempts++;
                        continue;
                    }
                }
            }

            return NextResponse.json(data);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                return NextResponse.json(
                    { error: "Faixa não encontrada" },
                    { status: 404 }
                );
            }
            attempts++;
            if (attempts >= maxAttempts) {
                return NextResponse.json(
                    { error: "Erro ao buscar letras" },
                    { status: 500 }
                );
            }
        }
    }
    // Garante que sempre retorna uma resposta
    return NextResponse.json(
        { error: "Erro desconhecido" },

        { status: 500 }
    );
}
