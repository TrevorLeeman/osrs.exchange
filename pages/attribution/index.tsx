import type { NextPage } from 'next';

import H1 from '../../src/components/Common/H1';
import LinkBlue from '../../src/components/Common/LinkBlue';

const Attribution: NextPage = () => (
  <div className="flex flex-col gap-6">
    <div>
      <H1>Attribution</H1>
      <p className="text-gray-500">This Site is Powered by Creative Commons Resources</p>
    </div>
    <ul className="text-">
      <li>
        <LinkBlue href="https://www.svgrepo.com/svg/305616/arrow-back-outline" target="_blank">
          Arrow Back Outline SVG Vector
        </LinkBlue>
      </li>
      <li>
        <LinkBlue href="https://www.svgrepo.com/svg/332413/home" target="_blank">
          Home SVG Vector
        </LinkBlue>
      </li>
    </ul>
  </div>
);

export default Attribution;
