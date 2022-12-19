import React, { useState } from 'react';

import { Checkbox, Collapse, Radio } from '@nextui-org/react';
import { Column } from '@tanstack/react-table';
import isEqual from 'lodash/isEqual';

import { useItemTableContext } from '../../hooks/useItemTableContext';
import { COLUMN_HEADERS, itemTablePresets } from '../../util/item-table-presets';
import AddColumnIcon from '../Icons/AddColumn';
import PresetsIcon from '../Icons/Presets';
import { SettingsButton, SettingsModal } from '../Settings/Settings';
import { TableItem } from './ItemTableProvider';

type HeaderCheckboxProps = {
  column: Column<TableItem, unknown>;
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
        </Collapse.Group>
      </SettingsModal>
    </>
  );
};

const Presets = () => {
  const { setSortOptions, setColumnVisibility } = useItemTableContext();

  const changeHandler = (value: string) => {
    switch (value) {
      case 'default':
        setSortOptions(itemTablePresets.default.sortOptions);
        setColumnVisibility(itemTablePresets.default.columnVisibility);
        break;
      case 'highAlchProfit':
        setSortOptions(itemTablePresets.highAlchProfit.sortOptions);
        setColumnVisibility(itemTablePresets.highAlchProfit.columnVisibility);
        break;
    }
  };

  return (
    <Radio.Group aria-label="Presets" size="sm" css={{ marginInline: '6px' }} onChange={changeHandler}>
      <Radio value="default">Default</Radio>
      <Radio value="highAlchProfit">High Alch Profit</Radio>
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
      }, {});

    setColumnVisibility(visibilityObj);
  };

  return (
    <Checkbox.Group
      value={[...visibleColumnIds, allSelected ? 'selectAll' : '']}
      aria-label="Columns"
      color="secondary"
      size="md"
      css={{ marginInline: '6px' }}
    >
      <Checkbox value="selectAll" onChange={selectAll} aria-label="Select All" color="default">
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
  const header = COLUMN_HEADERS[column.id as keyof TableItem];

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
      css={{ marginTop: '0 rem' }}
      className="!mt-0"
    >
      {header}
    </Checkbox>
  );
};

const usePresetSelected = () => {
  const { table } = useItemTableContext();

  // const all
  const visibilityState = table.getState().columnVisibility;
  console.log(isEqual(visibilityState, itemTablePresets.default.columnVisibility));

  // Perform deep equality checks for all presets
  // If preset is matched, return preset value
  // If not, return undefined ?
};
