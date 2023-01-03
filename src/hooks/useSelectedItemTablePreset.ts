import isEqual from 'lodash/isEqual';

import { itemTablePresets } from '../util/item-table-presets';
import { useItemTableContext } from './useItemTableContext';

const useSelectedItemTablePreset = () => {
  const { table } = useItemTableContext();
  const visibilityState = table.getState().columnVisibility;
  const sortingState = table.getState().sorting;
  const columnFiltersState = table.getState().columnFilters.filter(filter => filter.id !== 'name');

  const selectedPreset = Object.entries(itemTablePresets).find(
    ([key, preset]) =>
      isEqual(visibilityState, preset.columnVisibility) &&
      isEqual(sortingState, preset.sortOptions) &&
      isEqual(columnFiltersState, preset.columnFilters),
  );

  return selectedPreset?.length ? selectedPreset[0] : undefined;
};

export default useSelectedItemTablePreset;
