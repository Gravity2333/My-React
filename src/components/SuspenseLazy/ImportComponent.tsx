import React, { Suspense, useEffect, useMemo } from "../../../lib/react";
import { lazy } from "../../../lib/react/lazy";

const getChildComponent = () =>
  lazy(() => Promise.resolve({ default: () => <div>child content</div> }));

function AsyncComponent() {
  useEffect(() => {
    console.log("AsyncComponent mount");
  }, []);

  const LazyComponent = useMemo(() => {

    const ChildComponent = getChildComponent() as any;
    console.log("AsyncComponent");
    console.log("useMemo回调执行啦");

    return (
      <>
        {/* @ts-ignore */}
        <Suspense fallback={<div>内层</div>} tag="INNER SUSPENSE">
          <ChildComponent tag="INNER LAZY" />
        </Suspense>
      </>
    );
  }, []);

  return <div className="App">{LazyComponent}</div>;
}

export default AsyncComponent;
