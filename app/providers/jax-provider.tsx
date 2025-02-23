"use client";
import { MathJaxContext } from "better-react-mathjax";
import React from "react";
const config = {
  loader: { load: ["input/asciimath", "output/chtml"] },
  "fast-preview": {
    disabled: true,
  },
  asciimath: {
    displaystyle: true,
    delimiters: [
      ["$", "$"],
      ["`", "`"],
    ],
  },
  tex2jax: {
    inlineMath: [
      ["$", "$"],
      ["\\(", "\\)"],
      ["\\{", "\\}"],
    ],
    displayMath: [
      ["$$", "$$"],
      ["\\[", "\\]"],
      ["\\{", "\\}"],
    ],
  },
  messageStyle: "none",
};
export const JaxProvider = ({ children }: { children: React.ReactNode }) => {
  return <MathJaxContext config={config}>{children}</MathJaxContext>;
};
