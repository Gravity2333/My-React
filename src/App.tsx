import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useTransition,
} from "../lib/react";
import Counter from "./components/Counter";
import DeferedValueDemo from "./components/DeferedValueDemo";
import Input from "./components/Input";
import MemoComp from "./components/MemoComp";
import SuspenseLazy from "./components/SuspenseLazy";
import SuspenseUse from "./components/SuspenseUse";
import ContextDemo from "./Pages/ContextDemo";
import WelcomePage from "./Pages/Welcome";

const styles = {
  appContainer: {
    fontFamily: "Arial, sans-serif",
    padding: "20px",
    width: "100%",
    height: "100%",
    margin: "0 auto",
  },
  navbar: {
    marginBottom: "20px",
    borderBottom: "1px solid #ddd",
  },
  menu: {
    display: "flex",
    listStyle: "none",
    padding: 0,
    margin: 0,
    gap: "10px",
  },
  menuItem: {
    cursor: "pointer",
    padding: "8px 16px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    backgroundColor: "#f9f9f9",
  },
  content: {
    marginTop: "20px",
  },
  memoWrapper: {
    marginTop: "40px",
  },
  primaryBtn: {
    padding: "10px 20px",
    backgroundColor: "#1677ff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  loading: {
    color: "#888",
    margin: "10px 0",
  },
  postsTab: {
    marginTop: "20px",
  },
  postsList: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
    gap: "10px",
    marginTop: "20px",
  },
  slowPost: {
    backgroundColor: "#fafafa",
    border: "1px solid #ccc",
    padding: "10px",
    borderRadius: "4px",
    fontSize: "14px",
    textAlign: "center",
  },
};

async function fetchMockMessage(): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("Message From Mock Fetch!!!");
    }, 1000);
  });
}

function SlowPost({ index }: { index: number }) {
  const startTime = performance.now();
  while (performance.now() - startTime < 40) {}

  return <div style={styles.slowPost}>Slow Item Render Need 4ms</div>;
}

const PostsTab = () => {
  const [isPending, startTransition] = useTransition();
  const [showHugeData, setShowHugeData] = useState(false);

  return (
    <div style={styles.postsTab}>
      <button
        style={styles.primaryBtn}
        onClick={() => {
          startTransition(() => {
            setShowHugeData(true);
          });
        }}
      >
        渲染大量数据
      </button>
      {isPending && <p style={styles.loading}>Loading...</p>}
      {showHugeData && (
        <div style={styles.postsList}>
          {Array.from({ length: 100 }).map((_, i) => (
            // @ts-ignore
            <SlowPost key={i} index={i} />
          ))}
        </div>
      )}
    </div>
  );
};

const App = () => {
  const [type, setType] = useState<
    | "welcome"
    | "counter"
    | "input"
    | "useDeferedValue-menu"
    | "hugeData"
    | "context"
    | "suspense-use"
    | "suspense-lazy"
  >("welcome");

  const appContainerRef = useRef<any>(null);

  const [list, setList] = useState(["hello", "react", "test", "list"]);

  const content = (() => {
    switch (type) {
      case "welcome":
        return <WelcomePage />;
      case "counter":
        return <Counter />;
      case "input":
        return <Input />;
      case "context":
        return <ContextDemo />;
      case "useDeferedValue-menu":
        return <DeferedValueDemo />;
      case "hugeData":
        return <PostsTab />;
      case "suspense-use":
        return <SuspenseUse />;
      case "suspense-lazy":
        return <SuspenseLazy />;
      default:
        return null;
    }
  })();

  // useLayoutEffect(() => {
  //   console.log("layout", appContainerRef);
  //   return () => {
  //     console.log("destory layout", appContainerRef);
  //   };
  // }, []);

  // useEffect(() => {
  //   console.log("passive", appContainerRef);
  // }, []);

  return (
    <div ref={appContainerRef} style={styles.appContainer}>
      <nav style={styles.navbar}>
        <ul style={styles.menu}>
          {menuItems.map(({ key, label, value }) => (
            <li
              key={key}
              style={styles.menuItem}
              onClick={() => setType(value as any)}
            >
              {label}
            </li>
          ))}
        </ul>
      </nav>
      <main style={styles.content}>{content}</main>
      <div style={styles.memoWrapper}>
        <MemoComp />
      </div>

      <ul>
        {list.map((item) => (
          <li key={item}>
            {item}{" "}
            <span
              style={{
                color: "red",
                cursor: "pointer",
              }}
              onClick={() => {
                setList((prev) => prev.filter((i) => i !== item));
              }}
            >
              click to delete this li
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const menuItems = [
  { key: "welcome-menu", label: "Welcome", value: "welcome" },
  { key: "counter-menu", label: "计数器", value: "counter" },
  { key: "input-menu", label: "输入框", value: "input" },
  {
    key: "hugedata-menu",
    label: "大量数据 测试useTransition",
    value: "hugeData",
  },
  {
    key: "useDeferedValue-menu",
    label: "展示 useDeferedValue",
    value: "useDeferedValue-menu",
  },
  { key: "context-menu", label: "测试Context", value: "context" },
  { key: "suspense-use", label: "测试use & Suspense", value: "suspense-use" },
  {
    key: "suspense-lazy",
    label: "测试lazy & Suspense",
    value: "suspense-lazy",
  },
];

export default App;
