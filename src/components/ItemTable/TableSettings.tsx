import { useState } from 'react';

import { Checkbox, Collapse } from '@nextui-org/react';

import { useItemTableContext } from '../../hooks/useItemTableContext';
import { SettingsButton, SettingsModal } from '../Settings/Settings';
import { TableItem, columnHeaders } from './ItemTableProvider';

export const TableSettings = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const { table, setColumnVisibility } = useItemTableContext();

  const allColumns = table.getAllColumns();
  const visibleColumnIds = table.getVisibleFlatColumns().map(col => col.id);

  return (
    <>
      <SettingsButton title="Table Settings" onClick={() => setModalOpen(true)} />
      <SettingsModal modalOpen={modalOpen} setModalOpen={setModalOpen} className="p-8">
        <span className="mb-4 text-lg font-bold">Table Settings</span>
        <Collapse title={<span className="font-semibold">Columns</span>} expanded bordered>
          <Checkbox.Group color="secondary" defaultValue={visibleColumnIds}>
            {/* <Checkbox
              color="default"
              isSelected={table.getIsAllColumnsVisible()}
              onChange={checked =>
                setColumnVisibility(prev => {
                  const all = allColumns.reduce(
                    (visibilityObj, col) => (visibilityObj[col.id as keyof TableItem] = false),
                    {},
                  );
                  console.log(all);
                  return all;
                })
              }
            >
              Select All
            </Checkbox> */}
            {allColumns.map(col => {
              return (
                <Checkbox
                  key={col.id}
                  value={col.id}
                  onChange={checked =>
                    setColumnVisibility(prev => {
                      return { ...prev, [col.id]: checked };
                    })
                  }
                  color="default"
                  css={{ marginTop: '0 rem' }}
                  className="!mt-0"
                >
                  {columnHeaders[col.id as keyof TableItem]}
                </Checkbox>
              );
            })}
          </Checkbox.Group>
        </Collapse>
      </SettingsModal>
    </>
  );
};
