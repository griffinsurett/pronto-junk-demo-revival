import { useEffect, useMemo, useRef, useState } from "react";
import Icon from "@/components/Icon";
import useAutoplay from "@/hooks/autoplay/useAutoplay";
import { usePauseableState } from "@/hooks/autoplay/usePauseableState";
import { useVisibility } from "@/hooks/animations/useVisibility";

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  rating: number;
}

export default function TestimonialCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  const total = testimonials.length;
  const [index, setIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const inView = useVisibility(containerRef, { threshold: 0.3 });

  const { isPaused, pause, engageUser, handleResumeActivity } = usePauseableState({
    resumeTriggers: ["hover-away"],
    resumeDelay: 4000,
  });

  useAutoplay({
    totalItems: total,
    currentIndex: index,
    setIndex,
    autoplayTime: 4500,
    enabled: inView && !isPaused,
  });

  const goPrev = () => {
    engageUser();
    pause();
    setIndex((i) => (i - 1 + total) % total);
  };
  const goNext = () => {
    engageUser();
    pause();
    setIndex((i) => (i + 1) % total);
  };
  const goTo = (i: number) => {
    if (i === index) return;
    engageUser();
    pause();
    setIndex(i);
  };

  return (
    <section
      ref={containerRef}
      style={{ background: "linear-gradient(180deg,#FFA800 0%, #000 100%)" }}
      className="py-16 lg:py-[70px]"
      onMouseEnter={() => { engageUser(); pause(); }}
      onMouseLeave={() => handleResumeActivity("hover-away")}
    >
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
        <h2 className="font-mont font-bold text-center text-[36px] lg:text-[45px] leading-[1.15] text-black">
          Hear From Our Customers
        </h2>

        <div className="mt-10 lg:mt-14 relative">
          {/* Track */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ width: `${total * 100}%`, transform: `translateX(-${(index * 100) / total}%)` }}
            >
              {testimonials.map((t, i) => (
                <div
                  key={i}
                  className="bg-white px-6 lg:px-16 py-12 lg:py-14 text-center"
                  style={{ width: `${100 / total}%` }}
                  data-carousel-item
                  data-active={i === index ? "true" : "false"}
                >
                  <div className="flex justify-center text-black" aria-hidden="true">
                    <Icon icon="fa6:quote-left" size="xl" />
                  </div>

                  <div className="mt-4 flex justify-center gap-1 text-primary" aria-label={`Rated ${t.rating} of 5`}>
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Icon key={j} icon="fa6:star" size="lg" />
                    ))}
                  </div>

                  <p className="mt-6 font-sans text-[18px] leading-[27px] text-[#333] max-w-3xl mx-auto">{t.quote}</p>
                  <p className="mt-5 font-sans font-medium text-[18px] text-[#333]">{t.name}</p>
                  <p className="mt-1 font-sans text-[16px] text-[#333]/80">{t.role}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Arrows */}
          <button
            onClick={goPrev}
            aria-label="Previous testimonial"
            className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 lg:w-[50px] lg:h-[50px] bg-black text-white grid place-items-center hover:bg-neutral-800 transition-colors z-10"
          >
            <Icon icon="fa6:chevron-left" size="md" />
          </button>
          <button
            onClick={goNext}
            aria-label="Next testimonial"
            className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-12 h-12 lg:w-[50px] lg:h-[50px] bg-black text-white grid place-items-center hover:bg-neutral-800 transition-colors z-10"
          >
            <Icon icon="fa6:chevron-right" size="md" />
          </button>
        </div>

        {/* Dots */}
        <nav className="mt-6 flex justify-center gap-3" aria-label="Testimonial pagination">
          {testimonials.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to testimonial ${i + 1}`}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                i === index ? "bg-primary scale-[1.3]" : "bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </nav>
      </div>
    </section>
  );
}
