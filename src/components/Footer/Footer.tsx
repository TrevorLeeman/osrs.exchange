import Link from 'next/link';

const Footer = () => (
  <footer className="mt-12 flex items-center justify-center pb-3">
    <ul className="text-sm">
      <li>
        <Link href="/attribution" className="hover:underline">
          Attribution
        </Link>
      </li>
    </ul>
  </footer>
);

export default Footer;
