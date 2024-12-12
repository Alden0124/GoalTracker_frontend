const IconButton = ({
  children,
  onClick,
  ariaLabel,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  ariaLabel: string;
}) => {
  return (
    <button
      onClick={onClick}
      className="flex w-4 h-4 sm:w-12 sm:h-12 rounded-full items-center justify-center hover:opacity-80 dark:hover:bg-[foreground-darkHover]"
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
};

export default IconButton;
