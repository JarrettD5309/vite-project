import { ReactElement } from "react";
import { StyledButtonLarge } from "./styles/component_styles";
import { LastSearchProps } from "./interfaces/types";

const LastSearch = ({pastSearchArr, setSearchTerm, handlePreviousSearch}: LastSearchProps): ReactElement[] => {
  return pastSearchArr.map((val: string, i: number) => (
    <StyledButtonLarge type="button" key={i} onClick={() => { setSearchTerm(val); handlePreviousSearch(val); }}>
      {val}
    </StyledButtonLarge>
  ));
};

export { LastSearch };