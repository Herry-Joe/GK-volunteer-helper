import { useState } from "react";
import { collegeProfiles, collegeProfilesExtended, collegeProfiles985, collegeProfiles985Additional, collegeWebsites } from "./data";

// 图标组件
function ChevronDown({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
    </svg>
  );
}

function BriefcaseIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0" />
    </svg>
  );
}

function AcademicCapIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
    </svg>
  );
}

// 折叠面板组件
function CollapsibleSection({ title, icon, children, defaultOpen = false, badge }) {
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
          {badge && <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-medium">{badge}</span>}
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="p-3 bg-white">
          {children}
        </div>
      )}
    </div>
  );
}

export default function CollegeDetailCard({ collegeId, onClose }) {
  const profile = collegeProfiles[collegeId] || collegeProfilesExtended[collegeId] || collegeProfiles985[collegeId] || collegeProfiles985Additional[collegeId];
  const website = collegeWebsites[collegeId];
  
  if (!profile) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl p-6 max-w-md w-full">
          <p className="text-gray-500 text-center">暂无该校详细数据</p>
          <button onClick={onClose} className="mt-4 w-full py-2 bg-gray-100 rounded-xl text-sm font-medium">关闭</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* 头部 */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 to-blue-700 p-5 rounded-t-2xl">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">{profile.name}</h2>
              <p className="text-blue-100 text-sm mt-1">"{profile.motto}"</p>
              {profile.founded && (
                <p className="text-blue-200 text-xs mt-1">创建于{profile.founded}年</p>
              )}
            </div>
            <button onClick={onClose} className="text-white/80 hover:text-white p-1">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-blue-50 text-sm mt-3 leading-relaxed">{profile.highlight}</p>
          
          {/* 官网链接 */}
          {website && (
            <a 
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xs font-medium transition"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
              </svg>
              访问官网
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
              </svg>
            </a>
          )}
        </div>

        {/* 内容区 */}
        <div className="p-5 space-y-3">
          {/* 办学特色 */}
          <CollapsibleSection 
            title="办学特色" 
            icon={<StarIcon />}
            defaultOpen={true}
            badge="亮点"
          >
            <ul className="space-y-2">
              {profile.features?.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            {profile.campus && (
              <div className="mt-3 p-2 bg-blue-50 rounded-lg text-xs text-blue-700">
                📍 {profile.campus}
              </div>
            )}
          </CollapsibleSection>

          {/* 就业情况 */}
          {profile.employment && (
            <CollapsibleSection 
              title="就业情况" 
              icon={<BriefcaseIcon />}
              badge="数据"
            >
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-green-700">{profile.employment.rate}</div>
                  <div className="text-xs text-green-600">就业率</div>
                </div>
                <div className="bg-amber-50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-amber-700">{profile.employment.avgSalary}</div>
                  <div className="text-xs text-amber-600">平均年薪</div>
                </div>
                {profile.employment.postgradRate && (
                  <div className="bg-blue-50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-blue-700">{profile.employment.postgradRate}</div>
                    <div className="text-xs text-blue-600">深造率</div>
                  </div>
                )}
                {profile.employment.overseasRate && (
                  <div className="bg-purple-50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-purple-700">{profile.employment.overseasRate}</div>
                    <div className="text-xs text-purple-600">出国率</div>
                  </div>
                )}
              </div>
              
              {profile.employment.topEmployers && (
                <div className="mb-3">
                  <div className="text-xs text-gray-500 mb-1.5">主要雇主</div>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.employment.topEmployers.map((e, i) => (
                      <span key={i} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">{e}</span>
                    ))}
                  </div>
                </div>
              )}
              
              {profile.employment.industries && (
                <div>
                  <div className="text-xs text-gray-500 mb-1.5">就业行业</div>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.employment.industries.map((ind, i) => (
                      <span key={i} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">{ind}</span>
                    ))}
                  </div>
                </div>
              )}
            </CollapsibleSection>
          )}

          {/* 特别说明 */}
          {profile.specialNote && (
            <CollapsibleSection 
              title="报考提示" 
              icon={<AcademicCapIcon />}
            >
              <div className="p-3 bg-amber-50 rounded-lg text-sm text-amber-800">
                💡 {profile.specialNote}
              </div>
            </CollapsibleSection>
          )}
        </div>
      </div>
    </div>
  );
}
