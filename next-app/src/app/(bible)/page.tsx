import ChapterPage from "./[book]/[chapter]/page";

export default function Home() {
  // call your same ChapterPage component

  // build the same shape Next.js normally passes
  const defaultParams = Promise.resolve({
    book: "Genesis",
    chapter: "1",
  });
  return <ChapterPage params={defaultParams} />;
}
