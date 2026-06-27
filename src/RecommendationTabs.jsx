import { useState } from "react";
import CollegeCard from "./CollegeCard";

const TIERS = [
  { key: "冲刺", icon: "🔥", desc: "位次高于录取线，有一定风险" },
  { key: "稳妥", icon: "✅", desc: "位次接近录取线，参考录取概率较高" },
  { key: "保底", icon: "🛡️", desc: "位次远低于录取线，基本确保录取" },
];

export default function RecommendationTabs({ recommendations, onAddVolunteer, onShowMajorDetail, onShowCollegeDetail, volunteerCollegeIds, volunteerEntriesByCollege = {} }) {
  const [activeTab, setActiveTab] = useState("稳妥");

  const grouped = {
    冲刺: recommendations.filter((r) => r.tier === "冲刺"),
    稳妥: recommendations.filter((r) => r.tier === "稳妥"),
    保底: recommendations.filter((r) => r.tier === "保底"),
  };

  // 默认选中第一个有数据的 tab
  const currentTab = grouped[activeTab]?.length > 0 ? activeTab : TIERS.find((t) => grouped[t.key].length > 0)?.key || activeTab;
  const currentList = grouped[currentTab] || [];

  return (
    <div>
      {/* Tab 按钮 */}
      <div className="flex gap-2 mb-6">
        {TIERS.map((t) => {
          const count = grouped[t.key].length;
          const isActive = currentTab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                isActive
                  ? t.key === "冲刺"
                    ? "bg-red-500 text-white shadow-lg shadow-red-200"
                    : t.key === "稳妥"
                    ? "bg-blue-500 text-white shadow-lg shadow-blue-200"
                    : "bg-green-500 text-white shadow-lg shadow-green-200"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
              }`}
            >
              <span>{t.icon}</span>
              <span>{t.key}</span>
              <span className={`ml-1 text-xs px-1.5 py-0.5 rounded-full ${
                isActive ? "bg-white/20" : "bg-gray-100"
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 当前 Tab 提示 */}
      <div className="mb-4">
        <p className="text-sm text-gray-500">
          {TIERS.find((t) => t.key === currentTab)?.desc}
        </p>
      </div>

      {/* 卡片网格 */}
      {currentList.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {currentList.map((rec) => (
            <CollegeCard
              key={rec.college.id}
              data={rec}
              onAddVolunteer={onAddVolunteer}
              onShowMajorDetail={onShowMajorDetail}
              onShowCollegeDetail={onShowCollegeDetail}
              isInVolunteer={volunteerCollegeIds.includes(rec.college.id)}
              volunteerEntries={volunteerEntriesByCollege[rec.college.id] || []}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl border border-gray-100">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-gray-500 text-sm font-medium">该梯度暂无推荐院校</p>
          <p className="text-gray-400 text-xs mt-1.5">尝试调整分数/位次，或切换其他梯度查看</p>
        </div>
      )}
    </div>
  );
}

