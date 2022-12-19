import { useRef, useState } from 'react';

import { useRouter } from 'next/router';

import { FormElement, Input, useTheme as useNextUiTheme } from '@nextui-org/react';
import { UseComboboxGetItemPropsOptions, useCombobox } from 'downshift';
import { useDebounce } from 'usehooks-ts';

import type { BasicItem } from '../../db/items';
import useAutocompleteList from '../../hooks/useAutocompleteList';
import useTailwindMinBreakpoint from '../../hooks/useTailwindBreakpoint';
import SearchIcon from '../Icons/Search';
import ItemIcon from '../ItemIcon/ItemIcon';

export type SearchItem = Pick<BasicItem, 'id' | 'name' | 'icon'>;

type AutocompleteItemProps = {
  item: SearchItem;
  index: number;
  highlightedIndex: number;
  getItemProps: (options: UseComboboxGetItemPropsOptions<SearchItem>) => any;
};

export const Search = () => {
  const router = useRouter();
  const { isDark } = useNextUiTheme();
  const isMinTablet = useTailwindMinBreakpoint('sm');
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
    id: 'item-search',
  });

  const debouncedSearch = useDebounce(inputValue, 50);
  const {
    data: autocompleteList,
    isLoading: autocompleteListIsLoading,
    isFetching: autocompleteListIsFetching,
  } = useAutocompleteList({ inputValue: debouncedSearch, setItems });

  const handleKeyUp = (event: React.KeyboardEvent<FormElement>) => {
    if (event.key === 'Enter') {
      inputRef.current?.blur();
    }
  };

  return (
    <div className="relative w-full">
      <div {...getComboboxProps()}>
        <Input
          placeholder="Search for an item"
          aria-label=""
          type="search"
          autoComplete="false"
          css={{ width: '100%', $$inputColor: isDark ? 'rgb(31 41 55)' : 'rgb(228,228,231)' }}
          size={isMinTablet ? 'lg' : 'md'}
          onClearClick={() => setItems(() => [])}
          clearable
          contentLeft={<SearchIcon />}
          // rounded
          {...getInputProps({
            ref: inputRef,
            'aria-label': 'Item search',
            onKeyUp: e => handleKeyUp(e),
          })}
        />
      </div>
      <ul
        className="absolute z-[300] m-0 max-h-[300px] w-full overflow-y-auto overflow-x-hidden rounded-xl bg-gray-800 shadow-xl"
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
