import React, { ComponentProps, forwardRef, useEffect, useRef, useState } from 'react';

import { Checkbox, Collapse, FormElement, Input, Radio, useTheme as useNextUiTheme } from '@nextui-org/react';
import { Column } from '@tanstack/react-table';
import { KeysOfUnion } from 'type-fest/source/internal';
import { useUpdateEffect } from 'usehooks-ts';

import { ItemTableColumnFiltersState, useItemTableContext } from '../../hooks/useItemTableContext';
import useSelectedItemTablePreset from '../../hooks/useSelectedItemTablePreset';
import { COLUMN_PROPERTIES, Preset, PresetIds, TableItemKeys, itemTablePresets } from '../../util/item-table-presets';
import AddColumnIcon from '../Icons/AddColumn';
import FilterIcon from '../Icons/Filter';
import PresetsIcon from '../Icons/Presets';
import { SettingsButton, SettingsModal } from '../Settings/Settings';
import { TableItem } from './ItemTableProvider';

type HeaderCheckboxProps = {
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
      <SettingsButton title="Table Settings" onClick={() => setModalOpen(true)} />
      <SettingsModal modalOpen={modalOpen} setModalOpen={setModalOpen} className="p-8">
        <span className="mb-4 text-lg font-bold">Table Settings</span>
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
      </SettingsModal>
    </>
  );
};

const Presets = () => {
  const { setSortOptions, setColumnVisibility, setColumnOrder, setColumnFilters } = useItemTableContext();
  const selectedPreset = useSelectedItemTablePreset();

  const setPreset = (preset: Preset) => {
    setSortOptions(preset.sortOptions);
    setColumnVisibility(preset.columnVisibility);
    setColumnOrder(preset.columnOrder);
    setColumnFilters(preset.columnFilters);
  };

  const changeHandler = (value: string) => {
    setPreset(itemTablePresets[value as PresetIds]);
  };

  return (
    <Radio.Group
      aria-label="Presets"
      size="sm"
      css={{ marginInline: '8px' }}
      onChange={changeHandler}
      value={selectedPreset ?? ''}
    >
      {Object.entries(itemTablePresets).map(([key, preset]) => (
        <Radio key={key} value={key} className="!mt-1">
          {preset.label}
        </Radio>
      ))}
    </Radio.Group>
  );
};

const Columns = () => {
  const { table, setColumnVisibility } = useItemTableContext();

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
  };

  return (
    <Checkbox.Group
      value={[...visibleColumnIds, allSelected ? 'selectAll' : '']}
      aria-label="Columns"
      color="secondary"
      size="md"
      css={{ marginInline: '8px' }}
    >
      <Checkbox
        value="selectAll"
        onChange={selectAll}
        aria-label="Select All"
        color="default"
        size="sm"
        className="!mt-0"
      >
        Select All
      </Checkbox>
      {allColumns.map(column => (
        <ColumnCheckbox key={column.id} column={column} />
      ))}
    </Checkbox.Group>
  );
};

const ColumnCheckbox = ({ column }: HeaderCheckboxProps) => {
  const { setColumnVisibility } = useItemTableContext();
  const header = COLUMN_PROPERTIES[column.id as keyof TableItem].header;

  return (
    <Checkbox
      value={column.id}
      aria-label={header}
      onChange={checked =>
        setColumnVisibility(prev => {
          return { ...prev, [column.id]: checked };
        })
      }
      color="default"
      size="sm"
      className="!mt-0"
    >
      {header}
    </Checkbox>
  );
};

const Filters = () => (
  <div className="mx-2 flex flex-col gap-2">
    {/* F2P Checkbox */}
    <div>
      <FilterLabel>{COLUMN_PROPERTIES.instaSellPrice.header}</FilterLabel>
      <MinMaxInputs columnId="instaSellPrice" />
    </div>
    <div>
      <FilterLabel>{COLUMN_PROPERTIES.instaBuyPrice.header}</FilterLabel>
      <MinMaxInputs columnId="instaBuyPrice" />
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
  console.log(minMaxValues);

  const filterValue = (value: number | null, previousFilterState: ItemTableColumnFiltersState, minOrMax: MinOrMax) => {
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
    setColumnFilters(prev => [
      ...prev.filter(filter => filter.id !== columnId),
      { id: columnId, value: filterValue(value, prev, minOrMax) },
    ]);
  };

  return (
    <div className="flex gap-2">
      <ModalInput
        aria-label="Min"
        placeholder="Min"
        onChange={(e: React.ChangeEvent<FormElement>) => changeHandler(Number(e.target.value) || null, 'min')}
        value={minMaxValues?.length ? minMaxValues[0] : undefined}
      />
      <ModalInput
        aria-label="Max"
        placeholder="Max"
        onChange={(e: React.ChangeEvent<FormElement>) => changeHandler(Number(e.target.value) || null, 'max')}
        value={minMaxValues?.length ? minMaxValues[1] : undefined}
      />
    </div>
  );
};

const ModalInput = (props: any) => {
  const { isDark } = useNextUiTheme();

  return (
    <Input animated={false} type="number" css={{ $$inputColor: isDark ? 'rgb(31 41 55)' : '#F1F3F5' }} {...props} />
  );
};
