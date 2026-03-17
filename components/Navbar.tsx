'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import SearchModal from './SearchModal';
import { useStore } from '@/lib/store';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();
  const logoImage = useStore((state) => state.content.logoImage);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHome = pathname === '/';

  const navLinks = [
    { name: 'Home', href: isHome ? '#home' : '/' },
    { name: 'About', href: isHome ? '#about' : '/#about' },
    { name: 'Staff Directory', href: isHome ? '#staff' : '/#staff' },
    { name: 'Events', href: '/events' },
    { name: 'Contact', href: isHome ? '#contact' : '/#contact' },
  ];

  const handleScrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (isHome && href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.substring(1);
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white shadow-md py-3' : 'bg-blue-900 text-white py-5'
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            {logoImage ? (
              <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden bg-white/10 flex-shrink-0">
                <Image src={logoImage} alt="Logo" fill className="object-cover" referrerPolicy="no-referrer" />
              </div>
            ) : null}
            <div className="font-bold text-xl md:text-2xl tracking-tight hidden sm:block">
              <span className={isScrolled ? 'text-blue-900' : 'text-white'}>CDES</span>
              <span className={isScrolled ? 'text-gray-600 text-sm ml-2' : 'text-blue-200 text-sm ml-2'}>
                Taraba State University
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={(e) => handleScrollToSection(e, link.href)}
                className={`text-sm font-medium transition-colors hover:text-blue-500 ${
                  isScrolled ? 'text-gray-700' : 'text-gray-100'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <button
              onClick={() => setIsSearchOpen(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                isScrolled
                  ? 'bg-blue-50 text-blue-900 hover:bg-blue-100'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Search size={18} />
              <span className="text-sm font-medium">Explore Careers by Course</span>
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={() => setIsSearchOpen(true)}
              className={`p-2 rounded-full ${isScrolled ? 'text-blue-900 bg-blue-50' : 'text-white bg-white/10'}`}
            >
              <Search size={20} />
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={isScrolled ? 'text-gray-900' : 'text-white'}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t border-gray-100 py-4 px-4 flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={(e) => handleScrollToSection(e, link.href)}
                className="text-gray-800 font-medium py-2 border-b border-gray-50"
              >
                {link.name}
              </Link>
            ))}
          </div>
        )}
      </nav>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
