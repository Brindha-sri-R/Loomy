import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import LoomyLogo from '../ui/LoomyLogo';

const SOCIAL_LINKS = [
  {
    label: 'Instagram',
    short: 'IG',
  },
  {
    label: 'TikTok',
    short: 'TT',
  },
  {
    label: 'X',
    short: 'X',
  },
  {
    label: 'YouTube',
    short: 'YT',
  },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const { showToast } = useStore();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    showToast(`Subscribed ${email} to Loomy drops`);
    setEmail('');
  };

  return (
    <footer className="relative overflow-hidden bg-[#0D0D0F] pt-16 text-white sm:pt-24">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-10">
        {/* Top Row: Newsletter + Columns */}
        <div className="grid grid-cols-1 gap-12 pb-16 lg:grid-cols-12">
          {/* Newsletter */}
          <div className="lg:col-span-5">
            <p className="text-[11px] font-semibold tracking-[0.16em] text-white/60 uppercase">
              NEWSLETTER
            </p>
            <h2 className="mt-3 max-w-sm text-3xl leading-[1.12] font-semibold tracking-[-0.03em] sm:text-4xl">
              Exclusive Deals for the Trendsetters
            </h2>

            <form
              onSubmit={handleSubscribe}
              className="mt-8 flex max-w-md items-center justify-between border-b border-dashed border-white/25 pb-3"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-transparent text-sm text-white placeholder-white/45 outline-none"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="ml-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[#111111] transition-transform hover:scale-105 active:scale-95"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            {/* Social Media Links */}
            <div className="mt-8 flex items-center gap-2.5">
              {SOCIAL_LINKS.map(({ label, short }) => (
                <a
                  key={label}
                  href={`#${label.toLowerCase()}`}
                  onClick={(e) => {
                    e.preventDefault();
                    showToast(`Follow @loomy.official on ${label}`);
                  }}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-[11px] font-bold tracking-wider text-white/75 transition-colors hover:border-[#7C8BFF] hover:bg-[#7C8BFF] hover:text-white"
                >
                  {short}
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          <div className="grid grid-cols-3 gap-6 sm:gap-10 lg:col-span-7 lg:pl-12">
            <div>
              <h3 className="text-xs font-semibold tracking-[0.14em] text-white/55 uppercase">
                COMPANY
              </h3>
              <ul className="mt-5 space-y-3 text-sm text-white/80">
                <li>
                  <Link to="/shop" className="hover:text-white">
                    About Loomy
                  </Link>
                </li>
                <li>
                  <Link to="/shop?gender=Men" className="hover:text-white">
                    Men&apos;s Edit
                  </Link>
                </li>
                <li>
                  <Link to="/shop?gender=Women" className="hover:text-white">
                    Women&apos;s Edit
                  </Link>
                </li>
                <li>
                  <Link to="/shop" className="hover:text-white">
                    Sustainability
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold tracking-[0.14em] text-white/55 uppercase">
                SHOP
              </h3>
              <ul className="mt-5 space-y-3 text-sm text-white/80">
                <li>
                  <Link to="/shop" className="hover:text-white">
                    New Arrivals
                  </Link>
                </li>
                <li>
                  <Link
                    to="/shop?category=Footwear"
                    className="hover:text-white"
                  >
                    Footwear
                  </Link>
                </li>
                <li>
                  <Link
                    to="/shop?category=Accessories"
                    className="hover:text-white"
                  >
                    Accessories
                  </Link>
                </li>
                <li>
                  <Link to="/shop" className="hover:text-white">
                    Gift Cards
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold tracking-[0.14em] text-white/55 uppercase">
                CUSTOMER CARE
              </h3>
              <ul className="mt-5 space-y-3 text-sm text-white/80">
                <li>
                  <Link to="/shop" className="hover:text-white">
                    Track Order
                  </Link>
                </li>
                <li>
                  <Link to="/shop" className="hover:text-white">
                    Returns
                  </Link>
                </li>
                <li>
                  <Link to="/shop" className="hover:text-white">
                    Shipping Info
                  </Link>
                </li>
                <li>
                  <Link to="/shop" className="hover:text-white">
                    FAQs
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Middle Divider & Meta Row */}
        <div className="grid grid-cols-1 gap-6 border-t border-white/15 py-8 text-xs text-white/60 sm:grid-cols-3 sm:items-center">
          <div>
            <LoomyLogo variant="light" size="sm" />
          </div>
          <p className="max-w-sm leading-relaxed text-white/70">
            Contemporary fashion crafted with sustainable materials and timeless
            silhouettes.
          </p>
          <div className="sm:text-right">
            © LOOMY.INC ALL RIGHTS RESERVED.
          </div>
        </div>
      </div>

      {/* Giant Repeating Brand Wordmark at Bottom Edge */}
      <div className="mt-4 overflow-hidden select-none">
        <div className="flex whitespace-nowrap text-[clamp(4.5rem,14vw,12rem)] leading-[0.82] font-extrabold tracking-[-0.05em] text-white">
          <span className="pr-8">Loomy.</span>
          <span className="pr-8">Loomy.</span>
          <span className="pr-8">Loomy.</span>
          <span className="pr-8">Loomy.</span>
        </div>
      </div>
    </footer>
  );
}
