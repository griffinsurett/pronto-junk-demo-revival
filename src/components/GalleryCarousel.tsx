import { useState, useEffect, useCallback } from "react";
import Icon from "@/components/Icon";

interface GalleryItem {
  src: string;
  alt: string;
}

export default function GalleryCarousel({ items, title, description }: {
  items: GalleryItem[];
  title?: string;
  description?: string;
}) {
  const [spv, setSpv] = useState(3); // slides per view
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const update = () => {
      setSpv(window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1);
    };
    update();
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, []);

  const maxIndex = Math.max(0, items.length - spv);

  // Clamp when spv changes
  useEffect(() => {
    setIndex((i) => Math.min(i, maxIndex));
  }, [maxIndex]);

  const goTo = useCallback((i: number) => {
    setIndex(Math.max(0, Math.min(i, maxIndex)));
  }, [maxIndex]);

  // translateX: each slide is (100% / spv) wide, move by that amount per step
  const translatePct = (index / spv) * 100;

  return (
    <section className="py-16 lg:py-[50px] overflow-x-hidden">
      <div className="max-w-[1200px] mx-auto text-center">
        {title && (
          <h2 className="font-mont font-bold text-[36px] lg:text-[45px] leading-[1.1] lg:leading-[67.5px] text-black px-6 lg:px-12">
            {title}
          </h2>
        )}
        {description && (
          <p className="mt-4 font-rob text-[16px] leading-6 max-w-4xl mx-auto px-6 lg:px-12">{description}</p>
        )}

        <div className="mt-10 relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                // Total track width fits all items at their per-slide size
                width: `${(items.length / spv) * 100}%`,
                transform: `translateX(-${(index / items.length) * 100}%)`,
              }}
            >
              {items.map((item, i) => (
                <div
                  key={i}
                  className="flex-none"
                  style={{ width: `${100 / items.length}%` }}
                >
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="w-full aspect-[3/4] object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => goTo(index - 1)}
            disabled={index === 0}
            aria-label="Previous image"
            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 lg:w-12 lg:h-12 bg-black text-white grid place-items-center hover:bg-neutral-800 disabled:opacity-40 transition-opacity z-10"
          >
            <Icon icon="fa6:chevron-left" size="md" />
          </button>

          <button
            onClick={() => goTo(index + 1)}
            disabled={index >= maxIndex}
            aria-label="Next image"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 lg:w-12 lg:h-12 bg-black text-white grid place-items-center hover:bg-neutral-800 disabled:opacity-40 transition-opacity z-10"
          >
            <Icon icon="fa6:chevron-right" size="md" />
          </button>
        </div>

        {/* One dot per image — active set = currently visible window */}
        {items.length > spv && (
          <nav className="mt-6 flex justify-center gap-2 px-6 lg:px-12" aria-label="Gallery pagination">
            {items.map((_, i) => {
              const active = i >= index && i < index + spv;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => goTo(Math.min(i, maxIndex))}
                  aria-label={`Go to image ${i + 1}`}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    active
                      ? "bg-primary scale-[1.3]"
                      : "bg-black/20 hover:bg-black/40"
                  }`}
                />
              );
            })}
          </nav>
        )}
      </div>
    </section>
  );
}
