const ContentContainer = ({ children }) => {
  return (
    <div className="flex-grow flex flex-col">
      {children}
    </div>
  );
};

export default ContentContainer;