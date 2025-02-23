interface Objective {
  id: number;
  description: string;
  completed: boolean;
}

interface ObjectivesListProps {
  objectives: Objective[];
  currentObjective: number;
}

export function ObjectivesList({
  objectives,
  currentObjective,
}: ObjectivesListProps) {
  return (
    <div className="bg-gray-100 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Learning Objectives
      </h2>
      <ul className="space-y-3">
        {objectives.map((objective) => (
          <li
            key={objective.id}
            className={`flex items-center space-x-3 ${
              objective.id === currentObjective
                ? "text-indigo-600 font-medium"
                : objective.completed
                  ? "text-green-600"
                  : "text-gray-600"
            }`}
          >
            {objective.completed ? (
              <svg
                className="w-5 h-5 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            )}
            <span>{objective.description}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
