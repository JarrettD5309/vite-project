interface BookListItem {
  title: string;
  url: string;
  author: string;
  num_comments: number;
  points: number;
  objectID: number;
}

interface ItemProps {
  item: BookListItem;
  onRemoveItem: (item: BookListItem) => void;
}

interface ListProps {
  list: BookListItem[];
  onRemoveItem: (item: BookListItem) => void;
}

interface InputWithLabelProps {
  id: string;
  value: string;
  isFocused: boolean;
  type?: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

interface SearchFormProps {
  searchTerm: string;
  onSearchInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchSubmit: (e: React.ChangeEvent<HTMLFormElement>) => void;
}

interface StoryReducerObj {
  data: BookListItem[];
  isLoading: boolean;
  isError: boolean;
}

interface WelcomeObj {
  greeting: string;
  title: string;
}

enum StoryAction {
  REMOVE_STORY = 'REMOVE_STORY',
  STORIES_FETCH_INIT = 'STORIES_FETCH_INIT',
  STORIES_FETCH_FAILURE = 'STORIES_FETCH_FAILURE',
  STORIES_FETCH_SUCCESS = 'STORIES_FETCH_SUCCESS'
}

export {
  type BookListItem,
  type ItemProps,
  type ListProps,
  type InputWithLabelProps,
  type SearchFormProps,
  type StoryReducerObj,
  type WelcomeObj,
  StoryAction
};