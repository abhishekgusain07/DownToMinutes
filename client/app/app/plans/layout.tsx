// layout.tsx
import PlansNavbar from "./_component/plansNavbar";

const PlansLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="h-screen w-full flex flex-col"> {/* Changed to h-screen and flex-col */}
            <PlansNavbar />
            <main className="flex-1 overflow-y-auto"> {/* Removed fixed height */}
                {children}
            </main>
        </div>
    );
};

export default PlansLayout;