import { cn } from "@/lib/utils";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    onClick: () => void;
    active?: boolean;
    title: string;
    icon?: React.ReactNode;
  }[];
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  return (
    <nav
      className={cn(
        "flex space-x-2 p-0.5 lg:flex-col pb-2 lg:space-x-0 lg:space-y-1.5 overflow-x-auto",
        className
      )}
      {...props}
    >
      {items.map((item, idx) => (
        <button
          key={idx}
          onClick={item.onClick}
          className={cn(
            "flex h-10 md:h-11 px-3 whitespace-nowrap rounded-lg space-x-2 items-center outline-1 justify-start",
            item.active
              ? "bg-purple-50 hover:outline outline-purple-400 font-semibold text-purple-600"
              : "hover:bg-zinc-50 hover:outline font-medium outline-zinc-300"
          )}
        >
          {item.icon}
          <div className="text-sm">{item.title}</div>
        </button>
      ))}
    </nav>
  );
}
