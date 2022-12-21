import { twMerge } from 'tailwind-merge';

type PresetsIconProps = {
  className?: string;
};

const PresetsIcon = ({ className }: PresetsIconProps) => (
  <svg
    width="16px"
    height="16px"
    viewBox="0 0 16 16"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    className={twMerge(['h-4 w-4 fill-gray-700 dark:fill-gray-400', className])}
  >
    <rect width="16" height="16" id="icon-bound" fill="none" />
    <path d="M0,0l2,0l0,2.709c1.466,-1.662 3.609,-2.709 6,-2.709c4.419,0 8,3.581 8,8c0,4.419 -3.581,8 -8,8c-4.419,0 -8,-3.581 -8,-8l2,0c0,1.603 0.624,3.11 1.756,4.244c1.132,1.134 2.641,1.756 4.244,1.756c1.603,0 3.109,-0.625 4.244,-1.756c1.131,-1.135 1.756,-2.641 1.756,-4.244c0,-1.603 -0.625,-3.109 -1.756,-4.244c-1.135,-1.131 -2.641,-1.756 -4.244,-1.756c-1.603,0 -3.109,0.625 -4.244,1.756c-0.078,0.078 -0.156,0.16 -0.228,0.244l2.472,0l0,2l-6,0l0,-6Zm10.784,4.916l1.485,1.337l-5.169,5.747l-3.244,-3.206l1.406,-1.422l1.754,1.731l3.768,-4.187Z" />
  </svg>
);

export default PresetsIcon;