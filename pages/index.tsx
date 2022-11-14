import type { NextPage } from 'next';
import Head from 'next/head';

import { QueryClient, dehydrate } from '@tanstack/react-query';

import ItemTable from '../src/components/ItemTable/ItemTable';
import { ItemTableProvider } from '../src/components/ItemTable/ItemTableProvider';
import ItemsPerPageDropdown from '../src/components/ItemTable/ItemsPerPageDropdown';
import TablePagination from '../src/components/ItemTable/TablePagination';

const Home: NextPage = () => {
  return (
    <ItemTableProvider>
      <Head>
        <title>Testing</title>
      </Head>
      <div className="flex flex-col justify-center px-4">
        <div className="mb-4 flex flex-col-reverse items-center gap-4 md:grid md:grid-cols-3">
          <div className="col-start-2 place-self-center">
            <TablePagination />
          </div>
          <div className="md:col-start-3 md:place-self-end">
            <ItemsPerPageDropdown />
          </div>
        </div>
        <div className="mb-4">
          <ItemTable />
        </div>
        <div className="mb-4 flex justify-center">
          <TablePagination />
        </div>
      </div>
    </ItemTableProvider>
  );
};

export const getServerSideProps = async () => {
  const queryClient = new QueryClient();

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default Home;
