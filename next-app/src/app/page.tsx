// import Image from "next/image";

import { pinyin } from "pinyin-pro";

export default function Home() {
  return (
    <div>
      Hello world whatever
      <h1>Simplified example</h1>
      <p>{pinyin("为，来")}</p>
      <h1>Traditional example</h1>
      <p>{pinyin("為，來")}</p>
    </div>
  );
}
