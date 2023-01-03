import { Dispatch, SetStateAction } from 'react';

import { useQuery } from '@tanstack/react-query';

import { SearchItem } from '../components/Header/Search';
import { fetchAutocompleteList } from '../util/queries';

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

export default useAutocompleteList;
