import { ReactElement, memo } from "react";
import { BookListItem, ColName, ItemProps, ListProps, ListTitleProps } from "./interfaces/types";
import { StyledButtonSmall, StyledColumn, StyledItem, StyledSpan } from "./styles/component_styles";
import Check from "./assets/check.svg?react";


const List = memo(({ list, onRemoveItem, onSortAscendDescend }: ListProps): ReactElement =>
(
  <ul>
    <ListTitle onSortAscendDescend={onSortAscendDescend} />
    {list.map((item: BookListItem): ReactElement => (
      <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
    ))}
  </ul>
)
);

const ListTitle = ({ onSortAscendDescend }: ListTitleProps): ReactElement => (
  <StyledItem>
    <StyledColumn width="40%">
      Article <StyledSpan onClick={() => onSortAscendDescend(ColName.TITLE)}>&#9670;</StyledSpan>
    </StyledColumn>
    <StyledColumn width="25%">Author <StyledSpan onClick={() => onSortAscendDescend(ColName.AUTHOR)}>&#9670;</StyledSpan></StyledColumn>
    <StyledColumn width="15%">Comments <StyledSpan onClick={() => onSortAscendDescend(ColName.COMMENTS)}>&#9670;</StyledSpan></StyledColumn>
    <StyledColumn width="10%">Points <StyledSpan onClick={() => onSortAscendDescend(ColName.POINTS)}>&#9670;</StyledSpan></StyledColumn>
    <StyledColumn width="10%">Remove</StyledColumn>
  </StyledItem>
);

const Item = ({ item, onRemoveItem }: ItemProps): ReactElement => (
  <StyledItem>
    <StyledColumn width="40%">
      <a href={item.url}>{item.title} </a>
    </StyledColumn>
    <StyledColumn width="25%">{item.author} </StyledColumn>
    <StyledColumn width="15%">{item.num_comments} </StyledColumn>
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