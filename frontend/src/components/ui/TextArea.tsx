import React from "react";
import { cn } from "@/lib/utils";
import { TextAreaProps } from "@/types";

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      label,
      name,
      id,
      placeholder,
      additionalClasses = "border-transparent dark:border-gray-700",
      disabled = false,
      required = true,
      onChangeHandler,
      labelClasses = "",
      value,
      error,
      autoFocus = false,
      onFocusHandler,
      onBlurHandler,
      ...props
    },
    ref
  ) => {
    return (
      <div className="w-full flex flex-col">
        {label && (
          <label
            htmlFor={id}
            className={`block transition-all duration-300 transform text-base font-medium text-black dark:text-secondary z-0 px-2 ${labelClasses}`}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <textarea
            ref={ref}
            name={name}
            id={id}
            value={value}
            placeholder={placeholder}
            className={cn(
              `placeholder:text-xs placeholder:text-[#ADADAD] placeholder:font-normal bg-light_bg dark:bg-accent2 outline-none p-2 w-full border-2 focus:border-accent transition-all ease-in-out dark:text-white text-secondary text-md duration-600 rounded-xs min-h-[80px] resize-vertical ${additionalClasses}`,
              error && "border-error",
              disabled && "cursor-not-allowed opacity-50"
            )}
            disabled={disabled}
            required={required}
            onChange={onChangeHandler}
            autoFocus={autoFocus}
            onFocus={onFocusHandler}
            onBlur={onBlurHandler}
            {...props}
          />
        </div>
        {error && <p className="text-error text-xs mt-1">{error}</p>}
      </div>
    );
  }
);

TextArea.displayName = "TextArea";

export default TextArea;
