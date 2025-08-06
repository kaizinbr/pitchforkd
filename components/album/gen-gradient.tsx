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