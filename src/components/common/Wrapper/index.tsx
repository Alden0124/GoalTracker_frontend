interface WrapperProps {
  children: React.ReactNode;
  className?: string;
}

const Wrapper = ({ children, className }: WrapperProps) => {
  return (
    <div
      className={`
        ${className} w-full h-full rounded-[10px] px-[15px] py-[15px]  bg-background-light dark:bg-background-dark border shadow-[0_1px_6px_rgba(0,0,0,0.16)]`}
    >
      {children}
    </div>
  );
};

export default Wrapper;
