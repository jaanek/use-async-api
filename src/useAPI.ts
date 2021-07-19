import { useCallback, useState } from 'react';

type APIFun<R, A extends any[] = []> = (...args: A) => Promise<R>;
export interface APIState<D, E> {
  loading?: boolean;
  data?: D;
  error?: E;
}

export function useAPI<ResponseType, ParamTypes extends any[] = [], ErrorType = any>(
  apiFun: APIFun<ResponseType> | APIFun<ResponseType, ParamTypes>,
  initialState: APIState<ResponseType, ErrorType> = {}
): [
    APIFun<APIState<ResponseType, ErrorType>, ParamTypes>,
    boolean | undefined,
    ResponseType | undefined,
    ErrorType | undefined
  ] {
  const [resp, setResponse] = useState(initialState);
  const triggerFun = useCallback(async (...params: ParamTypes) => {
    return await callAPI<ResponseType, ErrorType>(setResponse, async () => {
      return apiFun(...params);
    });
  }, [setResponse]);
  return [triggerFun, resp.loading, resp.data, resp.error];
}

async function callAPI<D, E>(
  setResponse: React.Dispatch<React.SetStateAction<APIState<D, E>>>,
  fetchFun: () => Promise<D>
) {
  setResponse((state) => { return { ...state, loading: true } as APIState<D, E> });
  try {
    const res = await fetchFun();
    setResponse(state => { return { ...state, loading: false, data: res } });
    return { data: res } as APIState<D, E>;
  } catch (e: any) {
    setResponse(state => { return { ...state, loading: false, error: e as E } });
    return { error: e as E } as APIState<D, E>;
  }
}
