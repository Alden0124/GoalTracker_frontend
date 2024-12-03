const Home = () => {
  return (
    <div>
      {/* 第一部分 */}
      <section
        className={`text-center px-[15px] bg-blue-50 dark:bg-background-dark h-[700px] pt-[200px]`}
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
      <section
        className={`text-center px-[15px] h-[700px] pt-[200px]`}
      >
        <h1 className={`text-[50px]  dark:text-foreground-dark`}>
          設定期望目標
        </h1>
        <p
          className={`text-[20px] text-gray-600 dark:text-foreground-dark pt-[20px]`}
        >
          利用 SMART
          目標設定方法，幫你制定清晰、可行的目標。為每個目標設定里程碑，追蹤進度。
        </p>
      </section>
    </div>
  );
};

export default Home;
