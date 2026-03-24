import { useCallback, useEffect, useRef, useState } from "react";

type UseApiState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
};

export function useApi<T>(fetcher: () => Promise<T>, deps: unknown[] = []): UseApiState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const counter = useRef(0);

  const doFetch = useCallback(() => {
    const id = ++counter.current;
    setLoading(true);
    setError(null);
    fetcher()
      .then((result) => {
        if (id !== counter.current) return;
        setData(result);
      })
      .catch((e: unknown) => {
        if (id !== counter.current) return;
        setError(e instanceof Error ? e.message : "请求失败");
      })
      .finally(() => {
        if (id !== counter.current) return;
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    doFetch();
  }, [doFetch]);

  return { data, loading, error, refetch: doFetch };
}
