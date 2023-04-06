import Link from "next/link";
import Layout from "../components/Layout";

const IndexPage = () => (
  <Layout title="Home | Next.js + TypeScript Example">
    <h1 className="flex justify-center">Hello Next.js 👋</h1>
    <button className="btn">
      <Link href="/about">About</Link>
    </button>
  </Layout>
);

export default IndexPage;
