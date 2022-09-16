import Head from "next/head";
import { getQuestions } from "../lib/airtable";

export async function getServerSideProps(context) {
  return {
    props: {
      questions: await getQuestions(),
    },
  };
}

export default function Survey({ questions }) {
  return (
    <>
      <Head>
        <title>Survey</title>
      </Head>
      <h1>Survey</h1>
      {questions.map((q, i) => (
        <Question question={q} key={q.id} />
      ))}
    </>
  );
}

function Question(props) {
  const options = props.question.options;
  return (
    <div>
      <h2>{props.question.prompt}</h2>
      <ul>
        {options.map((option, i) => (
          <li key={props.question.id + i}>{option}</li>
        ))}
      </ul>
    </div>
  );
}
