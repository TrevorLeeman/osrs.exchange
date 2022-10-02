import type { NextPage } from 'next';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import ItemTable from '../src/components/ItemTable/ItemTable';

const Home: NextPage = () => <ItemTable />;

export const getServerSideProps = async () => {
  const queryClient = new QueryClient();

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default Home;
