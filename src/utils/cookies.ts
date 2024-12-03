import Cookies from "js-cookie";

type SameSiteType = "strict" | "lax" | "none" | undefined;

interface CookieOptions {
  expires?: number | Date;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: SameSiteType;
}

const isProd = import.meta.env.PROD;

const DEFAULT_OPTIONS: CookieOptions = {
  path: "/",
  secure: true,
  sameSite: "lax" as SameSiteType,
  expires: 7,
};
export function SET_COOKIE(value: string) {
  try {
    const options: CookieOptions = {
      ...DEFAULT_OPTIONS,
      ...(isProd
        ? {
            secure: true,
            sameSite: "none" as SameSiteType,
          }
        : {}),
    };

    REMOVE_COOKIE();
    console.log("準備設置 cookie，選項：", options);
    Cookies.set("GT_ACCESS_TOKEN", value, options);

    // 驗證是否設置成功
    const savedCookie = Cookies.get("GT_ACCESS_TOKEN");
    if (savedCookie) console.log("Cookie 設置成功:", savedCookie);
  } catch (error) {
    console.error("設置 Cookie 時發生錯誤:", error);
  }
}

export function GET_COOKIE(key: string = "GT_ACCESS_TOKEN") {
  return Cookies.get(key);
}

export function REMOVE_COOKIE(key: string = "GT_ACCESS_TOKEN") {
  Cookies.remove(key, DEFAULT_OPTIONS);
  Cookies.remove("refreshToken", DEFAULT_OPTIONS);
}

export function EXISTS_COOKIE(key: string = "GT_ACCESS_TOKEN") {
  return !!Cookies.get(key);
}
