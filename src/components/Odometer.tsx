import React from "react";

interface OdometerProps {
  value: number;
  digits?: number;
}

export const Odometer: React.FC<OdometerProps> = ({ value, digits = 6 }) => {
  const formatted = String(value).padStart(digits, "0");
  const digitChars = formatted.split("");

  return (
    <div
      role="status"
      aria-label={`Rescued pages odometer count: ${value}`}
      className="inline-flex items-center gap-1 p-1 bg-black border-2 border-winborder shadow-[inset_2px_2px_4px_rgba(0,0,0,0.8)] rounded"
    >
      {digitChars.map((char, idx) => {
        const num = parseInt(char, 10);
        return (
          <div
            key={idx}
            className="odometer-col w-5 relative select-none"
          >
            <div
              className="odometer-track flex flex-col text-center font-pixel text-glitch-green text-xs"
              style={{
                transform: `translateY(-${num * 28}px)`,
              }}
            >
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                <div key={n} className="h-[28px] flex items-center justify-center">
                  {n}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
