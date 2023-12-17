export interface BookListItem {
  title: string;
  url: string;
  author: string;
  num_comments: number;
  points: number;
  objectID: number;
}

export interface ItemProps {
  item: BookListItem;
  onRemoveItem: (item: BookListItem) => void;
}

export interface ListProps {
  list: BookListItem[];
  onRemoveItem: (item: BookListItem) => void;
}

export interface InputWithLabelProps {
  id: string;
  value: string;
  isFocused: boolean;
  type?: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export interface SearchFormProps {
  searchTerm: string;
  onSearchInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchSubmit: (e: React.ChangeEvent<HTMLFormElement>) => void;
}

export interface StoryReducerObj {
  data: BookListItem[];
  isLoading: boolean;
  isError: boolean;
}

export interface WelcomeObj {
  greeting: string;
  title: string;
}

export enum StoryAction {
  REMOVE_STORY = 'REMOVE_STORY',
  STORIES_FETCH_INIT = 'STORIES_FETCH_INIT',
  STORIES_FETCH_FAILURE = 'STORIES_FETCH_FAILURE',
  STORIES_FETCH_SUCCESS = 'STORIES_FETCH_SUCCESS'
}