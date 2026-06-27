import { useState } from "react";

// 图标组件
function ChevronDown({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
  );
}

// 折叠面板
function Accordion({ title, children, defaultOpen = false, icon, count }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition cursor-pointer"
      >
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm font-semibold text-gray-700">{title}</span>
          {count !== undefined && (
            <span className="text-[10px] bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-full">{count}</span>
          )}
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="p-3 bg-white">{children}</div>}
    </div>
  );
}

// 雷达图组件（简化版）
function RadarChart({ data }) {
  const labels = Object.keys(data);
  const values = Object.values(data);
  const maxVal = 100;
  const center = 60;
  const radius = 50;
  
  const points = labels.map((_, i) => {
    const angle = (Math.PI * 2 * i) / labels.length - Math.PI / 2;
    const val = values[i] / maxVal;
    return {
      x: center + radius * val * Math.cos(angle),
      y: center + radius * val * Math.sin(angle)
    };
  });
  
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
  
  return (
    <svg viewBox="0 0 120 120" className="w-full max-w-[180px] mx-auto">
      {/* 背景圆环 */}
      {[0.25, 0.5, 0.75, 1].map((scale, i) => (
        <circle
          key={i}
          cx={center}
          cy={center}
          r={radius * scale}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="0.5"
        />
      ))}
      {/* 轴线 */}
      {labels.map((_, i) => {
        const angle = (Math.PI * 2 * i) / labels.length - Math.PI / 2;
        return (
          <line
            key={i}
            x1={center}
            y1={center}
            x2={center + radius * Math.cos(angle)}
            y2={center + radius * Math.sin(angle)}
            stroke="#e5e7eb"
            strokeWidth="0.5"
          />
        );
      })}
      {/* 数据区域 */}
      <path d={pathD} fill="rgba(59, 130, 246, 0.2)" stroke="#3b82f6" strokeWidth="1.5" />
      {/* 数据点 */}
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="2.5" fill="#3b82f6" />
      ))}
      {/* 标签 */}
      {labels.map((label, i) => {
        const angle = (Math.PI * 2 * i) / labels.length - Math.PI / 2;
        const labelRadius = radius + 15;
        const x = center + labelRadius * Math.cos(angle);
        const y = center + labelRadius * Math.sin(angle);
        return (
          <text
            key={i}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-[8px] fill-gray-500"
          >
            {label}
          </text>
        );
      })}
    </svg>
  );
}

export default function MajorDeepDive({ major, onClose }) {
  if (!major) return null;
  
  const prospect = major.prospect || {};
  const radarData = {
    "需求": prospect.demand || 70,
    "增长": prospect.growth || 60,
    "薪资": prospect.salary || 65,
    "稳定": prospect.stability || 75,
    "深造": prospect.postgrad || 50
  };
  
  const trendIcon = prospect.trend === "up" ? "📈" : prospect.trend === "down" ? "📉" : "➡️";
  const trendColor = prospect.trend === "up" ? "text-green-600" : prospect.trend === "down" ? "text-red-500" : "text-gray-500";
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* 头部 */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-indigo-600 to-purple-600 p-5 rounded-t-2xl">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">{major.name}</h2>
                {major.category && (
                  <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full">{major.category}</span>
                )}
                {major.hot && (
                  <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">🔥 热门</span>
                )}
              </div>
              <p className="text-indigo-100 text-sm mt-2 leading-relaxed">{major.description}</p>
            </div>
            <button onClick={onClose} className="text-white/80 hover:text-white p-1">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* 核心指标 */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-white">{major.avgSalary || "15-30万"}</div>
              <div className="text-xs text-indigo-200">平均年薪</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <div className="flex items-center justify-center gap-1">
                <span className="text-lg">{trendIcon}</span>
                <span className={`text-lg font-bold ${trendColor === 'text-green-600' ? 'text-green-300' : trendColor === 'text-red-500' ? 'text-red-300' : 'text-gray-300'}`}>
                  {prospect.outlook || "稳定"}
                </span>
              </div>
              <div className="text-xs text-indigo-200">前景展望</div>
            </div>
          </div>
        </div>

        {/* 内容区 */}
        <div className="p-5 space-y-3">
          {/* 雷达图 */}
          <Accordion title="能力雷达图" icon="📊" defaultOpen={true}>
            <RadarChart data={radarData} />
            <div className="grid grid-cols-5 gap-2 mt-3">
              {Object.entries(radarData).map(([key, val]) => (
                <div key={key} className="text-center">
                  <div className="text-[10px] text-gray-400">{key}</div>
                  <div className="text-sm font-bold text-blue-600">{val}</div>
                </div>
              ))}
            </div>
          </Accordion>

          {/* 核心课程 */}
          {major.courses && (
            <Accordion 
              title="核心课程" 
              icon="📚" 
              count={major.courses.length}
            >
              <div className="flex flex-wrap gap-2">
                {major.courses.map((c, i) => (
                  <span key={i} className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1.5 rounded-lg">
                    {c}
                  </span>
                ))}
              </div>
            </Accordion>
          )}

          {/* 就业方向 */}
          {major.careers && (
            <Accordion 
              title="就业方向" 
              icon="💼" 
              count={major.careers.length}
            >
              <div className="space-y-2">
                {major.careers.map((c, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                    <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold">
                      {i + 1}
                    </span>
                    <span className="text-sm text-gray-700">{c}</span>
                  </div>
                ))}
              </div>
            </Accordion>
          )}

          {/* 深度分析 */}
          <Accordion title="深度分析" icon="🔍">
            <div className="space-y-3">
              {/* 优势 */}
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="text-xs font-bold text-green-700 mb-1">✅ 优势</div>
                <ul className="text-xs text-green-600 space-y-1">
                  {prospect.trend === "up" && <li>• 行业处于上升期，人才需求持续增长</li>}
                  {prospect.salary >= 70 && <li>• 薪资水平较高，回报可观</li>}
                  {prospect.demand >= 75 && <li>• 市场需求旺盛，就业机会多</li>}
                  {prospect.stability >= 70 && <li>• 职业稳定性好，抗风险能力强</li>}
                </ul>
              </div>
              
              {/* 挑战 */}
              <div className="p-3 bg-amber-50 rounded-lg">
                <div className="text-xs font-bold text-amber-700 mb-1">⚠️ 挑战</div>
                <ul className="text-xs text-amber-600 space-y-1">
                  {prospect.postgrad >= 70 && <li>• 深造比例高，本科就业竞争力有限</li>}
                  {prospect.stability < 60 && <li>• 行业变化快，需要持续学习</li>}
                  {prospect.growth < 50 && <li>• 行业增长放缓，竞争加剧</li>}
                </ul>
              </div>
              
              {/* 建议 */}
              {major.advice && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-xs font-bold text-blue-700 mb-1">💡 报考建议</div>
                  <p className="text-xs text-blue-600 leading-relaxed">{major.advice}</p>
                </div>
              )}
            </div>
          </Accordion>

          {/* 学科等级 */}
          {major.shGrade && (
            <Accordion title="学科评估等级" icon="🏆">
              <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg">
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold ${
                  major.shGrade === "A+" ? "bg-red-500 text-white" :
                  major.shGrade === "A" ? "bg-orange-500 text-white" :
                  major.shGrade === "A-" ? "bg-amber-500 text-white" :
                  major.shGrade.startsWith("B") ? "bg-teal-500 text-white" :
                  "bg-gray-500 text-white"
                }`}>
                  {major.shGrade}
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-800">全国学科评估</div>
                  <div className="text-xs text-gray-500">教育部第四轮/第五轮学科评估结果</div>
                  <div className="text-xs text-amber-600 mt-1">该专业在全国的排名位于前列</div>
                </div>
              </div>
            </Accordion>
          )}
        </div>
      </div>
    </div>
  );
}
