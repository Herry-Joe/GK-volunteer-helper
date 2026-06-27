import { useState } from "react";
import { provinces, subjectCombinations, majorKeywords, cityOptions, priorityModes, guizhouPolicy } from "./data";
import { estimateScore, guizhouScoreTable } from "./utils";

export default function InputPanel({ onSearch, loading }) {
  const [province, setProvince] = useState("贵州");
  const [score, setScore] = useState("660");
  const [rank, setRank] = useState("800");
  const [subject, setSubject] = useState("pch");
  const [selectedMajors, setSelectedMajors] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [priorityMode, setPriorityMode] = useState("balanced");
  const [showPolicy, setShowPolicy] = useState(false);
  const [showScoreTable, setShowScoreTable] = useState(false);

  const toggleMajor = (id) => setSelectedMajors(p => p.includes(id) ? p.filter(m => m !== id) : [...p, id]);
  const toggleCity = (city) => setSelectedCities(p => p.includes(city) ? p.filter(c => c !== city) : [...p, city]);

  // Auto-estimate score from rank
  const handleRankChange = (val) => {
    setRank(val);
    const rankNum = parseInt(val, 10);
    if (rankNum > 0) {
      const combo = subjectCombinations.find(s => s.id === subject);
      const est = estimateScore(rankNum, province, combo?.type || "物理类");
      if (est) setScore(String(est.score));
    }
  };

  const handleSearch = () => {
    const rankNum = parseInt(rank, 10);
    if (!rankNum || rankNum <= 0) { alert("请输入有效的位次"); return; }
    const combo = subjectCombinations.find(s => s.id === subject);
    const matchedMajorIds = selectedMajors.flatMap(kid => majorKeywords.find(k => k.id === kid)?.matchMajorIds || []);
    onSearch({
      province, score: parseInt(score, 10) || 0, rank: rankNum,
      subjectType: combo?.type || "物理类",
      majorKeywordIds: [...new Set(matchedMajorIds)],
      preferredCities: selectedCities, priorityMode,
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-5 space-y-4">
      {/* Title */}
      <div className="flex items-center justify-between pb-2 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342" />
          </svg>
          <h2 className="text-base font-bold text-gray-800">考生信息</h2>
        </div>
        <div className="flex gap-1">
          <button onClick={() => setShowScoreTable(!showScoreTable)} className="text-xs text-emerald-500 hover:text-emerald-700 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-emerald-50">
            📊 一分一段
          </button>
          <button onClick={() => setShowPolicy(!showPolicy)} className="text-xs text-blue-500 hover:text-blue-700 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-blue-50">
            📋 贵州政策
          </button>
        </div>
      </div>

      {/* Score table */}
      {showScoreTable && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs fade-in">
          <p className="font-bold text-emerald-800 mb-2">📊 贵州2024物理类一分一段参考（高分段）</p>
          <div className="max-h-40 overflow-y-auto">
            <table className="w-full text-[11px]">
              <thead><tr className="text-emerald-700"><th className="text-left py-1">分数</th><th className="text-right py-1">本段人数</th><th className="text-right py-1">累计位次</th></tr></thead>
              <tbody>
                {guizhouScoreTable.map(row => (
                  <tr key={row.score} className="border-t border-emerald-100">
                    <td className="py-0.5 font-medium text-emerald-800">{row.score}</td>
                    <td className="py-0.5 text-right text-emerald-600">{row.rank}</td>
                    <td className="py-0.5 text-right text-emerald-600">{row.cumulative}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-emerald-500 mt-1.5">* 数据为模拟，仅供参考。实际以贵州省招生考试院公布为准。</p>
        </div>
      )}

      {/* Guizhou policy */}
      {showPolicy && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs fade-in">
          <p className="font-bold text-blue-800 mb-1">{guizhouPolicy.examMode}</p>
          <p className="text-blue-700 mb-2 leading-relaxed">{guizhouPolicy.description}</p>
          <div className="space-y-1 mb-2">
            {guizhouPolicy.batches.map(b => (
              <div key={b.name} className="flex items-start gap-1">
                <span className="text-blue-600 font-medium">{b.name}：</span>
                <span className="text-blue-600">{b.slots}</span>
              </div>
            ))}
          </div>
          <div className="text-blue-500 space-y-0.5">
            {guizhouPolicy.tips.slice(0, 3).map((t, i) => <p key={i}>• {t}</p>)}
          </div>
        </div>
      )}

      {/* Province */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">省份</label>
        <select value={province} onChange={e => setProvince(e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
          {provinces.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      {/* Score and Rank */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">高考总分</label>
          <input type="number" value={score} onChange={e => setScore(e.target.value)} placeholder="如 660"
            className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            全省位次 <span className="text-red-500">*</span>
            <span className="text-gray-400 font-normal ml-1">(输入后自动估分)</span>
          </label>
          <input type="number" value={rank} onChange={e => handleRankChange(e.target.value)} placeholder="如 800"
            className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>

      {/* Subject */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">选科组合</label>
        <select value={subject} onChange={e => setSubject(e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500">
          {subjectCombinations.map(s => <option key={s.id} value={s.id}>{s.label}（{s.type}）{s.popular ? " ★" : ""}</option>)}
        </select>
      </div>

      {/* Priority Mode */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-2">填报策略</label>
        <div className="space-y-2">
          {priorityModes.map(pm => (
            <label key={pm.id} className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition ${
              priorityMode === pm.id ? "border-blue-400 bg-blue-50" : "border-gray-200 hover:border-gray-300"
            }`}>
              <input type="radio" name="priority" value={pm.id} checked={priorityMode === pm.id}
                onChange={e => setPriorityMode(e.target.value)} className="mt-0.5 text-blue-600" />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">{pm.icon}</span>
                  <span className="text-sm font-bold text-gray-800">{pm.label}</span>
                </div>
                <p className="text-[11px] text-gray-500 mt-0.5">{pm.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Major Keywords */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1.5">意向专业（可多选）</label>
        <div className="flex flex-wrap gap-1.5">
          {majorKeywords.map(mk => {
            const active = selectedMajors.includes(mk.id);
            return (
              <button key={mk.id} onClick={() => toggleMajor(mk.id)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition border ${
                  active ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"
                }`}>{mk.label}</button>
            );
          })}
        </div>
      </div>

      {/* Cities */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1.5">意向城市（可多选）</label>
        <div className="flex flex-wrap gap-1.5">
          {cityOptions.map(city => {
            const active = selectedCities.includes(city);
            return (
              <button key={city} onClick={() => toggleCity(city)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition border ${
                  active ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"
                }`}>{city}</button>
            );
          })}
        </div>
      </div>

      {/* Search Button */}
      <button onClick={handleSearch} disabled={loading}
        className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-blue-800 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
        {loading ? (
          <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>分析中...</>
        ) : (
          <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>开始推荐</>
        )}
      </button>
    </div>
  );
}
