import React, { ComponentProps, useState } from 'react';

import { Checkbox, Collapse, Input, Radio, useTheme as useNextUiTheme } from '@nextui-org/react';
import { Column } from '@tanstack/react-table';

import { useItemTableContext } from '../../hooks/useItemTableContext';
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

const Filters = () => {
  const { table, setColumnFilters } = useItemTableContext();

  return (
    <div className="mx-2 flex flex-col gap-2">
      {/* F2P Checkbox */}
      <div>
        <FilterLabel>{COLUMN_PROPERTIES.instaSellPrice.header}</FilterLabel>
        <MinMaxInputs />
      </div>
      <div>
        <FilterLabel>{COLUMN_PROPERTIES.instaBuyPrice.header}</FilterLabel>
        <MinMaxInputs />
      </div>
      <div>
        <FilterLabel>{COLUMN_PROPERTIES.dailyVolume.header}</FilterLabel>
        <MinMaxInputs />
      </div>
      <div>
        <FilterLabel>{COLUMN_PROPERTIES.limit.header}</FilterLabel>
        <MinMaxInputs />
      </div>
    </div>
  );
};

const FilterLabel = ({ children }: FilterLabelProps) => (
  <span className="font-semibold text-gray-600 dark:text-gray-400">{children}</span>
);

const MinMaxInputs = () => {
  const { isDark } = useNextUiTheme();

  return (
    <div className="flex gap-2">
      <ModalInput
        aria-label="Min"
        placeholder="Min"
        // onChange={changeHandler}
        // initialValue={previousInputValue}
      />
      <ModalInput
        aria-label="Max"
        placeholder="Max"
        // onChange={changeHandler}
        // initialValue={previousInputValue}
      />
    </div>
  );
};

const ModalInput = (props: any) => {
  const { isDark } = useNextUiTheme();

  return <Input animated={false} clearable css={{ $$inputColor: isDark ? 'rgb(31 41 55)' : '#F1F3F5' }} {...props} />;
};
