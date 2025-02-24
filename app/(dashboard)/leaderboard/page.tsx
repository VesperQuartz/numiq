"use client";

import { useGetLeaderboard } from "@/app/hooks/api";

const LeaderboardPage = () => {
  const leaderboard = useGetLeaderboard();
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="pt-16 flex items-center justify-center p-4 min-h-screen">
        <div className="max-w-4xl w-full space-y-8 bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="bg-indigo-600 p-6">
            <h1 className="text-3xl font-bold text-center text-white">
              NumiQ Leaderboard
            </h1>
          </div>
          <div className="p-8">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b-2 border-gray-200">
                  <th className="pb-4 font-semibold text-gray-600">Rank</th>
                  <th className="pb-4 font-semibold text-gray-600">Name</th>
                  <th className="pb-4 font-semibold text-gray-600">Points</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.data?.map((board, index) => (
                  <tr key={board.user.id} className="border-b border-gray-200">
                    <td className="py-4 text-gray-800">{index + 1}</td>
                    <td className="py-4 text-gray-800">
                      {board.user.username}
                    </td>
                    <td className="py-4 text-gray-800">
                      {board.leaderboard.points}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
