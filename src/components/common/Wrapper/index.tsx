interface WrapperProps {
  children: React.ReactNode;
  className?: string;
}

const Wrapper = ({ children, className }: WrapperProps) => {
  return (
    <div
      className={`${className} w-full h-full rounded-[10px] px-[20px] py-[30px] bg-background-light dark:bg-background-dark border   `}
    >
      {children}
    </div>
  );
};

export default Wrapper;
