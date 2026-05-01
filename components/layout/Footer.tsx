import Link from 'next/link'
import { Crown, Twitter, Youtube, Instagram, Github } from 'lucide-react'

const footerLinks = {
  Platform: [
    { label: 'Courses', href: '/courses' },
    { label: 'Puzzle Trainer', href: '/puzzles' },
    { label: 'Leaderboard', href: '/leaderboard' },
    { label: 'Pricing', href: '#pricing' },
  ],
  Learn: [
    { label: 'Openings', href: '/courses?category=openings' },
    { label: 'Tactics', href: '/courses?category=tactics' },
    { label: 'Endgames', href: '/courses?category=endgame' },
    { label: 'Strategy', href: '/courses?category=strategy' },
  ],
  Company: [
    { label: 'About', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Careers', href: '/careers' },
    { label: 'Contact', href: '/contact' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Refund Policy', href: '/refund' },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#080810]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-[#D4AF37] to-[#A8872A] rounded-lg flex items-center justify-center">
                <span className="text-black font-black text-lg">♛</span>
              </div>
              <span className="font-black text-lg">
                <span className="gold-text">Chess</span>
                <span className="text-white">Academy</span>
              </span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">
              The world&apos;s most advanced chess improvement platform. Train like a grandmaster.
            </p>
            <div className="flex items-center gap-3">
              {[Twitter, Youtube, Instagram, Github].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/[0.08] transition-all">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-white font-semibold text-sm mb-4">{section}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-white/[0.06] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-sm">
            &copy; {new Date().getFullYear()} ChessAcademy Pro. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-gray-600 text-sm">Trusted by 50,000+ chess players worldwide</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
