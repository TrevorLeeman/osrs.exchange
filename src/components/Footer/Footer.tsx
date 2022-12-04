import LinkBlue from '../Common/LinkBlue';

const Footer = () => (
  <footer className="mt-12  pb-3">
    <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
      <li>Made with ❤ in Gielinor</li>
      <li>
        <LinkBlue href="/attribution">Attribution</LinkBlue>
      </li>
    </ul>
  </footer>
);

export default Footer;
