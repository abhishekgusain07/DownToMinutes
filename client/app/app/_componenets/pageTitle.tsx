import { Head } from "@/components/Head";
import React from "react";

interface PageTitleProps extends React.PropsWithChildren {
  heading: string;
  subHeading?: string;
  dashboard?: boolean;
}

export const PageTitle: React.FC<PageTitleProps> = ({
  heading,
  subHeading,
  dashboard,
}) => {
  return (
    <div className={`py-8 pl-4 border-b md:pl-${dashboard ? '0' : '6'} border-zinc-300`}>
      <Head title={heading} />
      <h1 className="mx-auto mb-2 text-3xl font-bold max-w-7xl">{heading}</h1>
      <p className="mx-auto max-w-7xl text-zinc-500">{subHeading}</p>
    </div>
  );
};
