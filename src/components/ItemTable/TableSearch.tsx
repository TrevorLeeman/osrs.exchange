import { FormElement, Input } from '@nextui-org/react';
import { useIsClient } from 'usehooks-ts';

import { useItemTableContext } from '../../hooks/useItemTableContext';
import SearchIcon from '../Icons/Search';

export const TableSearch = () => {
  const isClient = useIsClient();
  const { table, setColumnFilters } = useItemTableContext();
  const inputValue = table.getState().columnFilters.find(filter => filter.id === 'name')?.value as string | undefined;

  const changeHandler = (e: React.ChangeEvent<FormElement>) => {
    setColumnFilters(prev => {
      const filters = prev.filter(filter => filter.id !== 'name');
      if (e.target?.value) {
        filters.push({ id: 'name', value: e.target.value });
      }
      return filters;
    });
  };

  return isClient ? (
    <Input
      aria-label="Filter items"
      placeholder="Filter items"
      contentLeft={<SearchIcon />}
      animated={false}
      onChange={changeHandler}
      value={inputValue}
      clearable
    />
  ) : null;
};
