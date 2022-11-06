import { Dispatch, SetStateAction, useState } from 'react';

import { useRouter } from 'next/router';

import { Card, Grid, Input, Spacer } from '@nextui-org/react';
import { QueryFunction, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { UseComboboxGetItemPropsOptions, useCombobox } from 'downshift';
import { useDebounce } from 'usehooks-ts';

import type { BasicItem } from '../../db/items';
import ItemIcon from '../ItemIcon/ItemIcon';

type SearchItem = Pick<BasicItem, 'id' | 'name' | 'icon'>;

type AutocompleteItemProps = {
  item: SearchItem;
  index: number;
  highlightedIndex: number;
  getItemProps: (options: UseComboboxGetItemPropsOptions<SearchItem>) => any;
};

const fetchAutocompleteList: QueryFunction<SearchItem[]> = async ({ queryKey }) => {
  const [_key, { inputValue }] = queryKey as [string, { inputValue: string }];
  if (!inputValue) return [];

  return axios
    .get<{ items: SearchItem[] }>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/item_search/${inputValue}`)
    .then(res => res.data.items);
};

const useAutocompleteList = ({
  inputValue,
  setItems,
}: {
  inputValue: string;
  setItems: Dispatch<SetStateAction<SearchItem[]>>;
}) => {
  return useQuery<SearchItem[]>(['autocomplete', { inputValue }], fetchAutocompleteList, {
    initialData: [],
    onSuccess(data) {
      setItems(() => data);
    },
  });
};

const Search = () => {
  const router = useRouter();
  const [items, setItems] = useState<SearchItem[]>([]);

  const {
    inputValue,
    setInputValue,
    isOpen,
    highlightedIndex,
    getMenuProps,
    getItemProps,
    getInputProps,
    getComboboxProps,
  } = useCombobox({
    items,
    onSelectedItemChange(changes) {
      router.push(`/item/${changes.selectedItem?.id}`);
      setInputValue('');
    },
    itemToString(item) {
      return item ? item.name : '';
    },
    defaultHighlightedIndex: 0,
  });

  const debouncedSearch = useDebounce(inputValue, 100);

  const {
    data: autocompleteList,
    isLoading: autocompleteListIsLoading,
    isFetching: autocompleteListIsFetching,
  } = useAutocompleteList({ inputValue: debouncedSearch, setItems });

  return (
    <div className="relative w-full">
      <div {...getComboboxProps()}>
        <Input
          placeholder="Search for an item"
          aria-label="Item search"
          type="search"
          autoComplete="false"
          css={{ width: '100%' }}
          onClearClick={() => setItems(() => [])}
          clearable
          {...getInputProps()}
        />
      </div>
      <Card as="ul" className="absolute z-[300] m-0 max-h-[250px] w-full overflow-y-auto" {...getMenuProps()}>
        {isOpen &&
          items.map((item, index) => (
            <AutocompleteItem
              key={item.id}
              item={item}
              index={index}
              highlightedIndex={highlightedIndex}
              getItemProps={getItemProps}
            />
          ))}
      </Card>
    </div>
  );
};

const AutocompleteItem = ({ item, index, highlightedIndex, getItemProps }: AutocompleteItemProps) => (
  <Grid
    as="li"
    className={`flex cursor-pointer items-center p-3 ${
      highlightedIndex === index ? 'bg-green-200 dark:bg-green-800' : ''
    }`}
    key={`${item.id}`}
    {...getItemProps({ item, index })}
  >
    <ItemIcon id={item.id} name={item.name} icon={item.icon} />
    <Spacer x={1} />
    <span>{item.name}</span>
  </Grid>
);

export default Search;
