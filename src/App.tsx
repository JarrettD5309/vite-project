import { ReactElement, useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { BookListItem, ColName, StoryAction, StoryReducerActionObj, StoryReducerObj, WelcomeObj } from "./interfaces/types";
import axios from "axios";
import { StyledContainer, StyledHeadlinePrimary } from "./styles/component_styles";
import { SearchForm } from "./SearchForm";
import { List } from "./List";

const API_ENDPOINT: string = 'https://hn.algolia.com/api/v1/search?query=';

const welcome: WelcomeObj = {
  greeting: 'Hey',
  title: 'React'
};

const getTitle = (title: string): string => title;

const storiesReducer = (state: StoryReducerObj, action: StoryReducerActionObj): StoryReducerObj => {
  const actionType = action.type;
  if (actionType === StoryAction.STORIES_FETCH_INIT) {
    return {
      ...state,
      isLoading: true,
      isError: false
    };
  } else if (action.payload && actionType === StoryAction.STORIES_FETCH_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      isError: false,
      data: action.payload
    };
  } else if (actionType === StoryAction.STORIES_FETCH_FAILURE) {
    return {
      ...state,
      isLoading: false,
      isError: true
    };
  } else if (action.payload && actionType === StoryAction.REMOVE_STORY) {
    const storyFilter = (story: BookListItem): boolean => {
      if (action.payload) {
        return action.payload[0].objectID !== story.objectID;
      } else {
        return false;
      }
    };

    return {
      ...state,
      data: state.data.filter(storyFilter)
    };
  } else if (action.payload && StoryAction.SORT_ASCEND_DESCEND) {
    return {
      ...state,
      data: action.payload
    };
  } else {
    throw new Error();
  }
};

const useSemiPersistentState = (key: string, initialState: string): [string, (newValue: string) => void] => {
  const isMounted = useRef<boolean>(false);

  const [value, setValue] = useState<string>(
    localStorage.getItem(key) || initialState
  );

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
    } else {
      localStorage.setItem(key, value);
    }
  }, [value, key]);

  return [value, setValue];
};

const getSumComments = (stories: StoryReducerObj): number => stories.data.reduce(
  (result, value) => result + value.num_comments,
  0
);


const App = (): ReactElement => {

  const [searchTerm, setSearchTerm] = useSemiPersistentState('search', 'React');
  const [stories, dispatchStories] = useReducer(storiesReducer, { data: [], isLoading: false, isError: false });

  const [url, setUrl] = useState(`${API_ENDPOINT}${searchTerm}`);

  const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>): void => setSearchTerm(event.target.value);

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    setUrl(`${API_ENDPOINT}${searchTerm}`);

    event.preventDefault;
  };

  const handleFetchStories = useCallback(async () => {

    dispatchStories({ type: StoryAction.STORIES_FETCH_INIT });

    try {
      const result = await axios.get(url);

      dispatchStories({
        type: StoryAction.STORIES_FETCH_SUCCESS,
        payload: result.data.hits
      });
    } catch {
      dispatchStories({ type: StoryAction.STORIES_FETCH_FAILURE });
    }

  }, [url]);

  useEffect(() => {

    handleFetchStories();

  }, [handleFetchStories]);

  const handleRemoveStory = useCallback((item: BookListItem): void => {
    dispatchStories({
      type: StoryAction.REMOVE_STORY,
      payload: [item]
    });
  }, []);

  const sortAscendDescend = (col: ColName): BookListItem[] => {
    const storyArr: BookListItem[] = [...stories.data];

    storyArr.sort((a: BookListItem, b: BookListItem) => {
      let aVal: string | number = a[col];
      let bVal: string | number = b[col];

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
      }

      if (typeof bVal === 'string') {
        bVal = bVal.toLowerCase();
      }

      if (aVal < bVal) {
        return -1;
      } else if (aVal > bVal) {
        return 1;
      } else {
        return 0;
      }
    });

    return storyArr;
  };

  const arrAreEqual = (arr1: BookListItem[], arr2: BookListItem[], col: ColName): boolean => {
    let isEqual = true;
    arr1.forEach((arrOneVal, i) => {
      if(arrOneVal[col] !== arr2[i][col]) {
        isEqual = false;
      }
    });

    return isEqual;
  };

  const handleSortAscendDescend = (col: ColName): void => {
    const storyArr: BookListItem[] = sortAscendDescend(col);

    if (arrAreEqual(storyArr, stories.data, col)) {
      storyArr.reverse();
    }

    dispatchStories({ type: StoryAction.SORT_ASCEND_DESCEND, payload: storyArr });
  };


  const sumComments: number = useMemo<number>(() => getSumComments(stories), [stories]);

  return (
    <StyledContainer>
      <StyledHeadlinePrimary>{welcome.greeting} {welcome.title}</StyledHeadlinePrimary>
      <StyledHeadlinePrimary>{getTitle('Hello World')}</StyledHeadlinePrimary>
      <StyledHeadlinePrimary>My Hacker Stories with {sumComments} comments.</StyledHeadlinePrimary>

      <SearchForm
        searchTerm={searchTerm}
        onSearchInput={handleSearchInput}
        onSearchSubmit={handleSearchSubmit}
      />

      {stories.isError && <p>Something went wrong...</p>}

      {stories.isLoading ? (
        <p>Loading...</p>
      ) : (
        <List list={stories.data} onRemoveItem={handleRemoveStory} onSortAscendDescend={handleSortAscendDescend} />
      )}

    </StyledContainer>
  );
};

export default App;

export {
  storiesReducer
};