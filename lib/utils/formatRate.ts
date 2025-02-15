export default function formatRate(total: number) {
    return `${Number.isInteger(total) ? total : total.toFixed(1)}/100`;
}