import { AppSidebar } from "./_componenets/Sidebar";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
    return(
        <div>
            <AppSidebar>
                {children}
            </AppSidebar>
        </div>
    )
};

export default AppLayout;