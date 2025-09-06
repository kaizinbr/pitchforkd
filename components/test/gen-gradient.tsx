import chroma from "chroma-js";

type ExtractedColor = {
    hex: string;
    red: number;
    green: number;
    blue: number;
    hue: number;
    saturation: number;
    lightness: number;
};

export function getTextColor(bgColor: string): string {
    const contrastWithWhite = chroma.contrast(bgColor, "#fff");
    // W3C recommends a contrast ratio of at least 4.5:1 for normal text
    if (contrastWithWhite >= 4.5) {
        return "#fff";
    }
    // If contrast with white is too low, use a dark gray or black
    return "#222";
}

export function generatePleasantGradient(colors: ExtractedColor[]): string[] {
    if (colors.length === 0) {
        // fallback
        return ["background: #222"];
    }

    const dominant = chroma(colors[0].hex);

    // Variação análoga
    const analog = dominant.set("hsl.h", `+30`);
    // Variação escura com mesmo matiz
    const darker = dominant.darken(1.5);

    // Interpolação suave no espaço LCH
    const gradientScale = chroma
        .scale([dominant, colors[1].hex])
        .mode("lch")
        .colors(3);

    return gradientScale;
}

export function reduceAlpha(color: string, alpha: number): string {
    return chroma(color).alpha(alpha).css();
}

export function darkenColor(color: string, amount: number): string {
    return chroma(color).darken(amount).css();
}

export function lightenColor(color: string, amount: number): string {
    return chroma(color).brighten(amount).css();
}

export function getMostSaturatedColor(palette: number[][]): string | null {
    // Filter out colors too close to white or black
    const filtered = palette.filter(([r, g, b]) => {
        const chromaColor = chroma(r, g, b);
        const [h, s, l] = chromaColor.hsl();
        // Exclude if lightness is too high (near white) or too low (near black)
        return l > 0.15 && l < 0.85 && s > 0.15;
    });

    if (filtered.length === 0) return null;

    // Find the color with the highest saturation
    let maxSaturation = -1;
    let mostSaturated: number[] = filtered[0];

    for (const rgb of filtered) {
        const s = chroma(rgb as [number, number, number]).hsl()[1];
        if (s > maxSaturation) {
            maxSaturation = s;
            mostSaturated = rgb;
        }
    }

    let color = chroma(mostSaturated as [number, number, number]);
    // Ensure contrast with white is at least 4.5:1
    while (chroma.contrast(color, "#fff") < 4.5) {
        color = color.darken(2);
        // Prevent infinite loop: stop if color is almost black
        if (color.luminance() < 0.05) break;
    }

    return color.css();
}