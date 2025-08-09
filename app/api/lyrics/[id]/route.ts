import { NextResponse } from "next/server";
import { customAlphabet } from "nanoid";
import axios from "axios";
import { cookies } from "next/headers";



export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const id = (await params).id; 
    console.log(id);

    try {
        const response = await axios.get(
            `https://lyrics.kaizin.work/?trackid=${id}`
        );

        // console.log(response.data);

        return NextResponse.json(response.data);
    } catch (error) {
        console.error("Erro ao buscar letras:", error);

        
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            // Lógica para lidar com o erro 404 (Not Found)
            console.error("Faixa não encontrada");
            return NextResponse.json(
                { error: "Faixa não encontrada" },
                { status: 404 }
            );
        }


        return NextResponse.json(
            { error: "Erro ao buscar letras" },
            { status: 500 }
        );
    }
}
