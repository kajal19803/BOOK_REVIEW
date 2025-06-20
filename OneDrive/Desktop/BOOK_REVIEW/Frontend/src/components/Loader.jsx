import  { useEffect, useState } from "react";

const Loader = () => {
  const text = "Loading BookVerse...";
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text.charAt(index));
        setIndex((prev) => prev + 1);
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [index, text]);

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center">
      <img
        src="/book.png"
        alt="BookVerse Logo"
        className="w-20 h-20 animate-pulse"
      />
      <p className="mt-3 text-purple-700 font-semibold text-lg font-mono">
        {displayedText}
      </p>
    </div>
  );
};

export default Loader;



