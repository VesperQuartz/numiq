import React from "react";
import { useQueryState } from "nuqs";
import { Button } from "./ui/button";
import { Loader2Icon } from "lucide-react";

type Topic = {
  id: number;
  name: string;
  description: string;
  url: string;
};

const topics: Topic[] = [
  {
    id: 1,
    name: "Algebraic Equations",
    description: "Practice solving linear and quadratic equations",
    url: "algebraic-equations",
  },
  {
    id: 2,
    name: "Geometry Problems",
    description: "Explore shapes, areas, and spatial reasoning",
    url: "geometry-problems",
  },
  {
    id: 3,
    name: "Word Problems",
    description: "Apply math concepts to real-world scenarios",
    url: "word-problems",
  },
  {
    id: 4,
    name: "Calculus",
    description: "Test your skills in solving integral problems",
    url: "calculus",
  },
];

interface TopicSelectionProps {
  onSelectTopic: (topicId: number) => void;
  isLoading: boolean;
}

export function TopicSelection({
  onSelectTopic,
  isLoading,
}: TopicSelectionProps) {
  const [selectedTopic, setSelectedTopic] = React.useState<number | null>(null);
  const [_type, setType] = useQueryState("type", {
    clearOnDefault: true,
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Select a Topic to Study</h2>
      <div className="space-y-4">
        {topics.map((topic) => (
          <button
            key={topic.id}
            className={`w-full text-left p-4 rounded-lg transition-all duration-200 ${
              selectedTopic === topic.id
                ? "bg-indigo-100 text-indigo-800 border-2 border-indigo-500"
                : "bg-white text-gray-800 border border-gray-300 hover:bg-gray-50"
            }`}
            onClick={() => {
              setType(topic.url);
              setSelectedTopic(topic.id);
            }}
          >
            <h3 className="font-semibold">{topic.name}</h3>
            <p className="text-sm text-gray-600 mt-1">{topic.description}</p>
          </button>
        ))}
      </div>
      <div className="flex justify-end">
        <Button
          onClick={() => {
            if (selectedTopic) {
              onSelectTopic(selectedTopic);
            }
          }}
          disabled={!selectedTopic}
        >
          {isLoading ? (
            <Loader2Icon className="animate-spin" />
          ) : (
            "Start Studying"
          )}
        </Button>
      </div>
    </div>
  );
}
