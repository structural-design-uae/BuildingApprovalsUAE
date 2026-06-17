interface BlogWhatsAppCTAProps {
  placement?: 'after-toc' | 'middle';
}

export default function BlogWhatsAppCTA({ placement = 'after-toc' }: BlogWhatsAppCTAProps) {
  return (
    <section className={`blog-whatsapp-cta blog-whatsapp-cta-${placement}`} aria-label="WhatsApp approval consultation">
      <div className="blog-whatsapp-cta-content">
        <div className="blog-whatsapp-cta-text">
          <span>Get started today</span>
          <h2>Start Your Approval Process</h2>
        </div>

        <a
          href="https://wa.me/971589575610"
          target="_blank"
          rel="noopener noreferrer"
          className="blog-whatsapp-cta-btn"
        >
          <svg viewBox="0 0 32 32" className="blog-whatsapp-cta-icon" aria-hidden="true">
            <path d="M16.01 3C8.83 3 3 8.83 3 16.01c0 2.29.6 4.53 1.74 6.5L3.1 29l6.67-1.57A12.95 12.95 0 0 0 16.01 29C23.19 29 29 23.19 29 16.01S23.19 3 16.01 3zm0 23.74c-2.02 0-3.99-.54-5.72-1.56l-.41-.24-3.96.93.95-3.86-.27-.43a10.73 10.73 0 0 1-1.63-5.67c0-5.94 4.84-10.78 10.79-10.78 5.94 0 10.78 4.84 10.78 10.78 0 5.95-4.84 10.83-10.53 10.83zm5.91-8.09c-.32-.16-1.9-.94-2.19-1.05-.29-.11-.5-.16-.71.16-.21.32-.82 1.05-1.01 1.26-.19.21-.37.24-.69.08-.32-.16-1.35-.5-2.57-1.59-.95-.85-1.59-1.9-1.78-2.22-.19-.32-.02-.49.14-.65.14-.14.32-.37.48-.56.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.71-1.72-.98-2.35-.26-.62-.52-.53-.71-.54h-.61c-.21 0-.56.08-.85.4-.29.32-1.12 1.1-1.12 2.67 0 1.57 1.15 3.09 1.31 3.3.16.21 2.27 3.46 5.5 4.86.77.33 1.37.53 1.84.68.77.24 1.47.21 2.02.13.62-.09 1.9-.78 2.17-1.53.27-.75.27-1.39.19-1.53-.08-.14-.29-.22-.61-.38z" />
          </svg>
          WhatsApp Us
        </a>
      </div>
    </section>
  );
}
