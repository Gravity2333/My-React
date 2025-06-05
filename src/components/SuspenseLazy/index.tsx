import React, { Suspense, use, useEffect, useState } from "../../../lib/react";
import { lazy } from "../../../lib/react/lazy";


export default function SuspenseLazy() {
  const LazyComponent = lazy(() => import("../MemoComp")) as any;

  return (
    <>
      {/* @ts-ignore */}
      <Suspense fallback="loading Compoent .... ">
        <LazyComponent />
      </Suspense>
    </>
  );
}
