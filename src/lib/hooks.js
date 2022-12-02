import { useState } from "react";
import { useDeepCompareEffect } from "react-use";

// useAsyncDeep adapted from
// https://polvara.me/posts/fetching-asynchronous-data-with-react-hooks

export function useAsyncDeep(f, params) {
  const [value, setValue] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(true);

  useDeepCompareEffect(() => {
    async function getResource() {
      try {
        setLoading(true);
        const result = await f(...params);
        setValue(result);
      } catch (error_) {
        setError(error_);
      } finally {
        setLoading(false);
      }
    }
    getResource();
  }, [f, params]);

  return { value, error, loading };
}
