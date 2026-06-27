import { useState, useEffect, useCallback } from "react";
import InputPanel from "./InputPanel";
import RecommendationTabs from "./RecommendationTabs";
import VolunteerSidebar from "./VolunteerSidebar";
import MajorDetailModal from "./MajorDetailModal";
import CollegeDetailCard from "./CollegeDetailCard";
import MajorDeepDive from "./MajorDeepDive";
import { getRecommendations, loadVolunteerList, saveVolunteerList } from "./utils";

// Loading skeleton for cards
function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden animate-pulse">
      <div className="h-1.5 bg-gray-200" />
      <div className="p-5 space-y-3">
        <div className="flex justify-between">
          <div className="space-y-2"><div className="h-5 w-40 bg-gray-200 rounded" /><div className="h-3 w-28 bg-gray-100 rounded" /></div>
          <div className="h-6 w-12 bg-gray-200 rounded-full" />
        </div>
        <div className="h-2 w-full bg-gray-100 rounded-full" />
        <div className="bg-gray-50 rounded-xl p-3 space-y-2">
          <div className="h-3 w-32 bg-gray-200 rounded" />
          <div className="grid grid-cols-3 gap-2">
            <div className="h-10 bg-gray-100 rounded" /><div className="h-10 bg-gray-100 rounded" /><div className="h-10 bg-gray-100 rounded" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-12 bg-gray-50 rounded-xl" /><div className="h-12 bg-gray-50 rounded-xl" /><div className="h-12 bg-gray-50 rounded-xl" />
        </div>
        <div className="h-10 bg-gray-200 rounded-xl" />
      </div>
    </div>
  );
}

export default function App() {
  const [recommendations, setRecommendations] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [volunteerList, setVolunteerList] = useState(() => loadVolunteerList());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedMajor, setSelectedMajor] = useState(null);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [currentPriority, setCurrentPriority] = useState("balanced");
  const [filterType, setFilterType] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [filterLevel, setFilterLevel] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [guizhouPrefs, setGuizhouPrefs] = useState({ wantStayGZ: false, careerFocus: false });

  useEffect(() => { saveVolunteerList(volunteerList); }, [volunteerList]);

  const handleSearch = useCallback((params) => {
    setLoading(true);
    setCurrentPriority(params.priorityMode);
    setSearched(true);
    // Use rAF + setTimeout to ensure loading skeleton renders first
    requestAnimationFrame(() => {
      setTimeout(() => {
        const results = getRecommendations({ ...params, guizhouPrefs });
        setRecommendations(results);
        setLoading(false);
        setFilterType("");
        setFilterCity("");
        setFilterLevel("");
        setSearchKeyword("");
        requestAnimationFrame(() => {
          document.getElementById("results-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }, 300);
    });
  }, []);

  const handleAddVolunteer = useCallback((data) => {
    setVolunteerList(prev => {
      const key = data.selectedMajor ? `${data.college.id}-${data.selectedMajor.id}` : `${data.college.id}`;
      return prev.some(v => {
        const vKey = v.selectedMajor ? `${v.college.id}-${v.selectedMajor.id}` : `${v.college.id}`;
        return vKey === key;
      }) ? prev : [...prev, data];
    });
  }, []);
  const handleRemoveVolunteer = useCallback((key) => {
    setVolunteerList(prev => prev.filter(v => {
      const vKey = v.selectedMajor ? `${v.college.id}-${v.selectedMajor.id}` : `${v.college.id}`;
      return vKey !== key;
    }));
  }, []);
  const handleMoveUp = useCallback((index) => {
    if (index === 0) return;
    setVolunteerList(prev => { const l = [...prev]; [l[index-1],l[index]]=[l[index],l[index-1]]; return l; });
  }, []);
  const handleMoveDown = useCallback((index) => {
    setVolunteerList(prev => { if (index >= prev.length-1) return prev; const l = [...prev]; [l[index],l[index+1]]=[l[index+1],l[index]]; return l; });
  }, []);

  const volunteerCollegeIds = volunteerList.map(v => v.college.id);
  // 按 collegeId 分组的志愿条目，传给 CollegeCard 用于单专业级别去重
  const volunteerEntriesByCollege = {};
  for (const v of volunteerList) {
    if (!volunteerEntriesByCollege[v.college.id]) volunteerEntriesByCollege[v.college.id] = [];
    volunteerEntriesByCollege[v.college.id].push(v);
  }
  const availableTypes = [...new Set(recommendations.map(r => r.college.type))];
  const availableCities = [...new Set(recommendations.map(r => r.college.city))];
  const availableLevels = [...new Set(recommendations.map(r => r.college.level))];

  const filteredRecommendations = recommendations.filter(r => {
    if (filterType && r.college.type !== filterType) return false;
    if (filterCity && r.college.city !== filterCity) return false;
    if (filterLevel && r.college.level !== filterLevel) return false;
    if (searchKeyword) {
      const kw = searchKeyword.toLowerCase();
      const matchCollege = r.college.name.toLowerCase().includes(kw) || r.college.city.toLowerCase().includes(kw);
      const matchMajor = r.recommendedMajors.some(m => m.name.toLowerCase().includes(kw) || (m.category || '').toLowerCase().includes(kw));
      if (!matchCollege && !matchMajor) return false;
    }
    return true;
  });

  const priorityLabel = { balanced: "综合推荐", major: "专业优先", college: "院校优先" };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-gray-100 shadow-sm">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <svg className="w-4.5 h-4.5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" />
              </svg>
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-800 leading-tight">高报助手 · 高分段版</h1>
              <p className="text-[10px] text-gray-400">贵州 · 4000位次以前 · 专业+院校</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(true)}
            className="relative flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold transition">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12" />
            </svg>
            志愿表
            {volunteerList.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {volunteerList.length}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6">
          {/* Left: Input */}
          <div className="lg:sticky lg:top-20 lg:self-start">
            <InputPanel onSearch={handleSearch} loading={loading} />
          </div>

          {/* Right: Results */}
          <section>
            {!searched ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-5">
                  <svg className="w-10 h-10 text-blue-400" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-700 mb-2">欢迎使用高报助手</h3>
                <p className="text-gray-400 text-sm max-w-md mb-4">
                  请在左侧填写高考信息，选择填报策略（综合/专业优先/院校优先），点击「开始推荐」获取智能推荐。
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-700 max-w-md text-left">
                  <p className="font-bold mb-1">📋 贵州新高考要点：</p>
                  <p>• 采用"3+1+2"模式，物理类/历史类分别划线</p>
                  <p>• 本科批可填<strong>96个"专业+院校"平行志愿</strong></p>
                  <p>• 投档按"分数优先、遵循志愿"原则</p>
                  <p>• 建议冲稳保比例：冲刺20-30%、稳妥40-50%、保底20-30%</p>
                </div>
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg w-full">
                  <div className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm">
                    <div className="text-2xl mb-1">🎯</div>
                    <div className="text-xs font-bold text-gray-700">精准定位</div>
                    <div className="text-[10px] text-gray-400 mt-0.5">基于位次智能匹配</div>
                  </div>
                  <div className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm">
                    <div className="text-2xl mb-1">📊</div>
                    <div className="text-xs font-bold text-gray-700">数据分析</div>
                    <div className="text-[10px] text-gray-400 mt-0.5">多年录取趋势分析</div>
                  </div>
                  <div className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm">
                    <div className="text-2xl mb-1">💼</div>
                    <div className="text-xs font-bold text-gray-700">就业导向</div>
                    <div className="text-[10px] text-gray-400 mt-0.5">专业前景深度剖析</div>
                  </div>
                </div>
              </div>
            ) : loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div>
                      <h2 className="text-lg font-bold text-gray-800">推荐结果</h2>
                      <p className="text-xs text-gray-400 mt-0.5">
                        策略：<span className="text-blue-600 font-medium">{priorityLabel[currentPriority]}</span>
                        · 共 <span className="text-blue-600 font-bold">{filteredRecommendations.length}</span> 所
                        {searchKeyword && <span className="ml-1 text-blue-400">· 搜索"{searchKeyword}"</span>}
                        {guizhouPrefs.wantStayGZ && <span className="ml-1 text-emerald-600">· 🏔️ 偏好留黔</span>}
                        {guizhouPrefs.careerFocus && <span className="ml-1 text-amber-600">· 💼 重视就业</span>}
                        {recommendations.length !== filteredRecommendations.length && <span className="text-gray-300">（已筛选）</span>}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 items-center">
                    <div className="relative">
                      <svg className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                      </svg>
                      <input
                        type="text"
                        value={searchKeyword}
                        onChange={e => setSearchKeyword(e.target.value)}
                        placeholder="搜索院校/专业"
                        className="pl-7 pr-2.5 py-1 text-xs border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 w-36"
                      />
                      {searchKeyword && (
                        <button onClick={() => setSearchKeyword("")} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                        </button>
                      )}
                    </div>
                    <select value={filterType} onChange={e => setFilterType(e.target.value)}
                      className="px-2.5 py-1 text-xs border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500">
                      <option value="">全部类型</option>
                      {availableTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <select value={filterLevel} onChange={e => setFilterLevel(e.target.value)}
                      className="px-2.5 py-1 text-xs border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500">
                      <option value="">全部层次</option>
                      {availableLevels.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                    <select value={filterCity} onChange={e => setFilterCity(e.target.value)}
                      className="px-2.5 py-1 text-xs border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500">
                      <option value="">全部城市</option>
                      {availableCities.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    {(filterType || filterCity || filterLevel || searchKeyword) && (
                      <button onClick={() => { setFilterType(""); setFilterCity(""); setFilterLevel(""); setSearchKeyword(""); }}
                        className="px-2.5 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded-lg">清除筛选</button>
                    )}
                    <div className="flex gap-2 ml-auto">
                      <button onClick={() => setGuizhouPrefs(p => ({...p, wantStayGZ: !p.wantStayGZ}))}
                        className={`px-2.5 py-1 text-xs rounded-lg border transition flex items-center gap-1 ${
                          guizhouPrefs.wantStayGZ ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white text-gray-500 border-gray-200 hover:border-emerald-300'
                        }`}>🏔️ 留贵州</button>
                      <button onClick={() => setGuizhouPrefs(p => ({...p, careerFocus: !p.careerFocus}))}
                        className={`px-2.5 py-1 text-xs rounded-lg border transition flex items-center gap-1 ${
                          guizhouPrefs.careerFocus ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-gray-500 border-gray-200 hover:border-amber-300'
                        }`}>💼 重就业</button>
                    </div>
                  </div>
                </div>
                <RecommendationTabs
                  recommendations={filteredRecommendations}
                  onAddVolunteer={handleAddVolunteer}
                  onShowMajorDetail={setSelectedMajor}
                  onShowCollegeDetail={setSelectedCollege}
                  volunteerCollegeIds={volunteerCollegeIds}
                  volunteerEntriesByCollege={volunteerEntriesByCollege}
                />
              </>
            )}
          </section>
        </div>
      </main>

      <VolunteerSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)}
        volunteerList={volunteerList} onRemove={(key) => handleRemoveVolunteer(key)}
        onMoveUp={handleMoveUp} onMoveDown={handleMoveDown} />
      
      {/* Major Detail Modal */}
      <MajorDetailModal major={selectedMajor} onClose={() => setSelectedMajor(null)} />
      
      {/* College Detail Modal */}
      {selectedCollege && (
        <CollegeDetailCard collegeId={selectedCollege} onClose={() => setSelectedCollege(null)} />
      )}
      
      {/* Major Deep Dive Modal */}
      {selectedMajor && <MajorDeepDive major={selectedMajor} onClose={() => setSelectedMajor(null)} />}

      <footer className="text-center py-5 text-[11px] text-gray-300 border-t border-gray-50 mt-8">
        高报助手 · 高分段版 — 数据来自公开信息整理，专业评价与就业/薪资信息可能存在口径差异；本工具仅供辅助对比与参考，不替代省级招考院与高校官方发布的招生计划与录取规则
      </footer>
    </div>
  );
}

