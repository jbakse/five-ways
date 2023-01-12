import React from "react";
import Link from "next/link";

export default function Index() {
  return (
    <>
      <h1 className="content-block">Five Ways</h1>
      <div className="content-block">
        <h2>Front of House</h2>
        <Link href="/takeSurvey">Take Survey</Link>
        <br />
        <Link href="/takeSurvey?gallery">Take Survey in Gallery</Link>
        <br />
        <Link href="/lobby">Lobby</Link>
        <br />
        <h2>Admin</h2>
        <Link href="/questions">Questions</Link>
        <br />
        <Link href="/surveys">Surveys</Link>
        <br />
        <Link href="/responses">Responses</Link>
      </div>
    </>
  );
}
