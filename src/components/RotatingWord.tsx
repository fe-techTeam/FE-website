"use client";

import { useEffect, useRef, useState } from "react";

type RotatingWordProps = {
  words: string[];
  /** Milliseconds each word stays on screen before swapping to the next. */
  interval?: number;
  className?: string;
};

/** Cycles through `words` one at a time, in sequence, looping forever. */
export default function RotatingWord({ words, interval = 1500, className = "" }: RotatingWordProps) {
  const [index, setIndex] = useState(0);
  const wordsRef = useRef(words);
  wordsRef.current = words;

  useEffect(() => {
    if (wordsRef.current.length <= 1) return;

    const timer = window.setInterval(() => {
      setIndex((i) => (i + 1) % wordsRef.current.length);
    }, interval);

    return () => window.clearInterval(timer);
  }, [interval]);

  return (
    <span className={`rotating-word ${className}`.trim()}>
      <span key={index} className="rotating-word__item">
        {words[index]}
      </span>
    </span>
  );
}
