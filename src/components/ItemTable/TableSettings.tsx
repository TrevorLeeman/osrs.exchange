import React, { useState } from 'react';

import {
  Checkbox,
  CheckboxProps,
  Collapse,
  FormElement,
  Input,
  InputProps,
  Modal,
  Radio,
  useTheme as useNextUiTheme,
} from '@nextui-org/react';
import { Column } from '@tanstack/react-table';
import isEqual from 'lodash/isEqual';
import { KeysOfUnion } from 'type-fest/source/internal';

import { ItemTableColumnFiltersState, useItemTableContext } from '../../hooks/useItemTableContext';
import useSelectedItemTablePreset from '../../hooks/useSelectedItemTablePreset';
import { COLUMN_PROPERTIES, PresetIds, TableItemKeys, itemTablePresets } from '../../util/item-table-presets';
import AddColumnIcon from '../Icons/AddColumn';
import FilterIcon from '../Icons/Filter';
import PresetsIcon from '../Icons/Presets';
import { SettingsButton, SettingsModal } from '../Settings/Settings';
import { TableItem } from './ItemTableProvider';
import ItemsPerPageDropdown from './ItemsPerPageDropdown';

type ModalCheckboxProps = Partial<CheckboxProps> & {
  label: string;
};

type ColumnVisibilityCheckboxProps = {
  column: Column<TableItem, unknown>;
};

type FilterLabelProps = {
  children: React.ReactNode;
};

type MinMaxInputProps = {
  columnId: KeysOfUnion<TableItem>;
};

type MinOrMax = 'min' | 'max';

export const TableSettings = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <SettingsButton title="Table Settings" onPress={() => setModalOpen(true)} />
      <SettingsModal modalOpen={modalOpen} setModalOpen={setModalOpen} className="mx-2 sm:p-8">
        <Modal.Header className="!text-lg font-bold">Table Settings</Modal.Header>
        <Modal.Body className="!px-4">
          <ItemsPerPageDropdown />
          <Collapse.Group bordered className="text-left">
            <Collapse title={<span className="font-semibold">Presets</span>} contentLeft={<PresetsIcon />} expanded>
              <Presets />
            </Collapse>
            <Collapse title={<span className="font-semibold">Columns</span>} contentLeft={<AddColumnIcon />}>
              <Columns />
            </Collapse>
            <Collapse title={<span className="font-semibold">Filters</span>} contentLeft={<FilterIcon />}>
              <Filters />
            </Collapse>
          </Collapse.Group>
        </Modal.Body>
      </SettingsModal>
    </>
  );
};

const Presets = () => {
  const { setSortOptions, setColumnVisibility, setColumnOrder, setColumnFilters } = useItemTableContext();
  const selectedPreset = useSelectedItemTablePreset();

  const changeHandler = (value: string) => {
    const preset = itemTablePresets[value as PresetIds];
    setSortOptions(preset.sortOptions);
    setColumnVisibility(preset.columnVisibility);
    setColumnOrder(preset.columnOrder);
    setColumnFilters(preset.columnFilters);
  };

  return (
    <Radio.Group aria-label="Presets" size="sm" onChange={changeHandler} value={selectedPreset ?? ''} className="!mx-2">
      {Object.entries(itemTablePresets).map(([key, preset]) => (
        <Radio key={key} value={key} className="!mt-1">
          {preset.label}
        </Radio>
      ))}
    </Radio.Group>
  );
};

const Columns = () => {
  const { table, setColumnVisibility, setColumnOrder } = useItemTableContext();

  const allColumns = table.getAllColumns();
  const visibleColumnIds = table.getVisibleFlatColumns().map(column => column.id);
  const allSelected = allColumns.length === visibleColumnIds.length;

  const selectAll = (checked: boolean) => {
    const visibilityObj = allColumns
      .map(column => column.id)
      .reduce((acc, columnId) => {
        return { ...acc, [columnId]: checked };
      }, {} as TableItemKeys<boolean>);

    setColumnVisibility(visibilityObj);
    setColumnOrder(undefined);
  };

  return (
    <Checkbox.Group
      value={[...visibleColumnIds, allSelected ? 'selectAll' : '']}
      aria-label="Columns"
      color="secondary"
      size="md"
      className="mx-2"
    >
      <ModalCheckbox value="selectAll" onChange={selectAll} label="Select All" />
      {allColumns.map(column => (
        <ColumnVisibilityCheckbox key={column.id} column={column} />
      ))}
    </Checkbox.Group>
  );
};

const ModalCheckbox = (props: ModalCheckboxProps) => {
  const { label } = props;

  return (
    <Checkbox aria-label={label} color="default" size="sm" className="!mt-0" {...props}>
      {label}
    </Checkbox>
  );
};

const ColumnVisibilityCheckbox = ({ column }: ColumnVisibilityCheckboxProps) => {
  const { setColumnVisibility, setColumnOrder } = useItemTableContext();
  const header = COLUMN_PROPERTIES[column.id as keyof TableItem].header;

  const changeHandler = (checked: boolean) => {
    setColumnVisibility(prev => {
      return { ...prev, [column.id]: checked };
    });
    setColumnOrder(undefined);
  };

  return <ModalCheckbox value={column.id} label={header} onChange={changeHandler} />;
};

const FreeToPlayCheckbox = () => {
  const { table, setColumnFilters } = useItemTableContext();
  const membersItemsOnly = table.getState().columnFilters.find(filter => filter.id === 'members')?.value as
    | boolean
    | undefined;
  const isSelected = membersItemsOnly === undefined ? false : !membersItemsOnly;

  const changeHandler = (checked: boolean) => {
    setColumnFilters(prev => {
      const filters = prev.filter(filter => filter.id !== 'members');
      if (checked) {
        filters.push({ id: 'members', value: !checked });
      }
      return filters;
    });
  };

  return <ModalCheckbox isSelected={isSelected} value={'f2p'} label="F2P Items Only" onChange={changeHandler} />;
};

const Filters = () => (
  <div className="mx-2 flex flex-col gap-2">
    <FreeToPlayCheckbox />
    <div>
      <FilterLabel>{COLUMN_PROPERTIES.instaBuyPrice.header}</FilterLabel>
      <MinMaxInputs columnId="instaBuyPrice" />
    </div>
    <div>
      <FilterLabel>{COLUMN_PROPERTIES.instaSellPrice.header}</FilterLabel>
      <MinMaxInputs columnId="instaSellPrice" />
    </div>
    <div>
      <FilterLabel>{COLUMN_PROPERTIES.dailyVolume.header}</FilterLabel>
      <MinMaxInputs columnId="dailyVolume" />
    </div>
    <div>
      <FilterLabel>{COLUMN_PROPERTIES.limit.header}</FilterLabel>
      <MinMaxInputs columnId="limit" />
    </div>
  </div>
);

const FilterLabel = ({ children }: FilterLabelProps) => (
  <span className="font-semibold text-gray-600 dark:text-gray-400">{children}</span>
);

const MinMaxInputs = ({ columnId }: MinMaxInputProps) => {
  const { table, setColumnFilters } = useItemTableContext();
  const minMaxValues = table.getState().columnFilters.find(filter => filter.id === columnId)?.value as
    | number[]
    | undefined;

  const withPreviousFilterValue = (
    value: number | null,
    previousFilterState: ItemTableColumnFiltersState,
    minOrMax: MinOrMax,
  ) => {
    const previousValue = previousFilterState.find(filter => filter.id === columnId)?.value as number[] | undefined;
    const previousMin = previousValue?.length ? previousValue[0] : null;
    const previousMax = previousValue?.length ? previousValue[1] : null;

    switch (minOrMax) {
      case 'min':
        return [value, previousMax];
      case 'max':
        return [previousMin, value];
    }
  };

  const changeHandler = (value: number | null, minOrMax: MinOrMax) => {
    setColumnFilters(prev => {
      const filters = prev.filter(filter => filter.id !== columnId);
      const filterValue = withPreviousFilterValue(value, prev, minOrMax);
      if (!isEqual(filterValue, [null, null])) {
        filters.push({ id: columnId, value: filterValue });
      }
      return filters;
    });
  };

  return (
    <div className="flex gap-2">
      <ModalInput
        aria-label="Min"
        placeholder="Min"
        onChange={(e: React.ChangeEvent<FormElement>) => changeHandler(Number(e.target.value) || null, 'min')}
        value={minMaxValues?.length ? minMaxValues[0] : ''}
      />
      <ModalInput
        aria-label="Max"
        placeholder="Max"
        onChange={(e: React.ChangeEvent<FormElement>) => changeHandler(Number(e.target.value) || null, 'max')}
        value={minMaxValues?.length ? minMaxValues[1] : ''}
      />
    </div>
  );
};

const ModalInput = (props: Partial<InputProps>) => {
  const { isDark } = useNextUiTheme();

  return (
    <Input animated={false} type="number" css={{ $$inputColor: isDark ? 'rgb(31, 41, 55)' : '#F1F3F5' }} {...props} />
  );
};
