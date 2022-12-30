import { useEffect, useRef, useState } from 'react';

import { FormElement, Input } from '@nextui-org/react';
import { useIsClient, useUpdateEffect } from 'usehooks-ts';

import { useItemTableContext } from '../../hooks/useItemTableContext';
import SearchIcon from '../Icons/Search';

export const TableSearch = () => {
  const isClient = useIsClient();
  const inputRef = useRef<FormElement>(null);
  const { table, setColumnFilters } = useItemTableContext();
  const previousInputValue = table.getState().columnFilters.find(filter => filter.id === 'name')?.value as string;
  // const [inputVisible, setInputVisible] = useState(previousInputValue && true);

  // useUpdateEffect(() => {
  //   if (inputVisible) {
  //     inputRef.current?.focus();
  //   }
  // }, [inputVisible]);

  useUpdateEffect(() => {
    if (!inputRef.current?.value) return;
    inputRef.current.value = '';
  }, [JSON.stringify(table.getState().columnFilters.filter(filter => filter.id !== 'name'))]);

  const changeHandler = () => {
    setColumnFilters(prev => [
      ...prev.filter(filter => filter.id !== 'name'),
      { id: 'name', value: inputRef.current?.value },
    ]);
  };

  return isClient ? (
    <Input
      aria-label="Filter items"
      placeholder="Filter items"
      contentLeft={<SearchIcon />}
      animated={false}
      ref={inputRef}
      onChange={changeHandler}
      initialValue={previousInputValue}
      clearable
    />
  ) : null;
  // : (
  //   <button
  //     onClick={() => {
  //       setInputVisible(true);
  //     }}
  //   >
  //     <SearchIcon />
  //   </button>
  // );
};
