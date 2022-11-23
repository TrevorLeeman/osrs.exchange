import { useEffect, useState } from 'react';

import { useRouter } from 'next/router';

import omit from 'lodash/omit';

function useNextQueryParams<T>(
  paramsName: string,
  initialState: T,
  serialize: (state: T) => string,
  deserialize: (state: string | string[]) => T,
): [T, (state: T) => void] {
  const router = useRouter();

  const existingValue = router.query[paramsName];
  const [state, setState] = useState<T>(existingValue ? deserialize(existingValue) : initialState);

  useEffect(() => {
    // Updates state when user navigates backwards or forwards in browser history
    if (existingValue && deserialize(existingValue) !== state) {
      setState(deserialize(existingValue));
    }

    if (existingValue === 'null') {
      router.push({ pathname: router.pathname, query: { ...omit(router.query, paramsName) } }, undefined, {
        scroll: false,
        shallow: true,
      });
    }

    if (existingValue === undefined) {
      setState(initialState);
    }
  }, [existingValue]);

  const onChange = (state: T) => {
    setState(state);
    router.push({ pathname: router.pathname, query: { ...router.query, [paramsName]: serialize(state) } }, undefined, {
      scroll: false,
      shallow: true,
    });
  };

  return [state, onChange];
}

export default useNextQueryParams;
