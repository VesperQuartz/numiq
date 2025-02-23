import { Skeleton } from "./ui/skeleton";

export function QuestionDisplay({
  question,
  isLoading,
}: {
  question: string | undefined;
  isLoading: boolean;
}) {
  if (isLoading) {
    return <Skeleton className="w-full h-20 bg-gray-500" />;
  }
  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-md w-full">
      <h2 className="text-xl font-semibold text-gray-800">{question}</h2>
    </div>
  );
}
