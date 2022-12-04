import type { NextPage } from 'next';

import { QueryClient, dehydrate } from '@tanstack/react-query';
import { motion } from 'framer-motion';

import { ItemTable } from '../src/components/ItemTable/ItemTable';
import { ItemTableProvider } from '../src/components/ItemTable/ItemTableProvider';
import ItemsPerPageDropdown from '../src/components/ItemTable/ItemsPerPageDropdown';
import TablePagination from '../src/components/ItemTable/TablePagination';

const itemTableVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.3 } },
};

const Home: NextPage = () => (
  <ItemTableProvider>
    <div className="flex flex-col justify-center">
      <div className="mb-4 flex flex-col-reverse items-center gap-4 md:grid md:grid-cols-3">
        <div className="col-start-2 place-self-center">
          <TablePagination />
        </div>
        <div className="md:col-start-3 md:place-self-end">
          <ItemsPerPageDropdown />
        </div>
      </div>
      <motion.div variants={itemTableVariants} initial="hidden" animate="show" className="mb-4">
        <ItemTable />
      </motion.div>
      <div className="mb-4 flex justify-center">
        <TablePagination />
      </div>
    </div>
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
