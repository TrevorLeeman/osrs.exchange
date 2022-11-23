import Link from 'next/link';

const Footer = () => (
  <footer className="mt-12  pb-3">
    <ul className="flex items-center justify-center gap-6 text-sm">
      {/* <li>
        <Link href="/attribution" className="hover:underline">
          Attribution
        </Link>
      </li> */}
      <li>Made with ❤ in Gielinor</li>
    </ul>
  </footer>
);

export default Footer;
