import React from "react";

interface TabCardProps extends React.PropsWithChildren {
  heading?: string;
}

export const TabCard: React.FC<TabCardProps> = ({ heading, children }) => {
  return (
    <div className="mb-20 overflow-hidden border rounded-lg shadow-md animate-slide-in border-zinc-300">
      {heading && (
        <div className="px-5 py-4 bg-white border-b border-gray-200">
          <h3 className="text-xl font-semibold leading-6 text-gray-900 ">
            {heading}
          </h3>
        </div>
      )}
      {children}
    </div>
  );
};
