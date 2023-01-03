import type { NextPage } from 'next';
import Head from 'next/head';

import H1 from '../../src/components/Common/H1';
import HorizontalPadding from '../../src/components/Common/HorizontalPadding';
import LinkThemed from '../../src/components/Common/LinkThemed';
import PageDescription from '../../src/components/Common/PageDescription';

const Attribution: NextPage = () => (
  <>
    <Head>
      <title>Attribution - OSRS Exchange</title>
    </Head>
    <HorizontalPadding>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-y-2">
          <H1>Attribution</H1>
          <PageDescription>This Site is Powered by Creative Commons and MIT Resources</PageDescription>
        </div>
        <ul>
          {/* <li>
        <LinkThemed href="https://www.svgrepo.com/svg/305616/arrow-back-outline">Arrow Back Outline SVG Vector</LinkThemed>
      </li> */}
          <li>
            <LinkThemed href="https://gfycat.com/celebratedunfitdolphin">Nieve OSRS Wave Gif</LinkThemed>
          </li>
          <li>
            <LinkThemed href="https://www.svgrepo.com/svg/332413/home">Home SVG Vector</LinkThemed>
          </li>
          <li>
            <LinkThemed href="https://www.svgrepo.com/svg/348484/sort-up">Sort Up SVG Vector</LinkThemed>
          </li>
          <li>
            <LinkThemed href="https://www.svgrepo.com/svg/348481/sort-down">Sort Down SVG Vector</LinkThemed>
          </li>
          <li>
            <LinkThemed href="https://www.svgrepo.com/svg/80323/down-arrow">Down Arrow SVG Vector</LinkThemed>
          </li>
          <li>
            <LinkThemed href="https://www.svgrepo.com/svg/71693/sun-bright">Sun Bright SVG Vector</LinkThemed>
          </li>
          <li>
            <LinkThemed href="https://www.svgrepo.com/svg/19740/crescent-moon-phase">
              Crescent Moon Phase SVG Vector
            </LinkThemed>
          </li>
          <li>
            <LinkThemed href="https://www.svgrepo.com/svg/64844/sort">Sort SVG Vector</LinkThemed>
          </li>
          <li>
            <LinkThemed href="https://www.svgrepo.com/svg/352041/filter">Filter SVG Vector</LinkThemed>
          </li>
          <li>
            <LinkThemed href="https://www.svgrepo.com/svg/33237/settings">Settings SVG Vector</LinkThemed>
          </li>
          <li>
            <LinkThemed href="https://www.svgrepo.com/svg/74282/search">Search SVG Vector</LinkThemed>
          </li>
          <li>
            <LinkThemed href="https://www.svgrepo.com/svg/378892/table-add-column">
              Table Add Column SVG Vector
            </LinkThemed>
          </li>
          <li>
            <LinkThemed href="https://www.svgrepo.com/svg/378932/arrow-revert">Arrow Revert SVG Vector</LinkThemed>
          </li>
        </ul>
      </div>
    </HorizontalPadding>
  </>
);

export default Attribution;
