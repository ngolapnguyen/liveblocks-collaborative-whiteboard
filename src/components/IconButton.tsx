import React, { HTMLAttributes } from "react";
import classNames from "classnames";

export type IconButtonProps = HTMLAttributes<HTMLButtonElement> & {
  icon: React.ReactNode;
};

export const IconButton = (props: IconButtonProps) => {
  const { icon, className, ...rest } = props;

  return (
    <button
      className={classNames("rounded p-1 active:bg-gray-50", className)}
      {...rest}
    >
      {icon}
    </button>
  );
};
