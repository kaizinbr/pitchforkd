import { useState, useEffect } from "react";
import { Vibrant } from "node-vibrant/browser";

export default function useColors(url?: string) {
    const [colors, setColors] = useState({
        vibrant: "#ffffff",
        muted: "#ffffff",
        darkVibrant: "#222",
        darkMuted: "#222",
        lightVibrant: "#fff",
        lightMuted: "#fff",
        titleTextColor: "#222",
    });

    useEffect(() => {
        if (!url) return;
        Vibrant.from(url)
            .getPalette()
            .then((palette) => {
                setColors({
                    vibrant: palette.Vibrant?.hex ?? "#ffffff",
                    muted: palette.Muted?.hex ?? "#ffffff",
                    darkVibrant: palette.DarkVibrant?.hex ?? "#222",
                    darkMuted: palette.DarkMuted?.hex ?? "#222",
                    lightVibrant: palette.LightVibrant?.hex ?? "#fff",
                    lightMuted: palette.LightMuted?.hex ?? "#fff",
                    titleTextColor:
                        palette.Vibrant?.titleTextColor ?? "#222",

                });
            })
            .catch(() => {
                // fallback para cores padrão
                setColors({
                    vibrant: "#ffffff",
                    muted: "#ffffff",
                    darkVibrant: "#222",
                    darkMuted: "#222",
                    lightVibrant: "#fff",
                    lightMuted: "#fff",
                    titleTextColor: "#222",
                });
            });
    }, [url]);

    // console.log("Colors:", colors);

    return colors;
}
