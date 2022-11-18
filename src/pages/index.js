import React from "react";
import Link from "next/link";

export default function Index() {
  return (
    <>
      <h1 className="content-block">Five Ways</h1>
      <div className="content-block">
        <Link href="/takeSurvey">Take Survey</Link>
        <br />
        <Link href="/surveys">Surveys</Link>
        <br />
        <Link href="/responses">Responses</Link>
      </div>
    </>
  );
}
