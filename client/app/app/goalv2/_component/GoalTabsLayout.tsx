type TabName = "Subgoals" | "Tasks" | "Progress";

const GoalTabsLayout = ({
     tabs,
     activeTab,
     setActiveTab,
     className 
}: {
    tabs: TabName[] | readonly TabName[];
    activeTab: TabName;
    setActiveTab: (tab: TabName) => void;
    className?: string;
}) => {
    return (
         <div className="flex space-x-1 w-max">
        {tabs.map((tab) => (
        <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={[
            className,
            "relative text-sm py-2 font-medium transition-all !ring-0 w-max",
            ].join(" ")}
            style={{
            WebkitTapHighlightColor: "transparent",
            }}
        >
            {activeTab === tab && (
            <span className="absolute inset-0 z-10 py-4 border-b-2 border-blue-600" />
            )}
            <div
            className={[
                "min-w-[80px] relative text-clip rounded-lg line-clamp-1 z-10 px-3 md:px-4 py-1.5",
                activeTab === tab
                ? "text-blue-600 bg-blue-500/10"
                : "hover:text-blue-600",
            ].join(" ")}
            >
            {tab}
            </div>
            {tab === "Progress" && activeTab!=="Progress" && 1 > 0 && (
            <div className="absolute top-2 right-1 inline-block px-1 py-1 text-xs font-small leading-none text-white bg-red-600 rounded-full">
            </div>
            )}
        </button>
        ))}
    </div> 
);
};


export default GoalTabsLayout;