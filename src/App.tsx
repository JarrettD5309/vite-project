import { PropsWithChildren, ReactElement, useCallback, useEffect, useReducer, useRef, useState } from "react";
import { BookListItem, InputWithLabelProps, ItemProps, ListProps, StoryAction, StoryReducerObj, WelcomeObj } from "./interfaces/types";

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

  const handleSearchSubmit = (): void => setUrl(`${API_ENDPOINT}${searchTerm}`);

  const handleFetchStories = useCallback(() => {

    dispatchStories({ type: StoryAction.STORIES_FETCH_INIT });

    fetch(url)
      .then((res) => res.json())
      .then((result) => {
        dispatchStories({
          type: StoryAction.STORIES_FETCH_SUCCESS,
          payload: result.hits
        });
      })
      .catch(() => dispatchStories({ type: StoryAction.STORIES_FETCH_FAILURE }));

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
    <>
      <h1>{welcome.greeting} {welcome.title}</h1>
      <h1>{getTitle('Hello World')}</h1>

      <InputWithLabel
        id="search"
        value={searchTerm}
        isFocused
        onInputChange={handleSearchInput}
      >
        <strong>Search:</strong>
      </InputWithLabel>

      <button
        type="button"
        disabled={!searchTerm}
        onClick={handleSearchSubmit}
      >Submit</button>

      <hr />
      {stories.isError && <p>Something went wrong...</p>}

      {stories.isLoading ? (
        <p>Loading...</p>
      ) : (
        <List list={stories.data} onRemoveItem={handleRemoveStory} />
      )}

    </>
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
  <li>
    <span>
      <a href={item.url}>{item.title} </a>
    </span>
    <span>{item.author} </span>
    <span>{item.num_comments} </span>
    <span>{item.points}</span>
    <span>
      <button type="button" onClick={(): void => onRemoveItem(item)}>Dismiss</button>
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
      <label htmlFor={id}>{children}</label>
      &nbsp;
      <input
        ref={inputRef}
        id={id}
        type={type}
        value={value}
        onChange={onInputChange}
      />
    </>
  );
};

export default App;
