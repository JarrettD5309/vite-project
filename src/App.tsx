import { PropsWithChildren, ReactElement, useEffect, useReducer, useRef, useState } from "react";
import { BookListItem, InputWithLabelProps, ItemProps, ListProps, ResultData, StoryAction, StoryReducerObj, WelcomeObj } from "./interfaces/types";

const welcome: WelcomeObj = {
  greeting: 'Hey',
  title: 'React'
};

const initialStories: BookListItem[] = [
  {
    title: 'React',
    url: 'https://reactjs.org/',
    author: 'Jordan White',
    num_comments: 3,
    points: 4,
    objectID: 0
  },
  {
    title: 'Redux',
    url: 'https://redux.js.org/',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1
  }
];

const getAsyncStories = (): Promise<ResultData> =>
  new Promise((resolve, reject) =>
    setTimeout(
      // () => resolve({ data: { stories: initialStories } }),
      reject,
      2000
    )
  );

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

  useEffect(() => {
    dispatchStories({ type: StoryAction.STORIES_FETCH_INIT });

    getAsyncStories()
      .then((result: ResultData) => {
        dispatchStories({
          type: StoryAction.STORIES_FETCH_SUCCESS,
          payload: result.data.stories
        });
      })
      .catch(() => dispatchStories({ type: StoryAction.STORIES_FETCH_FAILURE }));
  }, []);

  const handleRemoveStory = (item: BookListItem): void => {
    dispatchStories({
      type: StoryAction.REMOVE_STORY,
      payload: [item]
    });
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => setSearchTerm(event.target.value);


  const searchedStories: BookListItem[] = stories.data.filter((story: BookListItem): boolean => story.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <>
      <h1>{welcome.greeting} {welcome.title}</h1>
      <h1>{getTitle('Hello World')}</h1>

      <InputWithLabel
        id="search"
        value={searchTerm}
        isFocused
        onInputChange={handleSearch}
      >
        <strong>Search:</strong>
      </InputWithLabel>

      <hr />
      {stories.isError && <p>Something went wrong...</p>}

      {stories.isLoading ? (
        <p>Loading...</p>
      ) : (
        <List list={searchedStories} onRemoveItem={handleRemoveStory} />
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
