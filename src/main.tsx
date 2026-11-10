import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './index.css';

// P1 vertical slice (docs/07_LO_TRINH.md LT-12): mở bằng ?p1, tải riêng để không đụng game MVP.
const SliceApp = lazy(() => import('./game/slice/SliceApp').then((m) => ({ default: m.SliceApp })));
const isSlice = new URLSearchParams(window.location.search).has('p1');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {isSlice ? (
      <Suspense fallback={null}>
        <SliceApp />
      </Suspense>
    ) : (
      <App />
    )}
  </React.StrictMode>
);
