/* eslint-disable @typescript-eslint/no-explicit-any */
import { Skeleton } from "./ui/skeleton";

interface OptionsListProps {
  options: (string | undefined)[] | undefined;
  isLoading: boolean;
  selectedAnswer: string | null;
  setSelectedAnswer: (answer: string) => void;
}

export function OptionsList({
  options,
  selectedAnswer,
  setSelectedAnswer,
  isLoading,
}: OptionsListProps) {
  const optionsList = ["A", "B", "C", "D"];
  if (isLoading) {
    return (
      <>
        <div className="space-y-3">
          <Skeleton className="w-[450px] h-16 bg-gray-500" />
          <Skeleton className="w-[450px] h-16 bg-gray-500" />
          <Skeleton className="w-[450px] h-16 bg-gray-500" />
          <Skeleton className="w-[450px] h-16 bg-gray-500" />
        </div>
      </>
    );
  }
  return (
    <div className="space-y-3">
      {options &&
        options?.map((option: any, index: number) => (
          <button
            key={option}
            className={`flex w-full text-left p-4 rounded-lg transition-all duration-200 ${
              selectedAnswer === option
                ? "bg-indigo-100 text-indigo-800 border-2 border-indigo-500"
                : "bg-white text-gray-800 border border-gray-300 hover:bg-gray-50"
            }`}
            onClick={() => setSelectedAnswer(option)}
          >
            <span className="font-bold mr-2">{optionsList[index]}.</span>
            {option
              .replace("A)", "")
              .replace("B)", "")
              .replace("C)", "")
              .replace("D)", "")
              .replace("A.", "")
              .replace("B.", "")
              .replace("C.", "")
              .replace("D.", "")}
          </button>
        ))}
    </div>
  );
}
