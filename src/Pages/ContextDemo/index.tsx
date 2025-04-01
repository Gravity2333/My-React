import React, { useContext, useState } from "../../../lib/react";
import createContext from "../../../lib/react/context";

const Context1 = createContext<string>("CONTEXT_1_INIT_VALUE");
const Context2 = createContext<string>("CONTEXT_2_INIT_VALUE");
const Context3 = createContext<string>("CONTEXT_3_INIT_VALUE");

function ContextReader({ title }: { title: string }) {
  const context1Value = useContext(Context1);
  const context2Value = useContext(Context2);
  const context3Value = useContext(Context3);

  return (
    <div style={{ border: "1px solid black", height: "100px" }}>
      <h3 style={{ color: "black", textAlign: "center" }}>{title}</h3>
      <div style={{ color: "green" }}>Context1 value={context1Value}</div>
      <div style={{ color: "blue" }}>Context2 value={context2Value}</div>
      <div style={{ color: "yellow" }}>Context3 value={context3Value}</div>
    </div>
  );
}

function Provider1Component({ children }: { children?: any }) {
  return (
    <div style={{ backgroundColor: "lightblue", width: "550px" }}>
      <h3 style={{ color: "white", textAlign: "center" }}>Provider1</h3>
      {/* @ts-ignore */}
      <Context1.Provider value="PROVIDER1 NEW VALUE">
        <ContextReader title="Provider1内层Context结果" />
        {children}
      </Context1.Provider>
    </div>
  );
}

function Provider2Component({ children }: { children?: any }) {
  const [provider2Value, setProvider2Value] = useState<string>("PROVIDER2 NEW VALUE");
  return (
    <div style={{ backgroundColor: "lightgray", width: "500px" }}>
      <h3 style={{ color: "white", textAlign: "center" }}>Provider2</h3>
      <button
        style={{ backgroundColor: "red", cursor: "pointer" }}
        onClick={() => setProvider2Value(`当前时间为: ${new Date()}`)}
      >
        点击修改Provider2 value
      </button>
       {/* @ts-ignore */}
      <Context2.Provider value={provider2Value}>
        <ContextReader title="Provider2内层Context结果" />
        {children}
      </Context2.Provider>
    </div>
  );
}

function Provider3Component({ children }: { children?: any }) {
  return (
    <div style={{ backgroundColor: "lightgreen", width: "400px" }}>
      <h3 style={{ color: "white", textAlign: "center" }}>Provider3</h3>
       {/* @ts-ignore */}
      <Context3.Provider value="PROVIDER3 NEW VALUE">
        <ContextReader title="最内层Context结果" />
        {children}
      </Context3.Provider>
    </div>
  );
}

export default function ContextDemo() {
  return (
    <>
      <div style={{ backgroundColor: "pink", width: "600px" }}>
        <ContextReader title="最外层Context结果" />
        <Provider1Component>
          <Provider2Component>
            <Provider3Component />
          </Provider2Component>
        </Provider1Component>
      </div>
    </>
  );
}