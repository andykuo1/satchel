import { useState } from 'react';

import ContainerBox from '../container/ContainerBox';
import styles from './PaginatedBox.module.css';

export default function PaginatedBox({
  store,
  view,
  pageIndex,
  setPageIndex,
  children = undefined,
}) {
  return (
    <ContainerBox store={store} view={view}>
      <fieldset className={styles.container}>
        <div className={styles.content}>{children}</div>
        <div className={styles.controls}>
          <button onClick={() => setPageIndex((page) => Math.max(0, page - 1))}>
            ←
          </button>
          <label className={styles.pageNumber}>
            {pageIndex > 0 ? pageIndex : ''}
          </label>
          <button onClick={() => setPageIndex((page) => page + 1)}>→</button>
        </div>
      </fieldset>
    </ContainerBox>
  );
}
