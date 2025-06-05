import React, { Suspense, use, useEffect, useState } from "../../../lib/react";
import { lazy } from "../../../lib/react/lazy";

// 组件不用异步加载就没问题
const ImportComponent = lazy(() => import("./ImportComponent")) as any;

export default function SuspenseLazy() {
  return (
    <>
      {/* @ts-ignore */}
      <Suspense fallback="loading Compoent .... ">
        <ImportComponent />
      </Suspense>
    </>
  );
}
