import { ReactElement, memo } from "react";
import { BookListItem, ItemProps, ListProps } from "./interfaces/types";
import { StyledButtonSmall, StyledColumn, StyledItem } from "./styles/component_styles";
import Check from "./assets/check.svg?react";


const List = memo(({ list, onRemoveItem }: ListProps): ReactElement =>
(
  <ul>
    {list.map((item: BookListItem): ReactElement => (
      <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
    ))}
  </ul>
)

);

const Item = ({ item, onRemoveItem }: ItemProps): ReactElement => (
  <StyledItem>
    <StyledColumn width="40%">
      <a href={item.url}>{item.title} </a>
    </StyledColumn>
    <StyledColumn width="30%">{item.author} </StyledColumn>
    <StyledColumn width="10%">{item.num_comments} </StyledColumn>
    <StyledColumn width="10%">{item.points}</StyledColumn>
    <StyledColumn width="10%">
      <StyledButtonSmall
        type="button"
        onClick={(): void => onRemoveItem(item)}
      >
        <Check height="18px" width="18px" data-testid="check-svg" />
      </StyledButtonSmall>
    </StyledColumn>
  </StyledItem>
);

export { List, Item };