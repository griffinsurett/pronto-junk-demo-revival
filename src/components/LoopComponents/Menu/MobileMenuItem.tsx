// src/components/LoopComponents/Menu/MobileMenuItem.tsx

import { useState } from "react";

interface MobileMenuItemProps {
  title: string;
  url?: string;
  slug: string;
  children?: any[];
  openInNewTab?: boolean;
  onNavigate: () => void;
  level?: number;
}

export default function MobileMenuItem({
  title,
  url,
  slug,
  children = [],
  openInNewTab = false,
  onNavigate,
  level = 0,
}: MobileMenuItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = children.length > 0;
  const indent = level * 16;

  if (hasChildren) {
    const hasUrl = Boolean(url);

    return (
      <li>
        <div
          className="flex items-center justify-between hover:bg-primary/10 transition-all duration-200"
          style={{ paddingLeft: `${indent + 24}px` }}
        >
          {hasUrl ? (
            <a
              href={url}
              onClick={onNavigate}
              target={openInNewTab ? "_blank" : undefined}
              rel={openInNewTab ? "noopener noreferrer" : undefined}
              className="flex-1 py-4 text-lg text-gray-700 hover:text-primary transition-colors"
            >
              {title}
            </a>
          ) : (
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex-1 py-4 text-left text-lg text-gray-700 hover:text-primary transition-colors"
            >
              {title}
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="pr-6 pl-3 py-4 text-gray-400 hover:text-primary transition-colors"
            aria-expanded={isExpanded}
            aria-controls={`mobile-submenu-${slug}`}
            aria-label={isExpanded ? `Collapse ${title}` : `Expand ${title}`}
            type="button"
          >
            <svg
              className={`w-5 h-5 transition-transform ${isExpanded ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>

        {isExpanded && (
          <ul id={`mobile-submenu-${slug}`} className="mt-1 space-y-1">
            {children.map((child) => (
              <MobileMenuItem
                key={child.slug || child.id}
                {...child}
                onNavigate={onNavigate}
                level={level + 1}
              />
            ))}
          </ul>
        )}
      </li>
    );
  }

  if (!url) return null;

  return (
    <li>
      <a
        href={url}
        onClick={onNavigate}
        target={openInNewTab ? "_blank" : undefined}
        rel={openInNewTab ? "noopener noreferrer" : undefined}
        className="px-6 py-4 text-lg text-gray-700 hover:bg-primary/10 hover:text-primary transition-all duration-200 flex items-center justify-between group"
        style={{ paddingLeft: `${indent + 24}px` }}
      >
        <span>{title}</span>
        <svg
          className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </a>
    </li>
  );
}
