// src/components/HamburgerMenuDrawer.tsx

import { useEffect, useRef, useState } from "react";
import MobileMenuItem from "@/components/LoopComponents/Menu/MobileMenuItem";
import HamburgerButton from "./HamburgerButton";

interface MobileMenuDrawerProps {
  items: any[];
  className?: string;
  hamburgerTransform?: boolean;
  closeButton?: boolean;
}

export default function MobileMenuDrawer({
  items,
  className = "",
  hamburgerTransform = true,
  closeButton = false,
}: MobileMenuDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [menuTop, setMenuTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;
      if (!target || !containerRef.current) return;
      if (!containerRef.current.contains(target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    const updateMenuTop = () => {
      const header = document.querySelector("header");
      if (!header) return;
      const rect = header.getBoundingClientRect();
      setMenuTop(rect.bottom);
    };

    updateMenuTop();

    window.addEventListener("resize", updateMenuTop);
    window.addEventListener("scroll", updateMenuTop, { passive: true });

    return () => {
      window.removeEventListener("resize", updateMenuTop);
      window.removeEventListener("scroll", updateMenuTop);
    };
  }, []);

  const handleNavigate = () => {
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <HamburgerButton
        isOpen={isOpen}
        onChange={setIsOpen}
        hamburgerTransform={hamburgerTransform}
        ariaLabel={isOpen ? "Close menu" : "Open menu"}
        id="mobile-menu-toggle"
      />

      <div
        className={`fixed left-0 right-0 z-50 w-screen transform transition-all duration-200 ${
          isOpen
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0"
        }`}
        style={{ top: `${menuTop}px` }}
        aria-hidden={!isOpen}
      >
        <div className="bg-white shadow-xl border-t border-gray-200">
          {closeButton && (
            <div className="flex items-center justify-end bg-primary text-white px-6 py-4">
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/90 hover:text-white transition-colors"
                aria-label="Close menu"
                type="button"
              >
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 6L6 18M6 6l12 12"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          )}

          <nav
            className={`${className} max-h-[70vh] overflow-y-auto py-2`}
            aria-label="Mobile navigation"
          >
            <ul className="space-y-1">
              {items.map((item) => (
                <MobileMenuItem
                  key={item.slug || item.id}
                  {...item}
                  onNavigate={handleNavigate}
                />
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}
