import { ReactElement } from "react";
import { BookListItem, WelcomeObj } from "./interfaces/types";

const list: BookListItem[] = [
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

const welcome: WelcomeObj = {
  greeting: 'Hey',
  title: 'React'
};

function getTitle(title: string): string {
  return title;
}

function App(): ReactElement {

  return (
    <div>
      <h1>{welcome.greeting} {welcome.title}</h1>
      <h1>{getTitle('Hello World')}</h1>
      <label htmlFor="search">Search: </label>
      <input id="search" type="text" />

      <hr />

      <ul>
        {list.map((item: BookListItem): ReactElement => (
          <li key={item.objectID}>
            <span>
              <a href={item.url}>{item.title} </a>
            </span>
            <span>{item.author} </span>
            <span>{item.num_comments} </span>
            <span>{item.points}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
