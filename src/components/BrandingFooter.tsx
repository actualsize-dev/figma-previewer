import Link from 'next/link';
import Image from 'next/image';

export default function BrandingFooter() {
  return (
    <footer className="w-full py-8 mt-auto border-t border-gray-200 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 flex flex-col items-center">
        <p className="text-gray-500 mb-3 uppercase tracking-wider" style={{ fontSize: '10px' }}>
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
      </div>
    </footer>
  );
}