import unzip from "lodash/unzip";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import { useAsync } from "react-use";
import { Async } from "../../components/Async";
import { ShowJSON } from "../../components/ShowJSON";
import { ResultSlide } from "../../components/ResultSlide";

function useAsyncQuestion(questionId) {
  return useAsync(async () => {
    if (!questionId) return;
    const response = await fetch(`/api/questions?id=${questionId}`);
    const result = await response.json();
    return result.question;
  }, [questionId]);
}

function useAsyncResponses(questionId) {
  return useAsync(async () => {
    if (!questionId) return;

    const response = await fetch(`/api/responses?questionId=${questionId}`);

    const result = await response.json();
    return result.responses;
  }, [questionId]);
}

function useResultSummary(question, responses) {
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

export default function ResultPage(/*props*/) {
  const router = useRouter();

  const question = useAsyncQuestion(router.query.id);
  const responses = useAsyncResponses(router.query.id);
  const summary = useResultSummary(question, responses);

  return (
    <>
      <Head>
        <title>Results</title>
      </Head>
      <Async data={summary}>
        <ResultSlide data={summary}></ResultSlide>
      </Async>
      <Async data={summary}>
        <ShowJSON title={`report_${question.value?.nickname}`}>
          {summary}
        </ShowJSON>
      </Async>
      <Async className="content-block" data={question}>
        <ShowJSON title={`question_${question.value?.nickname}`}>
          {question.value}
        </ShowJSON>
      </Async>
      <Async className="content-block" data={responses}>
        <ShowJSON title={`responses_${question.value?.nickname}`}>
          {responses.value}
        </ShowJSON>
      </Async>
    </>
  );
}
