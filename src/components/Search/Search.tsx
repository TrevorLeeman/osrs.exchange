import { Dispatch, SetStateAction, useRef, useState } from 'react';

import { useRouter } from 'next/router';

import { Input } from '@nextui-org/react';
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

export const Search = () => {
  const router = useRouter();
  const [items, setItems] = useState<SearchItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

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

  const debouncedSearch = useDebounce(inputValue, 50);
  const {
    data: autocompleteList,
    isLoading: autocompleteListIsLoading,
    isFetching: autocompleteListIsFetching,
  } = useAutocompleteList({ inputValue: debouncedSearch, setItems });

  const handleSubmit = (event: React.KeyboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    inputRef.current?.blur();
  };

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit} {...getComboboxProps()}>
        <Input
          placeholder="Search for an item"
          aria-label="Item search"
          type="search"
          autoComplete="false"
          css={{ width: '100%', borderI: 0 }}
          onClearClick={() => setItems(() => [])}
          ref={inputRef}
          clearable
          {...getInputProps()}
        />
      </form>
      <ul
        className="absolute z-[300] m-0 max-h-[300px] w-full overflow-y-auto overflow-x-hidden rounded-xl"
        {...getMenuProps()}
      >
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
      </ul>
    </div>
  );
};

const fetchAutocompleteList: QueryFunction<SearchItem[]> = async ({ queryKey }) => {
  const [_key, { inputValue }] = queryKey as [string, { inputValue: string }];
  if (!inputValue) return [];

  return axios
    .get<{ items: SearchItem[] }>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/item_search/${inputValue}`)
    .then(res => res.data.items);
};

const AutocompleteItem = ({ item, index, highlightedIndex, getItemProps }: AutocompleteItemProps) => (
  <li
    className={`m-0 flex min-h-[60px] cursor-pointer items-center border-2 p-3 first:rounded-t-xl last:rounded-b-xl odd:bg-slate-200 even:bg-slate-100 dark:odd:bg-slate-800 dark:even:bg-slate-700 ${
      highlightedIndex === index ? 'border-indigo-600 dark:border-yellow-400' : 'border-transparent'
    }`}
    key={item.id}
    {...getItemProps({ item, index })}
  >
    <div className="flex min-w-[40px] items-center justify-center">
      <ItemIcon id={item.id} name={item.name} icon={item.icon} />
    </div>
    <span className="ml-4">{item.name}</span>
  </li>
);

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
