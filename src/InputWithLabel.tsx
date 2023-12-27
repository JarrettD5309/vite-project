import { PropsWithChildren, ReactElement, useEffect, useRef } from "react";
import { InputWithLabelProps } from "./interfaces/types";
import { StyledInput, StyledLabel } from "./styles/component_styles";

const InputWithLabel = ({ id, value, isFocused, type = "text", onInputChange, children }: PropsWithChildren<InputWithLabelProps>): ReactElement => {

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused]);

  return (
    <>
      <StyledLabel htmlFor={id}>{children}</StyledLabel>
      &nbsp;
      <StyledInput
        ref={inputRef}
        id={id}
        type={type}
        value={value}
        onChange={onInputChange}
      />
    </>
  );
};

export { InputWithLabel };