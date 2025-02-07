## 自己写一个REACT!
⚠️ 本分支为React最简易实现 只包含了fiber和虚拟dom之间的转换 如需查看更细节实现 包含lane scheduler 并发更新 主要hook 请切换到learn📑分支！
## 使用方式
npm install
npm run dev

# DEMO 
# src/index.ts
```javascript 
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
```
