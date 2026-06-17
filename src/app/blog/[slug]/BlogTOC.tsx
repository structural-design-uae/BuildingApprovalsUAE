'use client';

import { useEffect, useRef, useState } from 'react';
import './blog-toc.css';

interface TocEntry {
  id: string;
  text: string;
}

export default function BlogTOC() {
  const [entries, setEntries] = useState<TocEntry[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  function scrollToHeading(id: string) {
    const heading = document.getElementById(id);
    if (!heading) return;

    const offset = 140;
    const top = heading.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: Math.max(top, 0), behavior: 'smooth' });
  }

  useEffect(() => {
    const contentEl = document.querySelector('.blog-post-content');
    if (!contentEl) return;

    const headings = Array.from(
      contentEl.querySelectorAll<HTMLElement>('.wp-content h2, .blog-content-wrapper h2')
    ).filter(heading => !heading.closest('.blog-whatsapp-cta'));

    const collected: TocEntry[] = headings.map((heading, i) => {
      if (!heading.id) {
        heading.id = `toc-heading-${i}`;
      }
      return {
        id: heading.id,
        text: heading.textContent?.trim() ?? '',
      };
    }).filter(e => e.text.length > 0);

    const entriesFrame = window.requestAnimationFrame(() => {
      setEntries(collected);
    });

    observerRef.current?.disconnect();
    observerRef.current = new IntersectionObserver(
      (obs) => {
        const visible = obs
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '0px 0px -60% 0px', threshold: 0 }
    );

    headings.forEach(h => observerRef.current!.observe(h));

    return () => {
      window.cancelAnimationFrame(entriesFrame);
      observerRef.current?.disconnect();
    };
  }, []);

  if (entries.length < 3) return null;

  return (
    <nav className="blog-toc" aria-label="Table of contents">
      <button
        type="button"
        className="blog-toc-toggle"
        aria-expanded={isOpen}
        aria-controls="blog-toc-list"
        onClick={() => setIsOpen(open => !open)}
      >
        <span>
          <span className="blog-toc-kicker">In this article</span>
          <span className="blog-toc-title">Table of Contents</span>
        </span>
        <svg
          className="blog-toc-toggle-icon"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M5 7.5L10 12.5L15 7.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {isOpen && (
        <ol id="blog-toc-list" className="blog-toc-list">
          {entries.map(entry => (
            <li
              key={entry.id}
              className={`blog-toc-item${activeId === entry.id ? ' active' : ''}`}
            >
              <a
                href={`#${entry.id}`}
                onClick={e => {
                  e.preventDefault();
                  scrollToHeading(entry.id);
                  setIsOpen(false);
                }}
              >
                {entry.text}
              </a>
            </li>
          ))}
        </ol>
      )}
    </nav>
  );
}
