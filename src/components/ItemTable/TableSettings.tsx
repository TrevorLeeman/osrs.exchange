import { useState } from 'react';

import { Checkbox, Collapse } from '@nextui-org/react';
import { Column } from '@tanstack/react-table';

import { useItemTableContext } from '../../hooks/useItemTableContext';
import AddColumnIcon from '../Icons/AddColumn';
import { SettingsButton, SettingsModal } from '../Settings/Settings';
import { TableItem, columnHeaders } from './ItemTableProvider';

type HeaderCheckboxProps = {
  column: Column<TableItem, unknown>;
};

export const TableSettings = () => {
  const [modalOpen, setModalOpen] = useState(false);
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
    <>
      <SettingsButton title="Table Settings" onClick={() => setModalOpen(true)} />
      <SettingsModal modalOpen={modalOpen} setModalOpen={setModalOpen} className="p-8">
        <span className="mb-4 text-lg font-bold">Table Settings</span>
        <Collapse.Group bordered className="text-left">
          {/* <Collapse title={<span className="font-semibold">Presets</span>}>
            <Checkbox>High Alch Profit</Checkbox>
          </Collapse> */}
          <Collapse title={<span className="font-semibold">Columns</span>} contentLeft={<AddColumnIcon />}>
            <Checkbox.Group
              value={[...visibleColumnIds, allSelected ? 'selectAll' : '']}
              aria-label="Columns"
              color="secondary"
            >
              <Checkbox value="selectAll" onChange={selectAll} aria-label="Select All" color="default">
                Select All
              </Checkbox>
              {allColumns.map(column => (
                <HeaderCheckbox key={column.id} column={column} />
              ))}
            </Checkbox.Group>
          </Collapse>
        </Collapse.Group>
      </SettingsModal>
    </>
  );
};

const HeaderCheckbox = ({ column }: HeaderCheckboxProps) => {
  const { setColumnVisibility } = useItemTableContext();
  const header = columnHeaders[column.id as keyof TableItem];
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
