import type { BasicItem } from '../../db/items';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { QueryFunction, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCombobox } from 'downshift';
import { Card, Grid, Input } from '@nextui-org/react';
import axios from 'axios';
import styles from './Search.module.scss';
import ItemIcon from '../ItemIcon/ItemIcon';

const fetchAutocompleteList: QueryFunction<Pick<BasicItem, 'id' | 'name' | 'icon'>[]> = async ({ queryKey }) => {
  const [_key, { inputValue }] = queryKey as [string, { inputValue: string }];

  return axios
    .get<{ items: Pick<BasicItem, 'id' | 'name' | 'icon'>[] }>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/item_search/${inputValue}`,
    )
    .then(res => res.data.items);
};

const Search = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [items, setItems] = useState<Pick<BasicItem, 'id' | 'name' | 'icon'>[]>([]);

  const { inputValue, isOpen, highlightedIndex, getMenuProps, getItemProps, getInputProps, getComboboxProps } =
    useCombobox({
      items,
      onInputValueChange({ inputValue }) {
        queryClient.invalidateQueries(['autocomplete']);
      },
      onSelectedItemChange(changes) {
        router.push(`/item/${changes.selectedItem?.id}`);
      },
      itemToString(item) {
        return item ? item.name : '';
      },
    });

  const {
    data: autocompleteList,
    isLoading: autocompleteListIsLoading,
    isFetching: autocompleteListIsFetching,
  } = useQuery<Pick<BasicItem, 'id' | 'name' | 'icon'>[]>(['autocomplete', { inputValue }], fetchAutocompleteList, {
    onSuccess(data) {
      setItems(() => data);
    },
  });

  console.log(autocompleteList);

  return (
    <div className={styles.searchContainer}>
      <div {...getComboboxProps()}>
        <Input
          placeholder="Search for an item"
          aria-label="Item search"
          type="search"
          autoComplete="false"
          css={{ width: '100%', maxWidth: '450px' }}
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
              css={{ backgroundColor: highlightedIndex === index ? '$accents2' : '' }}
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
