import { twMerge } from 'tailwind-merge';

type AddColumnIconProps = {
  className?: string;
};

const AddColumnIcon = ({ className }: AddColumnIconProps) => (
  <svg
    width="16px"
    height="16px"
    viewBox="0 0 16 16"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    className={twMerge(['h-5 w-5 fill-gray-700 dark:fill-gray-400', className])}
  >
    <rect width="16" height="16" id="icon-bound" fill="none" />
    <path
      id="table-add-column"
      d="M12,11l-0,2l2,0l-0,-2l2,0l-0,-2l-2,0l-0,-2l-2,0l-0,2l-2,0l-0,2l2,0Zm2,-5l-0,-5c0,-0.265 -0.105,-0.52 -0.293,-0.707c-0.187,-0.188 -0.442,-0.293 -0.707,-0.293l-10,-0c-0.552,-0 -1,0.448 -1,1c-0,2.577 -0,11.423 0,14c0,0.552 0.448,1 1,1c1.916,0 8.084,0 10,0c0.552,-0 1,-0.448 1,-1l-0,-1l-5,0l-0,-12l3,0l-0,4l2,0Zm-10,-4l3,0l-0,12l-3,0l-0,-12Z"
    />
  </svg>
);

export default AddColumnIcon;
