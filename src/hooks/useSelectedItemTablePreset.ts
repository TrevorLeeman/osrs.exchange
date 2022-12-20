import isEqual from 'lodash/isEqual';

import { itemTablePresets } from '../util/item-table-presets';
import { useItemTableContext } from './useItemTableContext';

const useSelectedItemTablePreset = () => {
  const { table } = useItemTableContext();
  const visibilityState = table.getState().columnVisibility;
  const sortingState = table.getState().sorting;

  const selectedPreset = Object.entries(itemTablePresets).filter(
    ([key, preset]) => isEqual(visibilityState, preset.columnVisibility) && isEqual(sortingState, preset.sortOptions),
  );

  return selectedPreset.length ? selectedPreset[0][0] : undefined;
};

export default useSelectedItemTablePreset;
