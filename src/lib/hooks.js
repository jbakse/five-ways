import unzip from "lodash/unzip";
import { useState, useMemo, useEffect } from "react";
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
      // make sure data is ready
      if (responses.loading) return { loading: true, error: false };
      if (responses.error) return { loading: false, error: responses.error };
      if (!Array.isArray(responses.value))
        return { loading: true, error: false };

      if (question.loading) return { loading: true, error: false };
      if (question.error) return { loading: false, error: question.error };
      if (!question.value) return { loading: true, error: false };

      const viewedCount = responses.value.length;
      // gather responses and throw out if unasnswered
      const answers = responses.value.map((r) => r.response).filter(Boolean);
      const answeredCount = answers.length;
      let options = [];
      if (["multiple", "single"].includes(question.value.type)) {
        // count how many respondants choose option 1, option 2, etc.
        const counts = unzip(answers).map((a) => a.filter(Boolean).length);

        options = counts.map((count, index) => ({
          count,
          index,
          percentOfAnswered: count / answeredCount,
          precentOfViewed: count / viewedCount,
          response: question.value.optionTextsEnglish[index],
        }));
        // count how many respondants choose option 1, option 2, etc.
      } else {
        // its an open question
        // todo: handle this when open questions are added
      }

      const data = {
        nickname: question.value.nickname,
        prompt: question.value.promptTextEnglish,
        viewedCount: 0,
        answeredCount: 0,
        options,
      };

      return data;
    },
    [responses, question]
  );
}

export function useBodyClass(className) {
  useEffect(() => {
    document.body.classList.add(className);
    return () => {
      document.body.classList.remove(className);
    };
  });
}

export function useTimeout(seconds = 300) {
  useEffect(() => {
    // reload page after .1 minute

    let timer;

    if (seconds) {
      // restart timer on any user interaction
      const restartTimer = () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          window.location.reload();
        }, seconds * 1000);
      };
      window.addEventListener("touchmove", restartTimer);
      window.addEventListener("mousemove", restartTimer);
      window.addEventListener("mousedown", restartTimer);
      window.addEventListener("keypress", restartTimer);
      window.addEventListener("scroll", restartTimer);
      restartTimer();
    }

    return () => clearTimeout(timer);
  }, [seconds]);
}
