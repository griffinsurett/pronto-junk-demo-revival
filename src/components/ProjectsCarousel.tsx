import { useState, useEffect, useCallback } from "react";
import Icon from "@/components/Icon";

interface ProjectItem {
  title: string;
  location?: string;
  beforeImage?: string;
  afterImage?: string;
}

export default function ProjectsCarousel({ items, title }: {
  items: ProjectItem[];
  title?: string;
}) {
  const [spv, setSpv] = useState(3);
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

  useEffect(() => {
    setIndex((i) => Math.min(i, maxIndex));
  }, [maxIndex]);

  const goTo = useCallback((i: number) => {
    setIndex(Math.max(0, Math.min(i, maxIndex)));
  }, [maxIndex]);

  const translatePct = (index / items.length) * 100;

  return (
    <section
      id="projects"
      className="relative py-16 lg:py-[50px]"
      style={{ background: "url('/assets/projects-bg.jpg') center/cover no-repeat #000" }}
    >
      <div className="absolute inset-0 bg-black/80" />
      <div className="relative max-w-[1200px] mx-auto px-6 lg:px-12">
        {title && (
          <h2 className="font-mont font-bold text-center text-[36px] lg:text-[45px] leading-[1.1] lg:leading-[67.5px] text-white">
            {title}
          </h2>
        )}

        <div className="mt-12 relative">
          <div className="overflow-x-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                width: `${(items.length / spv) * 100}%`,
                transform: `translateX(-${translatePct}%)`,
              }}
            >
              {items.map((item, i) => (
                <div
                  key={i}
                  className="flex-none px-3 lg:px-4"
                  style={{ width: `${100 / items.length}%` }}
                >
                  <article className="bg-white overflow-hidden" style={{ boxShadow: "0 0 10px 0 rgba(0,0,0,0.5)" }}>
                    {item.beforeImage && (
                      <div className="relative aspect-[413/225] bg-neutral-200 shrink-0">
                        <img src={item.beforeImage} alt="Before" className="w-full h-full object-cover" loading="lazy" />
                        <span className="absolute top-0 left-0 bg-primary text-black font-rob font-medium text-[28px] lg:text-[31px] px-5 py-1">Before</span>
                      </div>
                    )}
                    {item.afterImage && (
                      <div className="relative aspect-[413/225] bg-neutral-200 shrink-0">
                        <img src={item.afterImage} alt="After" className="w-full h-full object-cover" loading="lazy" />
                        <span className="absolute bottom-0 right-0 bg-primary text-black font-rob font-medium text-[28px] lg:text-[30px] px-5 py-1">After</span>
                      </div>
                    )}
                    <div className="flex-1 px-6 pt-8 pb-10 text-center flex flex-col justify-center">
                      <h3 className="font-mont font-bold text-[25px] leading-[37.5px] text-[#333]">{item.title}</h3>
                      {item.location && (
                        <p className="mt-1 font-rob text-[16px] text-[#333]">{item.location}</p>
                      )}
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => goTo(index - 1)}
            disabled={index === 0}
            aria-label="Previous project"
            className="absolute -left-2 lg:-left-6 top-1/2 -translate-y-1/2 w-10 h-10 lg:w-12 lg:h-12 bg-black text-white grid place-items-center hover:bg-neutral-800 disabled:opacity-40 transition-opacity z-10"
          >
            <Icon icon="fa6:chevron-left" size="md" />
          </button>

          <button
            onClick={() => goTo(index + 1)}
            disabled={index >= maxIndex}
            aria-label="Next project"
            className="absolute -right-2 lg:-right-6 top-1/2 -translate-y-1/2 w-10 h-10 lg:w-12 lg:h-12 bg-black text-white grid place-items-center hover:bg-neutral-800 disabled:opacity-40 transition-opacity z-10"
          >
            <Icon icon="fa6:chevron-right" size="md" />
          </button>
        </div>

        {maxIndex > 0 && (
          <nav className="mt-6 flex justify-center gap-2" aria-label="Projects pagination">
            {Array.from({ length: maxIndex + 1 }, (_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to project ${i + 1}`}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  i === index ? "bg-primary scale-[1.3]" : "bg-white/30 hover:bg-white/60"
                }`}
              />
            ))}
          </nav>
        )}

        <div className="mt-12 flex justify-center">
          <a
            href="/projects"
            className="btn-yellow inline-flex items-center justify-center w-[209px] lg:w-[244px] h-[70px] rounded-md font-sans font-medium text-[20px]"
          >
            See More
          </a>
        </div>
      </div>
    </section>
  );
}
