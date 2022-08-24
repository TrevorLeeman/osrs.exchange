import { useEffect, useRef } from 'react';

const useMounted = () => {
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
  }, []);

  return mounted.current;
};

export default useMounted;
