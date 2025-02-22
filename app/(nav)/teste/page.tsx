import ImageCarousel from "@/components/carousel/carousel";
import EmblaCarousel from "@/components/carousel/embla-carousel";
import { EmblaOptionsType } from "embla-carousel";

const OPTIONS: EmblaOptionsType = { loop: true };
const SLIDE_COUNT = 5;
const SLIDES = Array.from(Array(SLIDE_COUNT).keys());
const images = [
    "https://i.scdn.co/image/ab67616d0000b2739389aab1165b6498eba04d8e",
    "https://i.scdn.co/image/ab67616d0000b2739538990ec50c597ab78adfcf",
    "https://i.scdn.co/image/ab67616d0000b2732a40dc3ee1fc592ec0dce3a5",
    "https://i.scdn.co/image/ab67616d0000b2731fcabc8a98dd45fac3daf6ac",
];

export default function Page() {
    return (
        <div className="w-full min-h-screen flex flex-col items-center justify-center pt-20 gap-8">
            <h1>Teste</h1>
            <ImageCarousel />
            <EmblaCarousel slides={images} options={OPTIONS} />
        </div>
    );
}
