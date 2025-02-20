'use client'
 
import { useSearchParams } from 'next/navigation'

export default function ErrorPage() {
    const searchParams = useSearchParams()

    const code = searchParams.get('code')
    const message = searchParams.get('message')

    return (
        <div>
            <h1>Error {code}</h1>
            <p>{message}</p>
        </div>
    );
};
