const Skeleton = () => {
    return (
        <div className="flex items-center px-4 py-3 animate-pulse">
            <div className="h-12 w-12 rounded-full bg-[#202C33] mr-3" />
            <div className="flex-1">
                <div className="h-4 bg-[#202C33] rounded w-1/3 mb-2" />
                <div className="h-3 bg-[#202C33] rounded w-1/2" />
            </div>
            </div>
    )
};

export default Skeleton;