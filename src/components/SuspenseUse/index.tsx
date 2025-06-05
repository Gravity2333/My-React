import React, { Suspense, use, useEffect, useState } from "../../../lib/react";

const delay = (t) =>
  new Promise((r) => {
    setTimeout(r, t);
  });

const cachePool: any[] = [];

function fetchData(id, timeout) {
  const cache = cachePool[id];
  if (cache) {
    return cache;
  }
  return (cachePool[id] = delay(timeout).then(() => {
    return { data: Math.random().toFixed(2) * 100 };
  }));
}

function Cpn({ id, timeout }) {
  const [num, updateNum] = useState(0);
  const { data } = use<any>(fetchData(id, timeout));

  if (num !== 0 && num % 5 === 0) {
    cachePool[id] = null;
  }

  useEffect(() => {
    return () => console.log("effect destroy");
  }, []);

  return (
    <ul
      onClick={() => {
        updateNum((prev) => prev + 1);
      }}
    >
      <li>ID: {id}</li>
      <li>随机数: {data}</li>
      <li>状态: {num}</li>
    </ul>
  );
}

const lazyComp = delay(10000).then(() =>
  import("../MemoComp").then((res) => res.default)
);

export default function SuspenseWrapper() {
  return (
    <>
      <div>
        {/* @ts-ignore */}
        <Suspense fallback={<div>loading...</div>}>
          <Cpn id={0} timeout={1000} />
        </Suspense>
      </div>
      {/* // @ts-ignore */}
      {/* <Suspense fallback={<div>loading...Memo Comp</div>}>
        {React.createElement(()=>{
          const res = use(lazyComp)
          return React.createElement(res)
        })}
      </Suspense> */}
    </>
  );
}