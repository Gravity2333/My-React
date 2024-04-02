import { createElement } from "../lib/React";
import useState from "../lib/hooks/useState";

function App() {
    const [value, setValue] = useState(10);
    const [user, setUser] = useState("HELLO TOY REACT");

    const handleAdd = (number) => {
        setValue((prev) => prev + number);
    };

    const handleMinus = (number) => {
        setValue((prev) => prev - number);
    };

    const handeleInput = (e) => {
        setUser(e.target.value);
    };

    return createElement("div", {
        style: "border:1px solid black;width:40%;text-align:center;background-color:lightGray;"
    }, [
        createElement("div", {
            style: "padding:20px;border-bottom:1px solid black"
        }, [
            createElement("h1", {}, ["TOY-REACT DEMO"]),
            createElement("h2", {}, ["计数器:", value]),
            createElement(
                "button",
                { style: "background-color:red", onClick: handleAdd.bind(null, 1) },
                ["+1"]
            ),
            createElement("button", { onClick: handleAdd.bind(null, 5) }, ["+5"]),
            createElement("button", { onClick: handleAdd.bind(null, 8) }, ["+8"]),
            createElement("button", { onClick: handleMinus.bind(null, 1) }, ["-1"]),
            createElement("button", { onClick: handleMinus.bind(null, 5) }, ["-5"]),
            createElement("button", { onClick: handleMinus.bind(null, 8) }, ["-8"]),
        ]),
        createElement("div", {}, [
            createElement("h2", {}, ["输入框"]),
            createElement("input", { value: user, onInput: handeleInput }, []),
            createElement("h2", {}, ["输入框值:", user]),
        ]),
        createElement("div", {}, [
            createElement("img", { src: "/logo192.png" }, ["输入框"]),
        ]),
    ]);
}

export default App