import { PropsWithChildren, ReactElement, useEffect, useRef, useState } from "react";
import { BookListItem, InputWithLabelProps, ItemProps, ListProps, ResultData, WelcomeObj } from "./interfaces/types";

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
  new Promise((resolve) =>
    setTimeout(
      () => resolve({ data: { stories: initialStories } }),
      2000
    )
  );

const getTitle = (title: string): string => title;

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
  const [stories, setStories] = useState<BookListItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);

    getAsyncStories()
      .then((result: ResultData) => {
        setStories(result.data.stories);
        setIsLoading(false);
      })
      .catch(() => setIsError(true));
  }, []);

  const handleRemoveStory = (item: BookListItem): void => {
    const newStories = stories.filter(
      (story: BookListItem): boolean => item.objectID !== story.objectID
    );

    setStories(newStories);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => setSearchTerm(event.target.value);


  const searchedStories: BookListItem[] = stories.filter((story: BookListItem): boolean => story.title.toLowerCase().includes(searchTerm.toLowerCase()));

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
      {isError && <p>Something went wrong...</p>}

      {isLoading ? (
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
