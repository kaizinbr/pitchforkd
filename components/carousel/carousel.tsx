"use client";

import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
const ImageCarousel = () => {
    const [emblaRef] = useEmblaCarousel({
        loop: true,
        align: "center",
        skipSnaps: false,
    });
    const images = ["https://i.scdn.co/image/ab67616d0000b2739389aab1165b6498eba04d8e", "https://i.scdn.co/image/ab67616d0000b2739538990ec50c597ab78adfcf", "https://i.scdn.co/image/ab67616d0000b2732a40dc3ee1fc592ec0dce3a5", "https://i.scdn.co/image/ab67616d0000b2731fcabc8a98dd45fac3daf6ac"];
    return (
        <div className="embla" ref={emblaRef}>
            <div className="embla__container">
                {images.map((image, index) => (
                    <div key={index} className="embla__slide">
                        <Image
                            src={image}
                            alt={`Slide ${index + 1}`}
                            className="embla__slide__img"
                            height={300}    
                            width={300}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};
export default ImageCarousel;
