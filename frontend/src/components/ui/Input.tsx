import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { InputProps } from "@/types";

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      type,
      name,
      id,
      placeholder,
      additionalClasses = "border-transparent",
      disabled = false,
      icon,
      onClickHandler,
      required = true,
      onChangeHandler,
      labelClasses = "",
      value,
      error,
      autoFocus = false,
      onFocusHandler,
      onBlurHandler,
      isSecretField = false,
      ...props
    },
    ref
  ) => {
    // Password visibility toggle state
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password" || isSecretField;
    const inputType = isPassword && showPassword ? "text" : type;

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
          <input
            ref={ref}
            type={inputType}
            name={name}
            id={id}
            value={value}
            placeholder={placeholder}
            className={`placeholder:text-xs placeholder:text-[#ADADAD] placeholder:font-normal bg-light_bg dark:bg-dark_bg outline-none p-2 w-full border-2 focus:border-accent transition-all ease-in-out text-secondary dark:text-light_bg text-md duration-600 rounded-xs ${additionalClasses} ${
              error && "border-error"
            }`}
            disabled={disabled}
            required={required}
            onChange={onChangeHandler}
            autoFocus={autoFocus}
            onFocus={onFocusHandler}
            onBlur={onBlurHandler}
            {...props}
          />
          {/* Password visibility toggle icon */}
          {isPassword && (
            <button
              type="button"
              tabIndex={-1}
              className={`absolute transform right-1 top-[50%] translate-y-[-50%] size-[30px] rounded-full inline-flex items-center justify-center text-sm ${
                error ? "text-error" : "text-accent"
              } focus:outline-none`}
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          )}
          {/* Optional icon prop */}
          {icon && !isPassword && (
            <span
              className={`absolute transform right-1 top-[50%] translate-y-[-50%] size-[30px] rounded-full inline-flex items-center justify-center text-sm ${
                error ? "text-error" : "text-accent"
              } bg-white`}
              onClick={onClickHandler}
            >
              <i className={icon}></i>
            </span>
          )}
        </div>
        {error && <p className="text-error text-xs mt-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
