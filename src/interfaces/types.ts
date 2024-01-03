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
  onSortAscendDescend: (col: ColName) => void;
}

interface ListTitleProps {
  onSortAscendDescend: (col: ColName) => void;
}

interface InputWithLabelProps {
  id: string;
  value: string;
  isFocused: boolean;
  type?: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

interface LastSearchProps {
  pastSearchArr: string[];
  setSearchTerm: (newVal: string) => void;
  handlePreviousSearch: (pastTerm: string) => void;
}

interface SearchFormProps {
  searchTerm: string;
  onSearchInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

interface StoryReducerActionObj {
  type: StoryAction;
  payload?: BookListItem[]
}

interface StoryReducerObj {
  data: BookListItem[];
  isLoading: boolean;
  isError: boolean;
}

interface StyledColumnProps {
  width: string;
}

interface WelcomeObj {
  greeting: string;
  title: string;
}

enum ColName {
  TITLE = 'title',
  AUTHOR = 'author',
  COMMENTS = 'num_comments',
  POINTS = 'points'
}

enum StoryAction {
  REMOVE_STORY = 'REMOVE_STORY',
  SORT_ASCEND_DESCEND = 'SORT_ASCEND_DESCEND',
  STORIES_FETCH_INIT = 'STORIES_FETCH_INIT',
  STORIES_FETCH_FAILURE = 'STORIES_FETCH_FAILURE',
  STORIES_FETCH_MORE_SUCCESS = 'STORIES_FETCH_MORE_SUCCESS',
  STORIES_FETCH_SUCCESS = 'STORIES_FETCH_SUCCESS'
}

export {
  type BookListItem,
  type ItemProps,
  type ListProps,
  type ListTitleProps,
  type InputWithLabelProps,
  type LastSearchProps,
  type SearchFormProps,
  type StoryReducerActionObj,
  type StoryReducerObj,
  type StyledColumnProps,
  type WelcomeObj,
  StoryAction,
  ColName
};