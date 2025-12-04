import { useState, useEffect } from "react";

export const useTypewriter = (texts: string[], speed = 3020) => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setSubIndex((prev) => prev + direction);
    }, speed);

    if (direction === 1 && subIndex === texts[index].length) {
      setTimeout(() => setDirection(-1), 5000);
    } else if (direction === -1 && subIndex === 0) {
      setDirection(1);
      setIndex((prev) => (prev + 1) % texts.length);
    }

    return () => clearInterval(interval);
  }, [subIndex, direction, index, texts, speed]);

  return texts[index].substring(0, subIndex);
};
