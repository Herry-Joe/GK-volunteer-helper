import { useState, useMemo } from "react";
import { getTierColor, getLevelBadge } from "./utils";
import { collegeWebsites, majors as allMajors } from "./data";

// 折叠面板组件
function CollapsibleSection({ title, children, defaultOpen = false, icon, badge, count }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-2.5 bg-gray-50 hover:bg-gray-100 transition cursor-pointer"
      >
        <div className="flex items-center gap-1.5">
          {icon && <span className="text-sm">{icon}</span>}
          <span className="text-xs font-semibold text-gray-600">{title}</span>
          {count !== undefined && <span className="text-[10px] bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-full">{count}</span>}
          {badge && <span className="text-[9px] bg-blue-100 text-blue-700 px-1 py-0.5 rounded-full font-medium">{badge}</span>}
        </div>
        <svg 
          className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} 
          fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
      {open && (
        <div className="p-2.5 bg-white">
          {children}
        </div>
      )}
    </div>
  );
}

// 单个专业行组件
function MajorRow({ major, onAddVolunteer, onShowDetail, isAdded }) {
  const roast = major.roast;
  return (
    <div className="group border border-gray-100 hover:border-blue-200 rounded-xl p-2.5 transition bg-white hover:bg-blue-50/30">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          {/* 专业名 + 标签 */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button onClick={() => onShowDetail(major)} className="text-sm font-bold text-gray-800 hover:text-blue-600 transition cursor-pointer truncate">
              {major.name}
            </button>
            {major.category && major.category !== '待分类' && (
              <span className="text-[10px] bg-gray-100 text-gray-600 px-1 py-0.5 rounded flex-shrink-0">{major.category}</span>
            )}
            {major.hot && <span className="text-[10px] bg-red-100 text-red-600 px-1 py-0.5 rounded flex-shrink-0">🔥热</span>}
            {major.shGrade && (
              <span className={`text-[10px] px-1 py-0.5 rounded font-bold leading-none flex-shrink-0 ${
                major.shGrade === "A+" ? "bg-red-100 text-red-700" :
                major.shGrade === "A"  ? "bg-orange-100 text-orange-700" :
                major.shGrade === "A-" ? "bg-amber-100 text-amber-700" :
                major.shGrade.startsWith("B") ? "bg-teal-100 text-teal-700" :
                "bg-gray-100 text-gray-600"
              }`}>{major.shGrade}</span>
            )}
            {major.duration && <span className="text-[10px] text-gray-400 flex-shrink-0">{major.duration}年制</span>}
          </div>
          {/* 数据行 */}
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            {major.plan2026 && (
              <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded-full border border-emerald-200">招{major.plan2026}人</span>
            )}
            {major.tuition && (
              <span className="text-[10px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded-full border border-amber-200">{major.tuition}元/年</span>
            )}
            {major.avgSalary && (
              <span className="text-[10px] text-gray-400">💰 {major.avgSalary}</span>
            )}
          </div>
          {/* 备注 */}
          {major.note && (
            <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-2 leading-relaxed" title={major.note}>📝 {major.note}</p>
          )}
          {/* 锐评 */}
          {roast && (
            <p className="text-[10px] text-amber-600 mt-0.5 leading-relaxed italic">💬 {roast}</p>
          )}
        </div>
        {/* 加入按钮 */}
        <button
          onClick={() => onAddVolunteer(major)}
          disabled={isAdded}
          className={`flex-shrink-0 px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
            isAdded
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95 shadow-sm"
          }`}
        >
          {isAdded ? "已选" : "+ 志愿"}
        </button>
      </div>
    </div>
  );
}


export default function CollegeCard({ data, onAddVolunteer, onShowMajorDetail, onShowCollegeDetail, volunteerEntries }) {
  const { college, probability, tier, latestMinRank, latestMinScore, recommendedMajors, historyData, trend } = data;
  const tierColor = getTierColor(tier);
  const levelClass = getLevelBadge(college.level);
  const [showAllMajors, setShowAllMajors] = useState(false);
  const [majorFilter, setMajorFilter] = useState("");
  const website = collegeWebsites[college.id];

  // 该院校的所有专业（从 allMajors 中取）
  const collegeAllMajors = useMemo(() => {
    return allMajors.filter(m => m.collegeId === college.id);
  }, [college.id]);

  // 筛选后的专业列表
  const filteredMajors = useMemo(() => {
    const list = showAllMajors ? collegeAllMajors : recommendedMajors;
    if (!majorFilter) return list;
    const kw = majorFilter.toLowerCase();
    return list.filter(m => 
      m.name.toLowerCase().includes(kw) || 
      (m.category || '').toLowerCase().includes(kw) ||
      (m.roast || '').toLowerCase().includes(kw)
    );
  }, [showAllMajors, collegeAllMajors, recommendedMajors, majorFilter]);

  // 已加入的专业ID集合
  const addedMajorIds = useMemo(() => {
    return new Set((volunteerEntries || []).map(e => e.selectedMajor?.id));
  }, [volunteerEntries]);

  // 添加指定专业到志愿表
  const handleAddMajor = (major) => {
    onAddVolunteer({
      college: data.college,
      probability: data.probability,
      tier: data.tier,
      latestMinRank: data.latestMinRank,
      latestMinScore: data.latestMinScore,
      recommendedMajors: data.recommendedMajors,
      historyData: data.historyData,
      trend: data.trend,
      selectedMajor: major,
      distanceFromGZ: data.distanceFromGZ,
      distanceScore: data.distanceScore,
      returnHomeIndex: data.returnHomeIndex,
      industryStrength: data.industryStrength,
    });
  };

  const displayList = showAllMajors ? collegeAllMajors : recommendedMajors;

  return (
    <div className={`bg-white rounded-2xl border ${tierColor.border} shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden fade-in`}>
      {/* Top gradient bar */}
      <div className={`h-1.5 ${
        tier === "冲刺" ? "bg-gradient-to-r from-red-400 to-orange-400" :
        tier === "稳妥" ? "bg-gradient-to-r from-blue-400 to-cyan-400" :
        "bg-gradient-to-r from-green-400 to-emerald-400"
      }`} />

      <div className="p-4">
        {/* 院校头部信息 */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-gray-900 truncate">{college.name}</h3>
              <button onClick={() => onShowCollegeDetail?.(college.id)} className="text-blue-500 hover:text-blue-700 p-0.5" title="院校详情">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                </svg>
              </button>
            </div>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-sm text-gray-500">
                <svg className="w-3.5 h-3.5 inline mr-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
                {college.city} · {college.province}
              </span>
              {data.distanceFromGZ != null && data.distanceFromGZ > 0 && (
                <span className="text-[10px] bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded-full border border-orange-200" title="距贵阳约">
                  🚄 {data.distanceFromGZ <= 500 ? '近' : data.distanceFromGZ <= 1200 ? '中' : '远'} ({data.distanceFromGZ}km)
                </span>
              )}
              {data.returnHomeIndex >= 60 && (
                <span className="text-[10px] bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded-full border border-emerald-200" title="回黔就业便利度">
                  🏠 回黔{data.returnHomeIndex >= 85 ? '极易' : '较易'}
                </span>
              )}
              <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${levelClass}`}>{college.level}</span>
              {college.tags?.[0] && <span className="text-[10px] text-gray-400">{college.tags[0]}</span>}
            </div>
          </div>
          <span className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-bold ${tierColor.badge}`}>{tier}</span>
        </div>

        {/* 官网链接 */}
        {website && (
          <a href={website} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 mb-3 group">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
            </svg>
            访问官网
            <svg className="w-3 h-3 opacity-0 group-hover:opacity-100 transition" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
            </svg>
          </a>
        )}

        {/* 概率和位次 */}
        <div className="bg-gray-50 rounded-xl p-3 mb-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">录取参考概率</span>
              <span className={`text-lg font-black tabular-nums ${tierColor.text}`}>{probability}%</span>
            </div>
            <div className="text-right">
              {latestMinScore && <div className="text-xs text-gray-500">2025最低 <span className="font-bold text-gray-700">{latestMinScore}</span>分</div>}
              {latestMinRank && <div className="text-[10px] text-gray-400">位次 {latestMinRank.toLocaleString()}</div>}
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className={`h-2 rounded-full transition-all duration-700 ${tierColor.progress}`} style={{ width: `${probability}%` }} />
          </div>
          {trend && (
            <div className="flex items-center gap-1 mt-1.5">
              <span className="text-xs">{trend.icon}</span>
              <span className={`text-[11px] font-medium ${trend.color}`}>{trend.label}</span>
              {trend.pctChange !== undefined && <span className="text-[10px] text-gray-400">({Math.abs(trend.pctChange)}%)</span>}
            </div>
          )}
        </div>

        {/* 专业列表 */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-700">📋 专业列表</span>
              <span className="text-[10px] text-gray-400">
                {showAllMajors ? `全部 ${collegeAllMajors.length} 个` : `推荐 ${recommendedMajors.length} 个`}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              {collegeAllMajors.length > recommendedMajors.length && (
                <button
                  onClick={() => setShowAllMajors(!showAllMajors)}
                  className="text-[11px] text-blue-600 hover:text-blue-800 px-2 py-0.5 rounded-lg hover:bg-blue-50 transition"
                >
                  {showAllMajors ? "收起" : `查看全部 ${collegeAllMajors.length} 个专业`}
                </button>
              )}
            </div>
          </div>

          {/* 专业搜索框 */}
          {showAllMajors && collegeAllMajors.length > 6 && (
            <div className="relative mb-2">
              <svg className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              <input
                type="text"
                value={majorFilter}
                onChange={e => setMajorFilter(e.target.value)}
                placeholder="搜索专业名称/分类"
                className="w-full pl-7 pr-2.5 py-1.5 text-xs border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
              />
              {majorFilter && (
                <button onClick={() => setMajorFilter("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                </button>
              )}
            </div>
          )}

          {/* 专业列表 */}
          <div className="space-y-1.5 max-h-[480px] overflow-y-auto pr-1">
            {filteredMajors.length > 0 ? filteredMajors.map(m => (
              <MajorRow
                key={m.id}
                major={m}
                onAddVolunteer={handleAddMajor}
                onShowDetail={onShowMajorDetail}
                isAdded={addedMajorIds.has(m.id)}
              />
            )) : (
              <div className="text-center py-4 text-gray-400 text-xs">
                {majorFilter ? "没有匹配的专业" : "暂无专业数据"}
              </div>
            )}
          </div>
        </div>

        {/* 贵州产业匹配 */}
        {data.industryStrength >= 60 && (
          <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-xl mb-2">
            <div className="flex items-center gap-1.5">
              <span className="text-xs">🏭</span>
              <span className="text-[11px] text-emerald-700 font-medium">贵州产业匹配度高</span>
              <span className="text-[10px] bg-emerald-200 text-emerald-800 px-1.5 py-0.5 rounded-full ml-auto font-bold">{data.industryStrength}分</span>
            </div>
            {[...new Set(data.recommendedMajors.flatMap(m => (m.gzIndustryMatch || []).map(g => g.name)))].slice(0,2).map(ind => (
              <p key={ind} className="text-[10px] text-emerald-600 mt-0.5 ml-5">· {ind}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

