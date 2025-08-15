/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import Markdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
// import rehypeSlug from "rehype-slug";
// import rehypeAutolinkHeadings from "rehype-autolink-headings";

export type PrettyMarkdownProps = {
  content: string;
  /** Extra classes for the outer wrapper */
  className?: string;
  /** Optional component overrides forwarded to react-markdown */
  components?: Components;
};

/**
 * PrettyMarkdown
 *
 * A reusable, nicely-styled wrapper around `react-markdown` with:
 *  - Clean typography for headings (h1–h6), paragraphs, lists, etc.
 *  - Great-looking tables with visible borders, spacing, and captions
 *  - Sensible defaults you can still override via the `components` prop
 *
 *
 */
const PrettyMarkdown: React.FC<PrettyMarkdownProps> = ({
  content,
  className,
  components,
}) => {
  const base =
    "prose max-w-none prose-pre:whitespace-pre-wrap prose-code:before:hidden prose-code:after:hidden";
  const headingCommon = "scroll-mt-24 font-semibold tracking-tight";

  const defaults: Components = {
    h1: ({ node, ...props }) => (
      <h1
        className={`text-3xl md:text-4xl ${headingCommon} mt-6 mb-4 border-b pb-2`}
        {...props}
      />
    ),
    h2: ({ node, ...props }) => (
      <h2
        className={`text-2xl md:text-3xl ${headingCommon} mt-8 mb-3 border-b pb-1`}
        {...props}
      />
    ),
    h3: ({ node, ...props }) => (
      <h3
        className={`text-xl md:text-2xl ${headingCommon} mt-6 mb-2`}
        {...props}
      />
    ),
    h4: ({ node, ...props }) => (
      <h4
        className={`text-lg md:text-xl ${headingCommon} mt-5 mb-2`}
        {...props}
      />
    ),
    h5: ({ node, ...props }) => (
      <h5
        className={`text-base md:text-lg ${headingCommon} mt-4 mb-2`}
        {...props}
      />
    ),
    h6: ({ node, ...props }) => (
      <h6
        className={`text-sm md:text-base ${headingCommon} mt-4 mb-2 uppercase text-muted-foreground`}
        {...props}
      />
    ),

    p: ({ node, ...props }) => <p className="leading-7 my-3" {...props} />,

    a: ({ node, ...props }) => (
      <a
        className="underline underline-offset-4 decoration-2 hover:decoration-4"
        target="_blank"
        rel="noreferrer"
        // style={{ border: "2px solid green" }}
        {...props}
      />
    ),

    // Code & pre blocks
    // code: ({ node, inline, className: cn, children, ...props }) => {
    //   if (inline) {
    //     return (
    //       <code
    //         className={`rounded px-1 py-0.5 text-[0.95em] bg-neutral-100 dark:bg-neutral-800 ${
    //           cn || ""
    //         }`}
    //         {...props}
    //       >
    //         {children}
    //       </code>
    //     );
    //   }
    //   return (
    //     <code className={`block ${cn || ""}`} {...props}>
    //       {children}
    //     </code>
    //   );
    // },
    pre: ({ node, ...props }) => (
      <pre
        className="border border-neutral-200 dark:border-neutral-800 p-4 overflow-x-auto bg-neutral-50 dark:bg-neutral-900 shadow-sm"
        {...props}
      />
    ),

    // Blockquote
    blockquote: ({ node, ...props }) => (
      <blockquote
        //   dark:text-neutral-200
        className="border-l-4 border-neutral-300 dark:border-neutral-700 pl-4 italic text-neutral-700 "
        // style={{ border: "2px solid red" }}
        {...props}
      />
    ),

    // Lists
    ul: ({ node, ...props }) => (
      <ul className="list-disc pl-6 my-3 space-y-1" {...props} />
    ),
    ol: ({ node, ...props }) => (
      <ol className="list-decimal pl-6 my-3 space-y-1" {...props} />
    ),
    li: ({ node, ...props }) => (
      <li className="marker:text-neutral-500" {...props} />
    ),

    // Horizontal rule
    hr: ({ node, ...props }) => (
      <hr
        className="my-6 border-neutral-200 dark:border-neutral-800"
        {...props}
      />
    ),

    // TABLES — emphasized because react-markdown defaults look rough
    table: ({ node, ...props }) => (
      <div className="my-6 overflow-x-auto border border-neutral-300 dark:border-neutral-700 shadow-sm">
        <table className="w-full border-collapse text-sm" {...props} />
      </div>
    ),
    thead: ({ node, ...props }) => (
      <thead className="bg-neutral-100 dark:bg-neutral-900/40" {...props} />
    ),
    tbody: ({ node, ...props }) => (
      <tbody
        className="divide-y divide-neutral-200 dark:divide-neutral-800"
        {...props}
      />
    ),
    tr: ({ node, ...props }) => (
      <tr
        className="hover:bg-neutral-50 dark:hover:bg-neutral-900/30 transition-colors"
        {...props}
      />
    ),
    th: ({ node, ...props }) => (
      <th
        className="text-left font-semibold px-3 py-2 border border-neutral-300 dark:border-neutral-700 align-middle"
        {...props}
      />
    ),
    td: ({ node, ...props }) => (
      <td
        className="px-3 py-2 border border-neutral-200 dark:border-neutral-800 align-top"
        {...props}
      />
    ),
    caption: ({ node, ...props }) => (
      <caption
        className="caption-bottom text-xs text-neutral-500 py-2"
        {...props}
      />
    ),
  };

  return (
    <div
      className={[
        base,
        // subtle container spacing without constraining width
        "[&_img]: [&_img]:shadow-sm",
        className || "",
      ].join(" ")}
    >
      <Markdown
        remarkPlugins={[remarkGfm]}
        // rehypePlugins={[
        //   rehypeSlug,
        //   [rehypeAutolinkHeadings, { behavior: "wrap" }],
        // ]}
        components={{ ...defaults, ...(components || {}) }}
      >
        {content}
      </Markdown>
    </div>
  );
};

export default PrettyMarkdown;
