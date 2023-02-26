import { useState } from 'react';

import ContainerBox from '../container/ContainerBox';
import Styles from './PaginatedBox.module.css';

export default function PaginatedBox({
  store,
  view,
  pageIndex,
  setPageIndex,
  children = undefined,
}) {
  return (
    <ContainerBox store={store} view={view}>
      <fieldset className={Styles.container}>
        <div className={Styles.content}>{children}</div>
        <div className={Styles.controls}>
          <button onClick={() => setPageIndex((page) => Math.max(0, page - 1))}>
            ←
          </button>
          <label className={Styles.pageNumber}>
            {pageIndex > 0 ? pageIndex : ''}
          </label>
          <button onClick={() => setPageIndex((page) => page + 1)}>→</button>
        </div>
      </fieldset>
    </ContainerBox>
  );
}
