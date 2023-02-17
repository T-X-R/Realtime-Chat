import "./App.css";
import { Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import ChatPage from "./pages/ChatPage";
import ItemPage from "./pages/ItemPage";
// import { BrowserRouter as Router } from 'react-router-dom'; 

function App() {
  return (
    <div className="App">
      <Route path="/" component={Homepage} exact />
      <Route path="/chats" component={ChatPage} />
      <Route path="/items" component={ItemPage} />
    </div>
  );
}

export default App;
