import { useRef } from "react";
import { getTierColor } from "./utils";

export default function VolunteerSidebar({ open, onClose, volunteerList, onRemove, onMoveUp, onMoveDown }) {
  const printRef = useRef(null);

  // 导出为图片
  const handleExport = async () => {
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(printRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
      });
      const link = document.createElement("a");
      link.download = `志愿表_${new Date().toLocaleDateString("zh-CN")}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      alert("导出失败，请重试");
      console.error(err);
    }
  };

  // 打印
  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html><head><title>志愿表</title>
      <style>
        body { font-family: -apple-system, "Microsoft YaHei", sans-serif; padding: 20px; }
        table { width: 100%; border-collapse: collapse; font-size: 13px; }
        th, td { border: 1px solid #e5e7eb; padding: 8px 12px; text-align: left; }
        th { background: #f8fafc; font-weight: 600; }
        .tier-rush { color: #dc2626; } .tier-safe { color: #2563eb; } .tier-sure { color: #16a34a; }
        h1 { text-align: center; font-size: 18px; margin-bottom: 16px; }
        .footer { margin-top: 16px; font-size: 11px; color: #94a3b8; text-align: center; }
      </style></head><body>
      <h1>🎓 高报助手 · 我的志愿表</h1>
      <table>
        <thead><tr><th>序号</th><th>院校</th><th>专业</th><th>梯度</th><th>概率</th></tr></thead>
        <tbody>
          ${volunteerList.map((v, i) => `
            <tr>
              <td>${i + 1}</td>
              <td>${v.college.name}（${v.college.city}）</td>
              <td>${v.selectedMajor ? v.selectedMajor.name : v.recommendedMajors.map((m) => m.name).join("、")}</td>
              <td class="tier-${v.tier === "冲刺" ? "rush" : v.tier === "稳妥" ? "safe" : "sure"}">${v.tier}</td>
              <td>${v.probability}%</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
      <div class="footer">生成时间：${new Date().toLocaleString("zh-CN")} | 以上数据均为模拟数据，仅供参考</div>
      </body></html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  // 统计
  const stats = {
    冲刺: volunteerList.filter((v) => v.tier === "冲刺").length,
    稳妥: volunteerList.filter((v) => v.tier === "稳妥").length,
    保底: volunteerList.filter((v) => v.tier === "保底").length,
  };

  return (
    <>
      {/* 遮罩 */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity"
          onClick={onClose}
        />
      )}
      {/* 侧边栏 */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-[420px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* 头部 */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
              我的志愿表
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">共 {volunteerList.length} 个志愿</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 统计提示 */}
        <div className="px-5 py-3 bg-blue-50 border-b border-blue-100">
          <div className="flex gap-3 text-xs">
            <span className="text-red-600">冲刺 {stats.冲刺}</span>
            <span className="text-blue-600">稳妥 {stats.稳妥}</span>
            <span className="text-green-600">保底 {stats.保底}</span>
          </div>
          <p className="text-[11px] text-blue-500 mt-1">建议：冲刺2-3个、稳妥3-4个、保底2-3个</p>
        </div>

        {/* 志愿列表 */}
        <div className="flex-1 overflow-y-auto" style={{ height: "calc(100% - 230px)" }}>
          <div ref={printRef}>
            {volunteerList.length === 0 ? (
              <div className="text-center py-16">
                <svg className="w-16 h-16 mx-auto text-gray-200 mb-3" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Zm3.75 11.625a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                </svg>
                <p className="text-gray-400 text-sm">暂无志愿</p>
                <p className="text-gray-300 text-xs mt-1">从推荐列表中添加院校</p>
              </div>
            ) : (
              <div className="p-4 space-y-3">
                {volunteerList.map((v, index) => {
                  const tc = getTierColor(v.tier);
                  return (
                    <div
                      key={v.college.id}
                      className={`border ${tc.border} rounded-xl p-3 bg-white hover:shadow-md transition-shadow`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-gray-400 w-5">#{index + 1}</span>
                            <span className="font-bold text-gray-800 text-sm truncate">{v.college.name}</span>
                          </div>
                          <div className="ml-7 mt-1">
                            <div className="text-xs text-gray-500">
                              {v.recommendedMajors.map((m) => m.name).join("、")}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${tc.badge}`}>{v.tier}</span>
                          <span className={`text-xs font-bold ${tc.text}`}>{v.probability}%</span>
                        </div>
                      </div>
                      {/* 操作按钮 */}
                      <div className="flex items-center gap-1 mt-2 ml-7">
                        <button
                          onClick={() => onMoveUp(index)}
                          disabled={index === 0}
                          className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 transition"
                          title="上移"
                        >
                          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                          </svg>
                        </button>
                        <button
                          onClick={() => onMoveDown(index)}
                          disabled={index === volunteerList.length - 1}
                          className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 transition"
                          title="下移"
                        >
                          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                          </svg>
                        </button>
                        <button
                          onClick={() => onRemove(v.selectedMajor ? `${v.college.id}-${v.selectedMajor.id}` : `${v.college.id}`)}
                          className="p-1 rounded hover:bg-red-50 transition ml-auto"
                          title="删除"
                        >
                          <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* 底部操作 */}
        {volunteerList.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 flex gap-2">
            <button
              onClick={handleExport}
              className="flex-1 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition flex items-center justify-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              导出图片
            </button>
            <button
              onClick={handlePrint}
              className="flex-1 py-2.5 bg-gray-100 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-200 transition flex items-center justify-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z" />
              </svg>
              打印
            </button>
          </div>
        )}
      </div>
    </>
  );
}

