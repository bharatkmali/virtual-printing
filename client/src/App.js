import { BrowserRouter } from "react-router-dom";
import HomePage from "./pages/Home";
import Router from "./router/Router";
function App() {
  return (
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  );
}

export default App;
