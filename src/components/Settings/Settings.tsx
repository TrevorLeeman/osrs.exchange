import { Dispatch, SetStateAction } from 'react';

import { Button, Modal, PressEvent } from '@nextui-org/react';
import { twMerge } from 'tailwind-merge';

import SettingsIcon from '../Icons/Settings';

type SettingsButtonProps = {
  onPress: (e: PressEvent) => void;
  title: string;
};

type SettingsModalProps = {
  modalOpen: boolean;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  className?: string;
  children?: React.ReactNode;
};

export const SettingsButton = ({ onPress, title }: SettingsButtonProps) => {
  return (
    <Button onPress={onPress} title={title} icon={<SettingsIcon />} className="dark:bg-slate-600">
      {title}
    </Button>
  );
};

export const SettingsModal = ({ modalOpen, setModalOpen, className, children }: SettingsModalProps) => {
  return (
    <Modal
      blur
      open={modalOpen}
      onClose={() => setModalOpen(false)}
      closeButton={true}
      className={twMerge(['cursor-default', className])}
    >
      {children}
    </Modal>
  );
};
