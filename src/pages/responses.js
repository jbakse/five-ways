import { PrismaClient } from "@prisma/client";
import Head from "next/head";

export async function getServerSideProps(/*context*/) {
  const prisma = new PrismaClient();

  const responses = await prisma.response.findMany({
    where: {},
  });

  const responses_cleaned = JSON.parse(JSON.stringify(responses));
  return {
    props: {
      responses: responses_cleaned,
    },
  };
}

export default function Responses(props) {
  function shorten(s) {
    //recVZKGGAb7BaWPvf -> re..vf
    return s.substr(0, 2) + ".." + s.substr(-2);
  }

  function formatDate(s) {
    return new Date(s).toLocaleString();
  }
  return (
    <>
      <Head>
        <title>Responses</title>
      </Head>
      <h1>Responses</h1>
      <table class="table">
        <thead>
          <td>responseId</td>
          <td>date</td>
          <td>responderId</td>
          <td>surveyId</td>
          <td>questionId</td>
          <td>response</td>
        </thead>
        <tbody>
          {props.responses.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{formatDate(p.updatedAt)}</td>
              <td>{shorten(p.responderId)}</td>
              <td>{shorten(p.surveyId)}</td>
              <td>{shorten(p.questionId)}</td>
              <td>{JSON.stringify(p.selections)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <pre>{JSON.stringify(props, null, 2)}</pre>
    </>
  );
}
