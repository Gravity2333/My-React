import { createElement } from "../lib/React";
import { render } from "../lib/ReactDom";
import useState from "../lib/hooks/useState";

function App() {
  const [value, setValue] = useState(10);
  const [user, setUser] = useState("TEST");

  const handleAdd = (number) => {
    setValue((prev) => prev + number);
  };

  const handleMinus = (number) => {
    setValue((prev) => prev - number);
  };

  const handeleInput = (e) => {
    setUser(e.target.value);
  };

  return createElement("div", {}, [
    createElement("div", {}, [
      createElement("h2", {}, ["计数器:", value]),
      createElement("button", { onClick: handleAdd.bind(null, 1) }, ["+1"]),
      createElement("button", { onClick: handleAdd.bind(null, 5) }, ["+5"]),
      createElement("button", { onClick: handleAdd.bind(null, 8) }, ["+8"]),
      createElement("button", { onClick: handleMinus.bind(null, 1) }, ["-1"]),
      createElement("button", { onClick: handleMinus.bind(null, 5) }, ["-5"]),
      createElement("button", { onClick: handleMinus.bind(null, 8) }, ["-8"]),
    ]),
    createElement("div", {}, [
      createElement("input", { value: user, onInput: handeleInput }, []),
      createElement("h2", { style: "color:pink" }, ["输入框值:", user]),
    ]),
  ]);
}

render(createElement(App, {}, []), document.querySelector("#root-master"));

