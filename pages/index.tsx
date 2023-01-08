import type { NextPage } from 'next';

import { QueryClient, dehydrate } from '@tanstack/react-query';

import HorizontalPadding from '../src/components/Common/HorizontalPadding';
import CountdownToRefetch from '../src/components/ItemTable/CountdownToRefetch';
import { ItemTable } from '../src/components/ItemTable/ItemTable';
import { ItemTableProvider } from '../src/components/ItemTable/ItemTableProvider';
import TablePagination from '../src/components/ItemTable/TablePagination';
import { TableSearch } from '../src/components/ItemTable/TableSearch';
import { TableSettings } from '../src/components/ItemTable/TableSettings';

const Home: NextPage = () => (
  <ItemTableProvider>
    <HorizontalPadding>
      <div className="flex flex-col justify-center">
        <div className="mb-4 flex flex-col-reverse items-center gap-4 lg:grid lg:grid-cols-3">
          <div>
            <TableSearch />
          </div>
          <div className="col-start-2 place-self-center">
            <TablePagination />
          </div>
          <div className="flex flex-col items-center justify-center gap-4 lg:col-start-3 lg:flex-row lg:place-self-end">
            <CountdownToRefetch />
            <TableSettings />
          </div>
        </div>
        <div className="mb-4">
          <ItemTable />
        </div>
        <div className="mb-4 flex justify-center">
          <TablePagination />
        </div>
      </div>
    </HorizontalPadding>
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
