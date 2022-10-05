import Link from "next/link";

export default function IndexPage() {
  return (
    <>
      <h1 className="content-block">Five Ways</h1>
      <div className="content-block">
        <Link href="/survey">survey</Link>
        <br />
        <Link href="/surveys">surveys</Link>
        <br />
        <Link href="/responses">responses</Link>
      </div>
    </>
  );
}
