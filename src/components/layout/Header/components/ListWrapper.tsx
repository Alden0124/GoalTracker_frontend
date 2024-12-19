interface ListWrapperProps {
  children: React.ReactNode;
  className?: string;
}

const ListWrapper = ({ children, className }: ListWrapperProps) => {
  return (
    <div
      className={`fixed left-0 right-0 bottom-0 bg-background-light dark:bg-background-dark top-[64px] z-50 
    md:absolute md:right-[20px] md:left-[initial] md:bottom-[initial] md:mt-[15px] md:top-[initial] 
    md:border md:rounded-lg md:shadow-[0_0_10px_rgba(0,0,0,0.2)] md:overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
};

export default ListWrapper;
