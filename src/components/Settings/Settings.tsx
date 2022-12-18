import { Dispatch, SetStateAction } from 'react';

import { Modal } from '@nextui-org/react';
import { Variants, motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

import SettingsIcon from '../Icons/Settings';

type SettingsButtonProps = {
  onClick: React.MouseEventHandler;
  title: string;
};

type SettingsModalProps = {
  modalOpen: boolean;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  className?: string;
  children?: React.ReactNode;
};

const settingsButtonVariants: Variants = {
  initial: { rotate: 0 },
  hover: { rotate: -40 },
};

export const SettingsButton = ({ onClick, title }: SettingsButtonProps) => {
  return (
    <motion.button
      variants={settingsButtonVariants}
      initial="initial"
      whileHover="hover"
      onClick={onClick}
      title={title}
    >
      <SettingsIcon className="hover:drop-shadow-md dark:drop-shadow-item-icon-dark" />
    </motion.button>
  );
};

export const SettingsModal = ({ modalOpen, setModalOpen, className, children }: SettingsModalProps) => {
  return (
    <Modal
      open={modalOpen}
      onClose={() => setModalOpen(false)}
      closeButton={true}
      className={twMerge(['cursor-default', className])}
    >
      {children}
    </Modal>
  );
};
