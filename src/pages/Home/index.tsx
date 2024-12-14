import { FaBell, FaChartBar, FaChartLine } from "react-icons/fa";
import { Fragment } from "react/jsx-runtime";

const Home = () => {
  const secondSectionList = [
    {
      id: 1,
      title: "目標設定與追蹤",
      description: "輕鬆創建和管理您的個人目標，設定里程碑，並實時追蹤進度。",
    },
    {
      id: 2,
      title: "數據分析與洞察",
      description: "通過直觀的圖表和報告，深入了解您的目標達成情況和效率提升。",
    },
    {
      id: 3,
      title: "智能提醒系統",
      description: "根據您的目標和進度，接收個性化的提醒和建議，保持動力。",
    },
  ];

  return (
    <div>
      {/* 第一部分 */}
      <section
        className={`text-center px-[15px] bg-gradient-to-b from-blue-50 to-white dark:bg-background-dark h-[700px] pt-[200px]`}
      >
        <h1 className={`text-[35px] md:text-[50px] dark:text-foreground-dark`}>
          追蹤你的目標，實現你的夢想
        </h1>
        <p
          className={`text-[18px] md:text-[20px] text-gray-600 dark:text-foreground-dark pt-[20px]`}
        >
          GoalTracker
          幫助你設定、追蹤並實現你的目標。利用我們的智能系統，輕鬆管理進度，提高效率。
        </p>
        <button className="btn-primary w-[100px] md:w-[140px] mt-[20px] hover:bg-bg-button-light/90 transform hover:scale-105 transition-all">
          立即開始
        </button>
      </section>

      {/* 第二部分 */}
      <section className="text-center px-[15px] py-[100px]">
        <h1 className="text-[35px] md:text-[50px] dark:text-foreground-dark mb-[60px]">
          GoalTracker 核心功能
        </h1>

        <div className=" mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {secondSectionList.map((item) => (
            <Fragment key={item.id}>
              <div className="p-8 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex justify-center mb-6">
                  {item.id === 1 && (
                    <FaChartLine className="w-12 h-12 text-blue-500" />
                  )}
                  {item.id === 2 && (
                    <FaChartBar className="w-12 h-12 text-blue-500" />
                  )}
                  {item.id === 3 && (
                    <FaBell className="w-12 h-12 text-blue-500" />
                  )}
                </div>
                <h3 className="text-xl font-semibold mb-4">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {item.description}
                </p>
              </div>
            </Fragment>
          ))}
        </div>
      </section>

      {/* 第三部分 */}
      <section className="min-h-[700px] w-full py-20 bg-blue-50 flex items-center">
        <div className="container px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            準備好開始您的目標追蹤之旅了嗎？
          </h2>
          <p className="mx-auto max-w-[700px] text-gray-600 text-xl mb-8">
            加入
            GoalTracker，讓我們一起將您的夢想變為現實。無論是個人成長、職業發展還是健康目標，我們都在這裡支持您。
          </p>
          <button className="btn-primary w-[100px] md:w-[140px] mt-[20px] hover:bg-bg-button-light/90 transform hover:scale-105 transition-all">
            立即註冊
          </button>
        </div>
      </section>

      <footer className="w-full bg-gray-900 text-gray-100 py-12">
        <div className="  px-[50px]">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold">GoalTracker</h3>
              <p className="text-sm text-gray-400">追蹤目標，實現夢想</p>
            </div>
            <div className="text-center md:text-right">
              <h4 className="font-medium mb-2">聯絡我們</h4>
              <div className="text-sm text-gray-400">
                Email: h0989541162@gmail.com
              </div>
              <div className="text-sm text-gray-400 mt-[8px]">
                電話: 0989541162
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-6 pt-6 text-center">
            <p className="text-sm text-gray-400">
              © 2024 GoalTracker. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
