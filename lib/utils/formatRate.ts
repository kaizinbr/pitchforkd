export default function formatRate(total: number) {
    console.log("Formatting rate:", total);
    return `${Number.isInteger(total) ? total : total.toFixed(1)}/100`;
}