import { ReactElement } from "react";
import { SearchFormProps } from "./interfaces/types";
import { StyledButtonLarge, StyledSearchForm } from "./styles/component_styles";
import { InputWithLabel } from "./InputWithLabel";

const SearchForm = ({ onSearchSubmit, searchTerm, onSearchInput }: SearchFormProps): ReactElement => (
  <StyledSearchForm onSubmit={onSearchSubmit}>
    <InputWithLabel
      id="search"
      value={searchTerm}
      isFocused
      onInputChange={onSearchInput}
    >
      Search:
    </InputWithLabel>

    <StyledButtonLarge
      type="submit"
      disabled={!searchTerm}
    >
      Submit
    </StyledButtonLarge>
  </StyledSearchForm>
);

export { SearchForm };