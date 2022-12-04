import type { NextPage } from 'next';

import H1 from '../../src/components/Common/H1';
import LinkBlue from '../../src/components/Common/LinkBlue';
import PageDescription from '../../src/components/Common/PageDescription';

const Attribution: NextPage = () => (
  <div className="flex flex-col gap-6">
    <div>
      <H1>Attribution</H1>
      <PageDescription>This Site is Powered by Creative Commons and MIT Resources</PageDescription>
    </div>
    <ul>
      {/* <li>
        <LinkBlue href="https://www.svgrepo.com/svg/305616/arrow-back-outline">Arrow Back Outline SVG Vector</LinkBlue>
      </li> */}
      <li>
        <LinkBlue href="https://gfycat.com/celebratedunfitdolphin">Nieve OSRS Wave Gif</LinkBlue>
      </li>
      <li>
        <LinkBlue href="https://www.svgrepo.com/svg/332413/home">Home SVG Vector</LinkBlue>
      </li>
      <li>
        <LinkBlue href="https://www.svgrepo.com/svg/389434/sort-asc">Sort Asc SVG Vector</LinkBlue>
      </li>
      <li>
        <LinkBlue href="https://www.svgrepo.com/svg/348484/sort-up">Sort Desc SVG Vector</LinkBlue>
      </li>
      <li>
        <LinkBlue href="https://www.svgrepo.com/svg/80323/down-arrow">Down Arrow SVG Vector</LinkBlue>
      </li>
    </ul>
  </div>
);

export default Attribution;
