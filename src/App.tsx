import { ReactElement, useState } from "react";
import { BookListItem, WelcomeObj } from "./interfaces/types";

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

  return (
    <div>
      <h1>{welcome.greeting} {welcome.title}</h1>
      <h1>{getTitle('Hello World')}</h1>

      <Search />

      <hr />

      <List list={stories} />

    </div>
  );
};

const List = (props: { list: BookListItem[] }): ReactElement => (
  <ul>
    {props.list.map((item: BookListItem): ReactElement => (
      <Item key={item.objectID} item={item} />
    ))}
  </ul>
);

const Item = (props: { item: BookListItem }): ReactElement => (
  <li>
    <span>
      <a href={props.item.url}>{props.item.title} </a>
    </span>
    <span>{props.item.author} </span>
    <span>{props.item.num_comments} </span>
    <span>{props.item.points}</span>
  </li>
);

const Search = (): ReactElement => {

  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(event.target.value);

  return (
    <div>
      <label htmlFor="search">Search: </label>
      <input id="search" type="text" onChange={handleChange} />

      <p>Searching for <strong>{searchTerm}</strong></p>
    </div>
  );
};

export default App;
