import Link from "next/link";

export default function IndexPage() {
  return (
    <>
      <Link href="/survey">survey</Link>
      <br />
      <Link href="/surveys">surveys</Link>
      <br />
      <Link href="/responses">responses</Link>
    </>
  );
}
