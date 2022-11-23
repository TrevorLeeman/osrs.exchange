import type { NextPage } from 'next';

import H1 from '../../src/components/Common/H1';
import LinkBlue from '../../src/components/Common/LinkBlue';

const Attribution: NextPage = () => (
  <div className="flex flex-col gap-6">
    <div>
      <H1>Attribution</H1>
      <p className="text-gray-500">This Site is Powered by Creative Commons and MIT Resources</p>
    </div>
    <ul>
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
  // Sort Asc SVG Vector - https://www.svgrepo.com/svg/389434/sort-asc
  // Sort Up SVG Vector - https://www.svgrepo.com/svg/348484/sort-up
);

export default Attribution;
