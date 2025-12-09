import Link from 'next/link';
import Image from 'next/image';

export default function BrandingFooter() {
  return (
    <footer className="w-full py-8 mt-auto border-t border-border bg-muted">
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center">
        <p className="mb-3 uppercase tracking-wider" style={{ fontSize: '10px', color: '#888' }}>
          Powered by
        </p>
        <Link
          href="https://www.actualsize.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:opacity-80 transition-opacity"
        >
          <Image
            src="/actual-size-logo.svg"
            alt="Actual Size"
            width={240}
            height={174}
            className="h-16 w-auto"
          />
        </Link>
        <div className="mt-4 flex items-center gap-3 text-xs" style={{ color: '#888' }}>
          <Link href="/terms" className="hover:text-white transition-colors">
            Terms of Service
          </Link>
          <span>•</span>
          <Link href="/privacy" className="hover:text-white transition-colors">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}