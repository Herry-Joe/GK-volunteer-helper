export default function MajorDetailModal({ major, onClose }) {
  if (!major) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto fade-in" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-5 rounded-t-2xl">
          <button onClick={onClose} className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
          </button>
          <h2 className="text-lg font-bold">{major.name}</h2>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">{major.category}</span>
            {major.hot && <span className="px-2 py-0.5 bg-amber-400/80 text-amber-900 rounded-full text-xs font-bold">🔥 热门</span>}
            {major.avgSalary && <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">💰 {major.avgSalary}</span>}
            {major.plan2026 && <span className="px-2 py-0.5 bg-emerald-400/80 text-emerald-900 rounded-full text-xs font-bold">招{major.plan2026}人</span>}
            {major.tuition && <span className="px-2 py-0.5 bg-amber-400/80 text-amber-900 rounded-full text-xs">{major.tuition}元/年</span>}
            {major.duration && <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">{major.duration}年制</span>}
            {major.shGrade && (
              <span className="px-2 py-0.5 bg-white/30 rounded-full text-xs font-bold">
                软科 {major.shGrade}{major.shRank ? ` · 全国第${major.shRank}名` : ""}
              </span>
            )}
          </div>
        </div>
        <div className="p-5 space-y-4">
          {/* 软科评级详情 */}
          {major.shGrade && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-bold text-blue-800">📊 软科中国大学专业排名</span>
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-black ${
                  major.shGrade === "A+" ? "bg-red-500 text-white" :
                  major.shGrade === "A"  ? "bg-orange-500 text-white" :
                  major.shGrade === "A-" ? "bg-amber-500 text-white" :
                  major.shGrade.startsWith("B") ? "bg-teal-500 text-white" :
                  "bg-gray-400 text-white"
                }`}>
                  {major.shGrade}
                </div>
                <div>
                  {major.shRank && <p className="text-sm font-bold text-gray-800">全国排名第 {major.shRank} 名</p>}
                  <p className="text-[11px] text-gray-500">
                    {major.shGrade === "A+" && "顶尖专业，全国前2%"}
                    {major.shGrade === "A" && "一流专业，全国前2%-10%"}
                    {major.shGrade === "A-" && "优势专业，全国前10%-20%"}
                    {major.shGrade === "B+" && "优秀专业，全国前20%-40%"}
                    {major.shGrade === "B" && "良好专业，全国前40%-60%"}
                    {!["A+","A","A-","B+","B"].includes(major.shGrade) && "该专业具有一定实力"}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div>
            <h3 className="text-xs font-bold text-gray-800 mb-1.5 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-blue-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" /></svg>
              专业概况
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">{major.description}</p>
          </div>
          <div>
            <h3 className="text-xs font-bold text-gray-800 mb-1.5">📚 主要课程</h3>
            <div className="flex flex-wrap gap-1.5">
              {major.courses.map(c => <span key={c} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">{c}</span>)}
            </div>
          </div>
          <div>
            <h3 className="text-xs font-bold text-gray-800 mb-1.5">💼 就业方向</h3>
            <div className="flex flex-wrap gap-1.5">
              {major.careers.map(c => <span key={c} className="px-2 py-0.5 bg-green-50 text-green-700 rounded text-xs">{c}</span>)}
            </div>
          </div>

          {/* 就业前景详情 */}
          {major.prospect && (
            <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-4">
              <h3 className="text-xs font-bold text-gray-800 mb-3 flex items-center gap-1.5">
                📊 专业前景与就业分析
                <span className={`ml-auto text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  major.prospect.trend === "up" ? "bg-green-100 text-green-700" :
                  major.prospect.trend === "down" ? "bg-red-100 text-red-600" :
                  "bg-gray-100 text-gray-600"
                }`}>
                  {major.prospect.trend === "up" ? "📈 上升趋势" : major.prospect.trend === "down" ? "📉 下行趋势" : "➡️ 平稳发展"}
                  {major.prospect.outlook && ` · ${major.prospect.outlook}`}
                </span>
              </h3>

              {/* 五维指标 */}
              <div className="grid grid-cols-5 gap-2 mb-3">
                {[
                  { label: "市场需求", value: major.prospect.demand, color: "#3b82f6", icon: "🔥" },
                  { label: "增长潜力", value: major.prospect.growth, color: "#10b981", icon: "🚀" },
                  { label: "薪资水平", value: major.prospect.salary, color: "#f59e0b", icon: "💰" },
                  { label: "就业稳定", value: major.prospect.stability, color: "#8b5cf6", icon: "🛡️" },
                  { label: "深造价值", value: major.prospect.postgrad, color: "#06b6d4", icon: "🎓" },
                ].map(({ label, value, color, icon }) => {
                  const level = value >= 85 ? "极高" : value >= 70 ? "较高" : value >= 55 ? "中等" : value >= 40 ? "一般" : "偏低";
                  const levelColor = value >= 85 ? "text-green-600" : value >= 70 ? "text-blue-600" : value >= 55 ? "text-amber-600" : "text-gray-500";
                  return (
                    <div key={label} className="text-center">
                      <div className="relative w-12 h-12 mx-auto mb-1">
                        <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                          <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none" stroke="#e5e7eb" strokeWidth="3" />
                          <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none" stroke={color} strokeWidth="3"
                            strokeDasharray={`${value}, 100`}
                            strokeLinecap="round" />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-black text-gray-700">{value}</span>
                      </div>
                      <div className="text-[10px] text-gray-500">{icon}</div>
                      <div className="text-[10px] text-gray-500 font-medium">{label}</div>
                      <div className={`text-[10px] font-bold ${levelColor}`}>{level}</div>
                    </div>
                  );
                })}
              </div>

              {/* 亮点 */}
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-2.5">
                <p className="text-xs text-blue-700 leading-relaxed">💡 {major.prospect.highlight}</p>
              </div>
            </div>
          )}

          {/* PDF招生备注 */}
          {major.note && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
              <h3 className="text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                📝 招生备注
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">{major.note}</p>
            </div>
          )}

          {major.advice && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
              <h3 className="text-xs font-bold text-amber-800 mb-1 flex items-center gap-1">
                💡 高分段报考建议
              </h3>
              <p className="text-xs text-amber-700 leading-relaxed">{major.advice}</p>
            </div>
          )}

          {/* 专业锐评 */}
          {major.roast && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-3">
              <h3 className="text-xs font-bold text-amber-800 mb-1 flex items-center gap-1">
                💬 说句实话
              </h3>
              <p className="text-xs text-amber-700 leading-relaxed">{major.roast}</p>
            </div>
          )}

          {/* 贵州产业匹配 */}
          {major.gzIndustryMatch && major.gzIndustryMatch.length > 0 && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
              <h3 className="text-xs font-bold text-emerald-800 mb-2 flex items-center gap-1">
                🏭 贵州产业匹配
              </h3>
              <div className="space-y-2">
                {major.gzIndustryMatch.map((ind, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-xs bg-emerald-200 text-emerald-800 px-1.5 py-0.5 rounded font-bold flex-shrink-0">{ind.strength}分</span>
                    <div>
                      <span className="text-xs font-bold text-emerald-700">{ind.name}</span>
                      <p className="text-[10px] text-emerald-600 mt-0.5 leading-relaxed">{ind.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 数据来源 */}
          {major.sourcePage && (
            <div className="text-center pt-2">
              <span className="text-[10px] text-gray-300">数据来源：《贵州省2026年普通高校招生专业目录》第{major.sourcePage}页</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


