import { ReactElement, useState } from "react";
import { BookListItem, ItemProps, ListProps, SearchProps, WelcomeObj } from "./interfaces/types";

const welcome: WelcomeObj = {
  greeting: 'Hey',
  title: 'React'
};

const getTitle = (title: string): string => title;


const App = (): ReactElement => {

  const stories: BookListItem[] = [
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

  const [searchTerm, setSearchTerm] = useState<string>("React");

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => setSearchTerm(event.target.value);

  const searchedStories: BookListItem[] = stories.filter((story: BookListItem): boolean => story.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div>
      <h1>{welcome.greeting} {welcome.title}</h1>
      <h1>{getTitle('Hello World')}</h1>

      <Search search={searchTerm} onSearch={handleSearch} />

      <hr />

      <List list={searchedStories} />

    </div>
  );
};

const List = ({ list }: ListProps): ReactElement => (
  <ul>
    {list.map((item: BookListItem): ReactElement => (
      <Item key={item.objectID} item={item} />
    ))}
  </ul>
);

const Item = ({ item }: ItemProps): ReactElement => (
  <li>
    <span>
      <a href={item.url}>{item.title} </a>
    </span>
    <span>{item.author} </span>
    <span>{item.num_comments} </span>
    <span>{item.points}</span>
  </li>
);

const Search = ({ search, onSearch }: SearchProps): ReactElement => (
  <div>
    <label htmlFor="search">Search: </label>
    <input
      id="search"
      type="text"
      value={search}
      onChange={onSearch}
    />
  </div>
);

export default App;
