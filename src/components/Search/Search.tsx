import type { BasicItem } from '../../db/items';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { QueryFunction, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCombobox } from 'downshift';
import { Card, Grid, Input } from '@nextui-org/react';
import axios from 'axios';
import styles from './Search.module.scss';
import ItemIcon from '../ItemIcon/ItemIcon';
import useDebounce from '../../hooks/useDebounce';

type SearchItem = Pick<BasicItem, 'id' | 'name' | 'icon'>;

const fetchAutocompleteList: QueryFunction<SearchItem[]> = async ({ queryKey }) => {
  const [_key, { inputValue }] = queryKey as [string, { inputValue: string }];

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
    <div className={styles.searchContainer}>
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
      <Card as="ul" className={styles.itemListContainer} {...getMenuProps()}>
        {isOpen &&
          items.map((item, index) => (
            <Grid
              as="li"
              css={{ backgroundColor: highlightedIndex === index ? '$green100' : '' }}
              className={`${styles.item}`}
              key={`${item.id}`}
              {...getItemProps({ item, index })}
            >
              <ItemIcon id={item.id} name={item.name} icon={item.icon} />
              <span>{item.name}</span>
            </Grid>
          ))}
      </Card>
    </div>
  );
};

export default Search;
