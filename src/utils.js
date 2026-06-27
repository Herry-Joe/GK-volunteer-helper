import { colleges, admissionData, collegeMajors, majors, collegeMajorRanks, majorProspects } from "./data";

// Pre-built index for O(1) major lookup
const majorsById = {};
for (const m of majors) majorsById[m.id] = m;

// ============================================================
// 位次趋势分析 - 计算近三年位次变化
// ============================================================
export function getRankTrend(historyData) {
  if (!historyData || historyData.length < 2) return { direction: "stable", change: 0, label: "数据不足" };
  const sorted = [...historyData].sort((a, b) => b.year - a.year);
  const latest = sorted[0].minRank;
  const oldest = sorted[sorted.length - 1].minRank;
  const change = latest - oldest;
  const pctChange = oldest > 0 ? Math.round((change / oldest) * 100) : 0;

  // 位次数字变小 = 录取难度增大（更难考）
  if (change < -50) return { direction: "harder", change: Math.abs(change), pctChange: Math.abs(pctChange), label: "录取趋紧", icon: "📈", color: "text-red-500" };
  if (change > 50) return { direction: "easier", change, pctChange, label: "录取趋松", icon: "📉", color: "text-green-500" };
  return { direction: "stable", change: Math.abs(change), pctChange: Math.abs(pctChange), label: "基本持平", icon: "➡️", color: "text-gray-500" };
}

// ============================================================
// 位次估分工具 - 根据位次估算大致分数范围
// ============================================================
export function estimateScore(rank, province, subjectType) {
  // Build a sorted list of (rank, score) from all colleges' latest data for this province
  const points = [];
  for (const college of colleges) {
    const pd = admissionData[college.id]?.[province]?.[subjectType];
    if (!pd || pd.length === 0) continue;
    let latest = pd[0];
    for (let j = 1; j < pd.length; j++) if (pd[j].year > latest.year) latest = pd[j];
    points.push({ rank: latest.minRank, score: latest.minScore });
  }
  points.sort((a, b) => a.rank - b.rank);
  if (points.length === 0) return null;

  // Binary search for interpolation
  if (rank <= points[0].rank) return { score: points[0].score + 5, range: `${points[0].score + 5}+` };
  if (rank >= points[points.length - 1].rank) return { score: points[points.length - 1].score - 5, range: `<${points[points.length - 1].score}` };

  for (let i = 0; i < points.length - 1; i++) {
    if (rank >= points[i].rank && rank <= points[i + 1].rank) {
      const ratio = (rank - points[i].rank) / (points[i + 1].rank - points[i].rank);
      const est = Math.round(points[i].score - ratio * (points[i].score - points[i + 1].score));
      return { score: est, range: `${est - 3} ~ ${est + 3}` };
    }
  }
  return null;
}

// ============================================================
// 贵州省一分一段参考（2024物理类高分段，模拟数据）
// ============================================================
export const guizhouScoreTable = [
  { score: 690, rank: 25, cumulative: 25 },
  { score: 685, rank: 20, cumulative: 45 },
  { score: 680, rank: 30, cumulative: 75 },
  { score: 675, rank: 45, cumulative: 120 },
  { score: 670, rank: 60, cumulative: 180 },
  { score: 665, rank: 70, cumulative: 250 },
  { score: 660, rank: 85, cumulative: 335 },
  { score: 655, rank: 100, cumulative: 435 },
  { score: 650, rank: 120, cumulative: 555 },
  { score: 645, rank: 140, cumulative: 695 },
  { score: 640, rank: 160, cumulative: 855 },
  { score: 635, rank: 180, cumulative: 1035 },
  { score: 630, rank: 200, cumulative: 1235 },
  { score: 625, rank: 220, cumulative: 1455 },
  { score: 620, rank: 250, cumulative: 1705 },
  { score: 615, rank: 280, cumulative: 1985 },
  { score: 610, rank: 310, cumulative: 2295 },
  { score: 605, rank: 340, cumulative: 2635 },
  { score: 600, rank: 370, cumulative: 3005 },
];

// ============================================================
// 推荐算法 - 三种优先模式
// ============================================================
export function getRecommendations({ province, rank, subjectType, majorKeywordIds, preferredCities, priorityMode, guizhouPrefs = {} }) {
  const results = [];
  const majorIdSet = new Set(majorKeywordIds);
  const citySet = new Set(preferredCities);
  const useMajorFilter = majorIdSet.size > 0;
  const useCityFilter = citySet.size > 0;
  const levelOrder = { C9: 0, "985": 1, "211": 2, 双一流: 3 };

  for (let i = 0; i < colleges.length; i++) {
    const college = colleges[i];
    const collegeData = admissionData[college.id];
    if (!collegeData) continue;
    const provinceData = collegeData[province];
    if (!provinceData) continue;
    const typeData = provinceData[subjectType];
    if (!typeData || typeData.length === 0) continue;

    // Get latest year data
    let latest = typeData[0];
    for (let j = 1; j < typeData.length; j++) {
      if (typeData[j].year > latest.year) latest = typeData[j];
    }
    const { minRank, minScore } = latest;

    // City filter (relaxed in college-priority mode)
    if (priorityMode !== "college" && useCityFilter && !citySet.has(college.city)) continue;

    // Probability calculation - tuned for high-scoring students
    const ratio = rank / minRank;
    let probability, tier;
    if (ratio <= 0.7) { probability = 99; tier = "保底"; }
    else if (ratio <= 0.85) { probability = Math.max(86, 99 - (ratio - 0.7) * 87 | 0); tier = "保底"; }
    else if (ratio <= 0.95) { probability = Math.max(56, 86 - (ratio - 0.85) * 300 | 0); tier = "稳妥"; }
    else if (ratio <= 1.05) { probability = Math.max(30, 56 - (ratio - 0.95) * 260 | 0); tier = "稳妥"; }
    else if (ratio <= 1.2) { probability = Math.max(8, 30 - (ratio - 1.05) * 147 | 0); tier = "冲刺"; }
    else if (ratio <= 1.5) { probability = Math.max(2, 8 - (ratio - 1.2) * 20 | 0); tier = "冲刺"; }
    else { probability = Math.max(1, 2 - (ratio - 1.5) * 2 | 0); tier = "冲刺"; }
    if (probability > 99) probability = 99;
    if (probability < 1) probability = 1;

    // Recommend majors
    const majorIds = collegeMajors[college.id];
    if (!majorIds || majorIds.length === 0) continue;

    const ranksMap = collegeMajorRanks[college.id];
    const recMajors = [];
    let hasUserMatch = false;

    for (let k = 0; k < majorIds.length && recMajors.length < 3; k++) {
      const mid = majorIds[k];
      const major = majorsById[mid];
      if (!major) continue;
      const isMatch = useMajorFilter && majorIdSet.has(mid);
      if (isMatch) hasUserMatch = true;

      recMajors.push({
        id: mid,
        name: major.name,
        category: major.category,
        description: major.description,
        courses: major.courses,
        careers: major.careers,
        advice: major.advice,
        hot: major.hot,
        avgSalary: major.avgSalary,
        matchScore: useMajorFilter ? (isMatch ? 100 : 20) : 50,
        shRank: ranksMap?.[mid]?.rank ?? null,
        shGrade: ranksMap?.[mid]?.grade ?? null,
        prospect: majorProspects[mid] ?? null,
        plan2026: major.plan2026 ?? null,
        tuition: major.tuition ?? null,
        duration: major.duration ?? null,
        note: major.note ?? null,
        sourcePage: major.sourcePage ?? null,
        roast: major.roast ?? null,
        gzIndustryMatch: major.gzIndustryMatch ?? [],
      });
    }

    // Major match filter
    if (priorityMode === "major" && useMajorFilter && !hasUserMatch) continue;
    if (priorityMode !== "college" && useMajorFilter && !hasUserMatch) continue;

    // Sort score
    const baseLevel = levelOrder[college.level] ?? 99;
    const levelScore = baseLevel === 0 ? 100 : baseLevel === 1 ? 80 : baseLevel === 2 ? 60 : 40;
    const matchMax = recMajors.length > 0 ? Math.max(...recMajors.map(m => m.matchScore)) : 0;
    // planBonus: 招生计划越多，录取机会越大（对数缩放，max 10分）
    const totalPlan = recMajors.reduce((s, m) => s + (m.plan2026 || 0), 0);
    const planBonus = totalPlan > 0 ? Math.min(10, Math.log2(totalPlan + 1) * 2) : 0;
    const sortScore = levelScore * 0.35 + probability * 0.3 + matchMax * 0.25 + planBonus;

    // History data sorted by year descending
    const historyData = typeData.slice().sort((a, b) => b.year - a.year);
    const trend = getRankTrend(historyData);

    // 贵州个性化加分
    const distScore = college.distanceScore ?? 50;
    const returnIdx = college.returnHomeIndex ?? 30;
    const bestIndustryStrength = recMajors.reduce((best, m) => {
      const maxS = (m.gzIndustryMatch || []).reduce((s, g) => Math.max(s, g.strength), 0);
      return Math.max(best, maxS);
    }, 0);

    results.push({
      college,
      probability,
      tier,
      latestMinRank: minRank,
      latestMinScore: minScore,
      recommendedMajors: recMajors,
      historyData,
      trend,
      sortScore,
      distanceFromGZ: college.distanceFromGZ ?? null,
      distanceScore: distScore,
      returnHomeIndex: returnIdx,
      industryStrength: bestIndustryStrength,
    });
  }

  // Sort by priority mode
  if (priorityMode === "major") {
    results.sort((a, b) => {
      const aM = Math.max(...a.recommendedMajors.map(m => m.matchScore + (m.shGrade ? 10 : 0)));
      const bM = Math.max(...b.recommendedMajors.map(m => m.matchScore + (m.shGrade ? 10 : 0)));
      return bM !== aM ? bM - aM : b.probability - a.probability;
    });
  } else if (priorityMode === "college") {
    results.sort((a, b) => {
      const aL = levelOrder[a.college.level] ?? 99;
      const bL = levelOrder[b.college.level] ?? 99;
      return aL !== bL ? aL - bL : b.probability - a.probability;
    });
  } else {
    results.sort((a, b) => {
      let aScore = a.sortScore;
      let bScore = b.sortScore;
      // 贵州留省偏好：距离近 + 回黔就业指数高 加分
      if (guizhouPrefs.wantStayGZ) {
        aScore += a.distanceScore * 0.08 + a.returnHomeIndex * 0.06;
        bScore += b.distanceScore * 0.08 + b.returnHomeIndex * 0.06;
      }
      // 重视就业：贵州产业匹配度加分
      if (guizhouPrefs.careerFocus) {
        aScore += a.industryStrength * 0.05;
        bScore += b.industryStrength * 0.05;
      }
      return bScore - aScore;
    });
  }

  return results;
}

export function loadVolunteerList() {
  try { const s = localStorage.getItem("volunteerList"); return s ? JSON.parse(s) : []; } catch { return []; }
}
export function saveVolunteerList(list) { localStorage.setItem("volunteerList", JSON.stringify(list)); }

export function getTierColor(tier) {
  switch (tier) {
    case "冲刺": return { bg:"bg-red-50", border:"border-red-300", text:"text-red-600", badge:"bg-red-100 text-red-700", progress:"bg-red-500" };
    case "稳妥": return { bg:"bg-blue-50", border:"border-blue-300", text:"text-blue-600", badge:"bg-blue-100 text-blue-700", progress:"bg-blue-500" };
    case "保底": return { bg:"bg-green-50", border:"border-green-300", text:"text-green-600", badge:"bg-green-100 text-green-700", progress:"bg-green-500" };
    default: return { bg:"bg-gray-50", border:"border-gray-300", text:"text-gray-600", badge:"bg-gray-100 text-gray-700", progress:"bg-gray-500" };
  }
}

export function getLevelBadge(level) {
  switch (level) {
    case "C9": return "bg-amber-100 text-amber-800 border-amber-300";
    case "985": return "bg-purple-100 text-purple-700 border-purple-300";
    case "211": return "bg-sky-100 text-sky-700 border-sky-300";
    default: return "bg-gray-100 text-gray-600 border-gray-300";
  }
}
