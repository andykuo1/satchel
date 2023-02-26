import { useEffect, useRef } from 'react';
import { WebrtcProvider } from 'y-webrtc';

import { toYInv } from '../../inv/yinv/YInv';
import { toYView } from '../../inv/yinv/YView';
import { InvStore, ViewStore, useStore } from '../../stores';
import { YDocStore } from '../../stores/YDocStore';

const ROOM_NAME = 'satchel-test';

export function useYDoc() {
  const providerRef = useRef(null);
  const store = useStore();
  useEffect(() => {
    if (providerRef.current) {
      return;
    }
    let ydoc = YDocStore.get(store);
    let provider = new WebrtcProvider(ROOM_NAME, ydoc);
    providerRef.current = provider;

    store.ydoc.getMap('invs').observeDeep((e) => {
      for (let event of e.values()) {
        if (event.path.length > 0) {
          // This is a inv prop edit
          let invId = String(event.path.at(0));
          if (InvStore.has(store, invId)) {
            InvStore.dispatch(store, invId);
          }
        } else {
          // This is a inv add/delete
          for (let [invId, { action }] of event.changes.keys) {
            switch (action) {
              case 'add':
                if (!InvStore.has(store, invId)) {
                  InvStore.put(
                    store,
                    invId,
                    toYInv(store.ydoc.getMap('invs').get(invId)),
                  );
                  InvStore.dispatch(store, invId);
                }
                break;
              case 'update':
                if (InvStore.has(store, invId)) {
                  InvStore.dispatch(store, invId);
                }
                break;
              case 'delete':
                if (InvStore.has(store, invId)) {
                  InvStore.delete(store, invId);
                  InvStore.dispatch(store, invId);
                }
                break;
            }
          }
        }
      }
    });

    store.ydoc.getMap('views').observeDeep((e) => {
      for (let event of e.values()) {
        if (event.path.length > 0) {
          // This is a inv prop edit
          let viewId = String(event.path.at(0));
          if (ViewStore.has(store, viewId)) {
            ViewStore.dispatch(store, viewId);
          }
        } else {
          for (let [viewId, { action }] of event.changes.keys) {
            switch (action) {
              case 'add':
                if (!ViewStore.has(store, viewId)) {
                  ViewStore.put(
                    store,
                    viewId,
                    toYView(store.ydoc.getMap('views').get(viewId)),
                  );
                  ViewStore.dispatch(store, viewId);
                }
                break;
              case 'update':
                if (ViewStore.has(store, viewId)) {
                  ViewStore.dispatch(store, viewId);
                }
                break;
              case 'delete':
                if (ViewStore.has(store, viewId)) {
                  ViewStore.delete(store, viewId);
                  ViewStore.dispatch(store, viewId);
                }
                break;
            }
          }
        }
      }
    });
  }, []);
}
