import { useEffect, useRef, useState } from "react";

interface LoadingScreenProps {
  onComplete: () => void;
}

const letters = ["H", "u", "Q", "Q", "a"];

const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const doneRef = useRef(false);
  const [visible, setVisible] = useState<boolean[]>(() => letters.map(() => false));
  const [phase3, setPhase3] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const ids: number[] = [];

    ids.push(window.setTimeout(() => {
      setVisible((v) => {
        const n = [...v];
        n[0] = true;
        return n;
      });
    }, 50));

    const rest = [1, 2, 3, 4];
    rest.forEach((idx, i) => {
      ids.push(
        window.setTimeout(() => {
          setVisible((v) => {
            const n = [...v];
            n[idx] = true;
            return n;
          });
        }, 400 + i * 80)
      );
    });

    ids.push(window.setTimeout(() => setPhase3(true), 900));
    ids.push(window.setTimeout(() => setFadeOut(true), 1400));
    ids.push(
      window.setTimeout(() => {
        if (doneRef.current) return;
        doneRef.current = true;
        onComplete();
      }, 1800)
    );

    return () => ids.forEach((id) => window.clearTimeout(id));
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background transition-opacity duration-500 ${fadeOut ? "opacity-0" : "opacity-100"}`}
      style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
    >
      <div
        className={`flex items-baseline justify-center transition-transform duration-500 ${phase3 ? "translate-y-0" : "-translate-y-2"}`}
        style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
      >
        {letters.map((ch, i) => (
          <span
            key={i}
            className={`font-display text-[120px] font-light italic text-primary md:text-[180px] ${visible[i] ? "opacity-100" : "opacity-0"}`}
            style={{
              animation: visible[i] ? "loading-letter 0.35s cubic-bezier(0.16, 1, 0.3, 1) both" : undefined,
            }}
          >
            {ch}
          </span>
        ))}
      </div>
      <div
        className="mt-4 h-[1px] bg-primary"
        style={{
          width: phase3 ? 120 : 0,
          transition: "width 500ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      />
    </div>
  );
};

export default LoadingScreen;
