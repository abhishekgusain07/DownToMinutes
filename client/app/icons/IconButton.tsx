import React from "react";

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: number;
}
export const IconButton: React.FC<IconButtonProps> = ({
  className,
  children,
  size = 36,
  ...prop
}) => {
  return (
    <button
      style={{ height: size, width: size }}
      className={[
        "flex justify-center items-center rounded-lg hover:bg-zinc-100",
        className,
      ].join(" ")}
      {...prop}
    >
      {children}
    </button>
  );
};
