import type { NextPage } from 'next';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import ItemTable from '../src/components/ItemTable/ItemTable';
import { ItemTableProvider } from '../src/components/ItemTable/ItemTableProvider';

const Home: NextPage = () => (
  <ItemTableProvider>
    <ItemTable />
  </ItemTableProvider>
);

export const getServerSideProps = async () => {
  const queryClient = new QueryClient();

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default Home;
