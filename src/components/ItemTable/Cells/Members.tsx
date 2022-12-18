import Image from 'next/image';

import { CellContext } from '@tanstack/react-table';

import { TableItem } from '../ItemTableProvider';

type NameCellProps = {
  context: CellContext<TableItem, boolean>;
};

const MembersCell = ({ context }: NameCellProps) =>
  context.getValue() ? (
    <Image src="/icons/members-star.png" alt="Members gold star" width="16" height="16" title="Members" />
  ) : (
    <Image
      src="/icons/free-to-play-star.webp"
      alt="Free-to-play silver star"
      width="16"
      height="16"
      title="Free-to-play"
    />
  );

export default MembersCell;
