import { useTranslation } from "react-i18next";
import { FaBullseye, FaLightbulb, FaUsers } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";

const Home = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(["home"]);
  const secondSectionList = [
    {
      id: 1,
      title: t("home:secondSectionTitle1"),
      description: t("home:secondSectionDescription1"),
    },
    {
      id: 2,
      title: t("home:secondSectionTitle2"),
      description: t("home:secondSectionDescription2"),
    },
    {
      id: 3,
      title: t("home:secondSectionTitle3"),
      description: t("home:secondSectionDescription3"),
    },
  ];

  return (
    <div className="dark:bg-background-dark">
      {/* 第一部分 */}
      <section className="text-center px-[15px] bg-gradient-to-b from-blue-50 to-white dark:from-background-dark dark:to-background-dark h-[600px] pt-[200px] md:h-[700px] md:pt-[200px]">
        <h1 className="text-[35px] w md:text-[50px] dark:text-foreground-dark">
          {t("home:title")}
        </h1>
        <p className="text-[18px] max-w-[1000px] mx-auto md:text-[20px] text-gray-600 dark:text-foreground-dark pt-[20px]">
          {t("home:description")}
        </p>
        <button
          onClick={() => {
            navigate("/auth/signIn");
          }}
          className="btn-primary w-[100px] md:w-[140px] mt-[20px] hover:bg-bg-button-light/90 dark:hover:bg-bg-button-dark/90 transform hover:scale-105 transition-all"
        >
          {t("home:firstSectionButton")}
        </button>
      </section>

      {/* 第二部分 */}
      <section className="text-center px-[15px] py-[100px] md:py-[300px] dark:bg-background-dark">
        <h1 className="text-[35px] md:text-[50px] dark:text-foreground-dark mb-[60px]">
          {t("home:secondSectionTitle")}
        </h1>

        <div className="mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {secondSectionList.map((item) => (
            <Fragment key={item.id}>
              <div className="p-8 rounded-lg border border-gray-200 dark:border-gray-700 shadow-[0_0_10px_rgba(0,0,0,0.1)] dark:bg-card-dark">
                <div className="flex justify-center mb-6">
                  {item.id === 1 && (
                    <FaBullseye className="w-12 h-12 text-blue-500 dark:text-blue-400" />
                  )}
                  {item.id === 2 && (
                    <FaUsers className="w-12 h-12 text-blue-500 dark:text-blue-400" />
                  )}
                  {item.id === 3 && (
                    <FaLightbulb className="w-12 h-12 text-blue-500 dark:text-blue-400" />
                  )}
                </div>
                <h3 className="text-xl font-semibold mb-4 dark:text-foreground-dark">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {item.description}
                </p>
              </div>
            </Fragment>
          ))}
        </div>
      </section>

      {/* 第三部分 */}
      <section className="min-h-[700px] w-full py-20 bg-blue-50 dark:bg-background-dark flex justify-center items-center">
        <div className="container px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 dark:text-foreground-dark">
            {t("home:thirdSectionTitle")}
          </h2>
          <p className="mx-auto max-w-[700px] text-gray-600 dark:text-gray-300 text-xl mb-8">
            {t("home:thirdSectionDescription")}
          </p>
          <button
            onClick={() => {
              navigate("/auth/signIn");
            }}
            className="btn-primary w-[100px] md:w-[140px] mt-[20px] hover:bg-bg-button-light/90 dark:hover:bg-bg-button-dark/90 transform hover:scale-105 transition-all"
          >
            {t("home:thirdSectionButton")}
          </button>
        </div>
      </section>

      <footer className="w-full bg-gray-900 text-gray-100 py-14">
        <div className="px-[50px]">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0 text-center md:text-left space-y-2">
              <h3 className="text-xl font-bold">{t("home:footerTitle")}</h3>
              <p className="text-sm text-gray-400">
                {t("home:footerDescription")}
              </p>
            </div>
            <div className="text-center md:text-right space-y-2">
              <h4 className="font-medium ">{t("home:footerContactTitle")}</h4>
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
