import { useDebounce } from "@/hooks/common/useDebounce";
import { useSearchGoalAutocomplete } from "@/hooks/feed/useFeedQueries";
import { DEFAULT_SEARCH_GOAL_AUTOCOMPLETE_QUERY } from "@/services/api/Feed/constants";
import { Goal } from "@/services/api/Feed/type/SearchGoalAutocomplete.type";
import { KeyboardEvent, memo, useEffect, useRef, useState } from "react";
import { FiSearch } from "react-icons/fi";

interface SearchBarProps {
  onSearch: (keyword: string) => void;
}

const SearchBar = memo(({ onSearch }: SearchBarProps) => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // 使用 debounce 避免過多請求
  const debouncedKeyword = useDebounce(searchKeyword, 300);

  // 獲取自動完成數據
  const { data: autocompleteData, isLoading } = useSearchGoalAutocomplete({
    ...DEFAULT_SEARCH_GOAL_AUTOCOMPLETE_QUERY,
    q: debouncedKeyword,
    type: "goal",
  }, {
    enabled: debouncedKeyword.length > 0,
  });

  const suggestions = autocompleteData?.suggestions.goals || [];

  // 重置選中項
  useEffect(() => {
    setSelectedIndex(-1);
  }, [searchKeyword]);

  // 處理點擊外部關閉下拉框
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (value: string) => {
    setSearchKeyword(value);
    setIsOpen(true);
  };

  const handleSelectGoal = (goal: Goal) => {
    setSearchKeyword(goal.title);
    setIsOpen(false);
    onSearch(goal.title);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex(prev => prev > -1 ? prev - 1 : prev);
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex > -1 && suggestions[selectedIndex]) {
          handleSelectGoal(suggestions[selectedIndex]);
        } else {
          // 如果沒有選中項目，直接搜尋當前輸入
          onSearch(searchKeyword);
          setIsOpen(false);
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
    }
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          placeholder="搜尋目標..."
          value={searchKeyword}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <FiSearch 
          className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 cursor-pointer" 
          onClick={() => {
            onSearch(searchKeyword);
            setIsOpen(false);
          }}
        />
      </div>

      {/* 自動完成下拉框 */}
      {isOpen && searchKeyword && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">載入中...</div>
          ) : suggestions.length ? (
            <div className="max-h-60 overflow-auto">
              <ul>
                {suggestions.map((goal, index) => (
                  <li
                    key={goal.id}
                    onClick={() => handleSelectGoal(goal)}
                    className={`px-4 py-2 cursor-pointer flex items-center gap-2
                      ${index === selectedIndex ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                  >
                    <FiSearch className="h-4 w-4 text-gray-400" />
                    <span>{goal.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              沒有找到相關目標
            </div>
          )}
        </div>
      )}
    </div>
  );
});

SearchBar.displayName = 'SearchBar';

export default SearchBar;
