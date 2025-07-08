import React, { useCallback } from "react";
import { EmblaOptionsType, EmblaCarouselType } from "embla-carousel";
import { DotButton, useDotButton } from "./EmblaCarouselDotButton";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { CarouselProps } from "@/types";
import { useRouter } from "next/navigation";
import Image from "next/image";
import LoaderSpinner from "./LoaderSpinner";

const Carousel = ({ fansLikeDetail }: CarouselProps) => {
  const router = useRouter();

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay()]);

  const onNavButtonClick = useCallback((emblaApi: EmblaCarouselType) => {
    const autoplay = emblaApi?.plugins()?.autoplay;
    if (!autoplay) return;

    const resetOrStop =
      autoplay.options.stopOnInteraction === false
        ? autoplay.reset
        : autoplay.stop;

    resetOrStop();
  }, []);

  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(
    emblaApi,
    onNavButtonClick
  );

  const slides =
    (fansLikeDetail &&
      fansLikeDetail?.filter((item: any) => item.totalPodcasts > 0)) ||
    [];

  if (!slides) return <LoaderSpinner />;

  return (
    <section
      className="flex w-full flex-col gap-4 overflow-hidden"
      ref={emblaRef}
    >
      <div className="flex">
        {slides.slice(0, 5).map((item: any) => (
          <figure
            className="relative mt-2.5 flex h-fit aspect-square w-full flex-none cursor-pointer flex-col justify-end rounded-xl border-none"
            key={item._id}
            onClick={() =>
              router.push(`/podcasts/${item.podcast[0]?.podcastId}`)
            }
          >
            <Image
              src={item.imageUrl}
              alt="card"
              className="absolute border-none size-full rounded-xl"
              fill
            />
            <div className="bg-[#121212a3] backdrop-blur-[37px] relative z-10 flex flex-col rounded-b-xl p-3">
              <h2 className="text-[14px] font-semibold text-white">
                {item.podcast[0]?.podcastTitle}
              </h2>
              <p className="text-[12px] font-normal text-[#FFFFFFB8] ">
                {item.name}
              </p>
            </div>
          </figure>
        ))}
      </div>

      <div className="embla__controls">
        <div className="embla__dots">
          <div className="flex justify-center items-center gap-2">
            {scrollSnaps.map((_, idx) => (
              <DotButton
                key={idx}
                selected={selectedIndex === idx}
                onClick={() => onDotButtonClick(idx)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Carousel;
