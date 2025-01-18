import SearchFriends from "../_component/search";

const DashboardPage = () => {
    return (
        <div className="min-h-screen min-w-screen flex flex-col items-center justify-center">
            <h1>Dashboard</h1>
            <div className="flex items-center justify-center mt-4">
                <SearchFriends />
            </div>
        </div>
    );
};

export default DashboardPage;