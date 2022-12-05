import unzip from "lodash/unzip";
import { useState, useMemo } from "react";
import { useAsync, useDeepCompareEffect } from "react-use";

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

export function useAsyncQuestion(questionId) {
  return useAsync(async () => {
    if (!questionId) return;
    const response = await fetch(`/api/questions?id=${questionId}`);
    const result = await response.json();
    return result.question;
  }, [questionId]);
}

export function useAsyncResponses(questionId) {
  return useAsync(async () => {
    if (!questionId) return;

    const response = await fetch(`/api/responses?questionId=${questionId}`);

    const result = await response.json();
    return result.responses;
  }, [questionId]);
}

export function useResultSummary(question, responses) {
  return useMemo(
    function updateData() {
      if (responses.loading) return { loading: true, error: false };
      if (responses.error) return { loading: false, error: responses.error };
      if (question.loading) return { loading: true, error: false };
      if (question.error) return { loading: false, error: question.error };

      if (!Array.isArray(responses.value))
        return { loading: true, error: false };
      if (!question.value) return { loading: true, error: false };

      // gather selections
      const selections = responses.value.map((r) => r.selections);

      // count how many respondants choose option 1, option 2, etc.
      const selectionCounts = unzip(selections).map(
        (a) => a.filter(Boolean).length
      );

      const viewedCount = responses.value.length;
      const answeredCount = selectionCounts.reduce((a, b) => a + b, 0);

      // prepare data
      const options = selectionCounts.map((count, index) => ({
        count,
        index: index,
        percentOfAnswered: count / answeredCount,
        precentOfViewed: count / viewedCount,
        response: question.value.optionTextsEnglish[index],
      }));

      const data = {
        nickname: question.value.nickname,
        prompt: question.value.promptTextEnglish,
        viewedCount,
        answeredCount,
        options,
      };

      return data;
    },
    [responses, question]
  );
}
