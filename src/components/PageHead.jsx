import Head from "next/head";

export default function PageHead({ title, description }) {
  return (
    <Head>
      <title>{title || "Car Installment"}</title>
      <meta
        name="description"
        content={description || "Apply for car installment financing"}
      />
    </Head>
  );
}
