import PlansNavbar from "./_component/plansNavbar";

const PlansLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="h-full">
            <div className="hidden md:flex h-full w-[80px] z-30 flex-col fixed inset-y-0">
                <div className="flex flex-col justify-between h-full">      
                </div>
            </div>
            <main className="md:pl-[80px] h-full">
                <PlansNavbar/>
                {children}
            </main>
        </div>
    );
};

export default PlansLayout;