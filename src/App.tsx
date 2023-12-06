import { ReactElement } from "react";
import { WelcomeObj } from "./interfaces/types";

const welcome: WelcomeObj = {
  greeting: "Hey",
  title: "React"
};

function getTitle(title: string): string {
  return title;
}

function App(): ReactElement {

  return (
    <div>
      <h1>{welcome.greeting} {welcome.title}</h1>
      <h1>{getTitle("Hello World")}</h1>
      <label htmlFor="search">Search: </label>
      <input id="search" type="text" />
    </div>
  );
}

export default App;
