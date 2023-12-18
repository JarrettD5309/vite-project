import { PropsWithChildren, ReactElement, useCallback, useEffect, useReducer, useRef, useState } from "react";
import { BookListItem, InputWithLabelProps, ItemProps, ListProps, SearchFormProps, StoryAction, StoryReducerObj, WelcomeObj } from "./interfaces/types";
import axios from "axios";
import styles from './App.module.css';
import clsx from "clsx";

const API_ENDPOINT: string = 'https://hn.algolia.com/api/v1/search?query=';

const welcome: WelcomeObj = {
  greeting: 'Hey',
  title: 'React'
};

const getTitle = (title: string): string => title;

const storiesReducer = (state: StoryReducerObj, action: { type: StoryAction, payload?: BookListItem[] }): StoryReducerObj => {
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
  } else {
    throw new Error();
  }
};

const useSemiPersistentState = (key: string, initialState: string): [string, React.Dispatch<React.SetStateAction<string>>] => {
  const [value, setValue] = useState<string>(
    localStorage.getItem(key) || initialState
  );

  useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue];
};


const App = (): ReactElement => {

  const [searchTerm, setSearchTerm] = useSemiPersistentState('search', 'React');
  const [stories, dispatchStories] = useReducer(storiesReducer, { data: [], isLoading: false, isError: false });

  const [url, setUrl] = useState(`${API_ENDPOINT}${searchTerm}`);

  const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>): void => setSearchTerm(event.target.value);

  const handleSearchSubmit = (event: React.ChangeEvent<HTMLFormElement>): void => {
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

  const handleRemoveStory = (item: BookListItem): void => {
    dispatchStories({
      type: StoryAction.REMOVE_STORY,
      payload: [item]
    });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.headlinePrimary}>{welcome.greeting} {welcome.title}</h1>
      <h1 className={styles.headlinePrimary}>{getTitle('Hello World')}</h1>

      <SearchForm
        searchTerm={searchTerm}
        onSearchInput={handleSearchInput}
        onSearchSubmit={handleSearchSubmit}
      />

      {stories.isError && <p>Something went wrong...</p>}

      {stories.isLoading ? (
        <p>Loading...</p>
      ) : (
        <List list={stories.data} onRemoveItem={handleRemoveStory} />
      )}

    </div>
  );
};

const List = ({ list, onRemoveItem }: ListProps): ReactElement => (
  <ul>
    {list.map((item: BookListItem): ReactElement => (
      <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
    ))}
  </ul>
);

const Item = ({ item, onRemoveItem }: ItemProps): ReactElement => (
  <li className={styles.item}>
    <span style={{width: '40%'}}>
      <a href={item.url}>{item.title} </a>
    </span>
    <span style={{width: '30%'}}>{item.author} </span>
    <span style={{width: '10%'}}>{item.num_comments} </span>
    <span style={{width: '10%'}}>{item.points}</span>
    <span style={{width: '10%'}}>
      <button 
      type="button" 
      onClick={(): void => onRemoveItem(item)}
      className={clsx(styles.button, styles.buttonSmall)}
      >
        Dismiss
      </button>
    </span>
  </li>
);

const InputWithLabel = ({ id, value, isFocused, type = "text", onInputChange, children }: PropsWithChildren<InputWithLabelProps>): ReactElement => {

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused]);

  return (
    <>
      <label htmlFor={id} className={styles.label}>{children}</label>
      &nbsp;
      <input
        ref={inputRef}
        id={id}
        type={type}
        value={value}
        onChange={onInputChange}
        className={styles.input}
      />
    </>
  );
};

const SearchForm = ({ onSearchSubmit, searchTerm, onSearchInput }: SearchFormProps): ReactElement => (
  <form onSubmit={onSearchSubmit} className={styles.searchForm}>
    <InputWithLabel
      id="search"
      value={searchTerm}
      isFocused
      onInputChange={onSearchInput}
    >
      <strong>Search:</strong>
    </InputWithLabel>

    <button
      type="submit"
      disabled={!searchTerm}
      className={clsx(styles.button, styles.buttonLarge)}
    >Submit</button>
  </form>
);

export default App;
