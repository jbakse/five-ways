import { useState } from "react";
import { useDeepCompareEffect } from "react-use";

// useAsyncDeep adapted from
// https://polvara.me/posts/fetching-asynchronous-data-with-react-hooks

export function useAsyncDeep(getMethod, params) {
  const [value, setValue] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  async function getResource() {
    try {
      setLoading(true);
      const result = await getMethod(...params);
      setValue(result);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }

  useDeepCompareEffect(() => {
    getResource();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, params);

  return { value, error, loading };
}
