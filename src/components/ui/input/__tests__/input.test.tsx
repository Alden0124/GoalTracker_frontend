import { fireEvent, render, screen } from "@testing-library/react";
import Input from "../index";

describe("Input Component", () => {
  // 基本渲染測試
  it("應該正確渲染帶有標籤的輸入框", () => {
    render(<Input label="電子郵件" id="email" />);
    expect(screen.getByLabelText("電子郵件")).toBeInTheDocument();
  });

  // 錯誤訊息測試
  describe("Input 錯誤訊息", () => {
    it("應該顯示錯誤訊息", () => {
      // 1. 渲染帶有錯誤訊息的輸入框
      render(<Input label="電子郵件" error="請輸入有效的電子郵件" />);
      // 2. 確認錯誤訊息有顯示在畫面上
      expect(screen.getByText("請輸入有效的電子郵件")).toBeInTheDocument();
    });

    // 可以添加更多錯誤相關的測試
    it("沒有錯誤時不應該顯示錯誤訊息", () => {
      render(<Input label="電子郵件" />);

      // 確認畫面上沒有錯誤訊息元素
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
  });

  // 密碼類型測試
  describe("密碼輸入框", () => {
    it("應該能切換密碼顯示/隱藏", () => {
      render(<Input type="password" label="密碼" id="password" />);
      // 使用 type 屬性查找密碼輸入框
      const input = screen.getByLabelText("密碼") as HTMLInputElement;
      expect(input.type).toBe("password");

      // 點擊眼睛圖標
      const toggleButton = screen.getByRole("button");
      fireEvent.click(toggleButton);

      // 應該變成 text
      expect(input.type).toBe("text");
    });

    it("應該正確渲染密碼輸入框的圖標按鈕", () => {
      render(<Input type="password" label="密碼" id="password" />);

      // 確認眼睛圖標存在
      const toggleButton = screen.getByRole("button");
      expect(toggleButton).toBeInTheDocument();
    });
  });

  // 日期類型測試
  describe("日期輸入框", () => {
    it("應該有正確的日期選擇器樣式", () => {
      // 1. 渲染日期輸入框
      render(<Input type="date" />);
      // 2. 查找空值的輸入框
      // getByDisplayValue("")：查找顯示值為空的輸入元素
      // as HTMLInputElement：將找到的元素轉型為 HTMLInputElement 類型
      const input = screen.getByDisplayValue("") as HTMLInputElement;

      // 3. 驗證樣式
      expect(input).toHaveClass("cursor-pointer");
    });
  });

  // 自定義 className 測試
  it("應該接受自定義 className", () => {
    // 查找輸入框
    render(<Input className="custom-class" />);
    // 驗證樣式
    expect(screen.getByRole("textbox")).toHaveClass("custom-class");
  });
});
