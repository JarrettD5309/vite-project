export interface BookListItem {
  title: string;
  url: string;
  author: string;
  num_comments: number;
  points: number;
  objectID: number;
}

export interface ItemProps {
  item: BookListItem
}

export interface ListProps {
  list: BookListItem[]
}

export interface InputWithLabelProps {
  id: string;
  value: string;
  isFocused: boolean;
  type?: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export interface WelcomeObj {
  greeting: string;
  title: string;
}