import Link from "next/link";
import { InstagramIcon, XIcon, YoutubeIcon } from "@/components/ui/SocialIcons";
import { Container } from "@/components/ui/Container";
import { Newsletter } from "@/components/home/Newsletter";

const columns = [
  {
    title: "Shop",
    links: [
      { label: "Running", href: "/shop?category=Running" },
      { label: "Basketball", href: "/shop?category=Basketball" },
      { label: "Lifestyle", href: "/shop?category=Lifestyle" },
      { label: "New Arrivals", href: "/shop?sort=new" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Careers", href: "/contact" },
      { label: "Press", href: "/contact" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Shipping & Returns", href: "/contact" },
      { label: "Size Guide", href: "/contact" },
      { label: "FAQ", href: "/#faq" },
      { label: "Track Order", href: "/contact" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border-subtle bg-bg-elevated">
      <Container className="py-16 lg:py-20">
        <Newsletter />

        <div className="mt-16 grid grid-cols-2 gap-10 border-t border-border-subtle pt-14 lg:grid-cols-5">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-black">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                  <path
                    d="M3 17L10 6L14 13L21 4"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="font-display text-xl font-extrabold uppercase tracking-tight">
                Velocity
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-fg-muted">
              Premium performance sneakers engineered for speed, comfort, and
              everyday style. Move beyond limits.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {[InstagramIcon, XIcon, YoutubeIcon].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social link"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border-subtle text-fg-muted transition-colors hover:border-brand hover:text-brand"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-bold uppercase tracking-widest text-fg-faint">
                {col.title}
              </h4>
              <ul className="mt-4 flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-fg-muted transition-colors hover:text-brand"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border-subtle pt-8 text-xs text-fg-faint sm:flex-row">
          <p>© {new Date().getFullYear()} Velocity Shoes, Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/contact" className="hover:text-fg-muted">
              Privacy Policy
            </Link>
            <Link href="/contact" className="hover:text-fg-muted">
              Terms of Service
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
