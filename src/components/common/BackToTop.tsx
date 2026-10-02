import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

interface BackToTopProps {
  threshold?: number;
}

export const BackToTop: React.FC<BackToTopProps> = ({ threshold = 400 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > threshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // Initial check in case page starts scrolled
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      title="Back to top"
      className={`fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full bg-[#FFFFFF]/95 hover:bg-[#FFFFFF] border border-[#E4E1DA] hover:border-[#123C35] text-[#171A19] hover:text-[#123C35] shadow-md hover:shadow-lg flex items-center justify-center transition-all duration-300 ease-out cursor-pointer focus-visible:outline-2 focus-visible:outline-[#123C35] focus-visible:outline-offset-2 ${
        isVisible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <ArrowUp className="w-4 h-4 stroke-[2] transition-transform duration-200 group-hover:-translate-y-0.5" />
    </button>
  );
};
