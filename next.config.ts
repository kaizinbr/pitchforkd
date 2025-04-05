import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        unoptimized: true,
        domains: [
            "public.blob.vercel-storage.com",
            "i.scdn.co",
            "9cyzy13rz9rrcjlv.public.blob.vercel-storage.com",
            "lh3.googleusercontent.com",
        ],
        remotePatterns: [
            {
                protocol: "https",
                hostname: "public.blob.vercel-storage.com",
                port: "",
            },
            {
                protocol: "https",
                hostname: "i.scdn.co",
                port: "",
            },
            {
                protocol: "https",
                hostname: "9cyzy13rz9rrcjlv.public.blob.vercel-storage.com",
                port: "",
            },
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
                port: "",
            },
        ],
    },
    compiler: {
        removeConsole:
            process.env.NODE_ENV === "production"
                ? { exclude: ["error", "warn"] }
                : false,
    },
};

export default nextConfig;
