import type { NextPage } from 'next';

import React from 'react';

const Home: NextPage = ({ data }: any) => {
  return <main>{data}</main>;
};

export const getServerSideProps = async () => {
  return {
    props: {
      data: 'Hello world',
    },
  };
};

export default Home;
