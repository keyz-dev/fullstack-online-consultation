import React from "react";
import { cn } from "@/lib/utils";
import { ButtonProps } from "@/types";
import Loader from "./Loader";

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      children,
      disabled,
      leadingIcon,
      trailingIcon,
      text,
      onClickHandler,
      isDisabled,
      isLoading,
      additionalClasses = "",
      type = "button",
      id = "",
      ...props
    },
    ref
  ) => {
    const baseButtonStyles =
      "btn flexbox gap-2 cursor-pointer disabled:cursor-not-allowed";
    const disabledStyles =
      "opacity-50 bg-gray-300 cursor-not-allowed text-secondary";
    const loadingStyles =
      "relative text-transparent transition-none hover:text-transparent";

    const buttonClasses = cn(
      baseButtonStyles,
      (isDisabled || isLoading || disabled || loading) && disabledStyles,
      (isLoading || loading) && loadingStyles,
      additionalClasses,
      className
    );

    return (
      <button
        id={id}
        className={buttonClasses}
        type={type}
        onClick={onClickHandler}
        disabled={isDisabled || isLoading || disabled || loading}
        ref={ref}
        {...props}
      >
        {leadingIcon && <span className="inlinebox">{leadingIcon}</span>}
        {children}
        {text}
        {trailingIcon && <span className="inlinebox">{trailingIcon}</span>}
        {(isLoading || loading) && <Loader />}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
