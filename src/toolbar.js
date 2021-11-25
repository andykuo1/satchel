import { downloadText } from './util/downloader.js';
import { clearGround, dropOnGround } from './inventory/GroundHelper.js';
import { exportItemToJSON, exportInventoryToJSON, importInventoryFromJSON, importItemFromJSON, exportDataToJSON } from './inventory/InventoryLoader.js';
import { dispatchAlbumChange, dispatchInventoryChange, getInventoryStore } from './inventory/InventoryStore.js';
import {
  connectAsClient,
  connectAsServer,
  isServerSide,
  shouldConnnectAsClient,
} from './app/PeerSatchelConnector.js';
import { getCursorContext } from './inventory/CursorHelper.js';
import { getExistingInventory } from './inventory/InventoryTransfer.js';
import { addItemToAlbum, exportAlbumToJSON, getAlbumInStore, getExistingAlbum, importAlbumFromJSON } from './cards/CardAlbum.js';

window.addEventListener('DOMContentLoaded', () => {
  document
    .querySelector('#editButton')
    .addEventListener('click', onEditClick);
  document
    .querySelector('#deleteButton')
    .addEventListener('click', onDeleteClick);
  document
    .querySelector('#cloudButton')
    .addEventListener('click', onCloudClick);
  document
    .querySelector('#downloadButton')
    .addEventListener('click', onDownloadClick);
  document
    .querySelector('#uploadButton')
    .addEventListener('click', onUploadClick);
  document
    .querySelector('#uploadInput')
    .addEventListener('change', onUploadChange);

  document
    .querySelector('#actionExportToFile')
    .addEventListener('click', onActionExportToFile);
  document
    .querySelector('#actionSendToPlayer')
    .addEventListener('click', onActionSendToPlayer);
  document
    .querySelector('#actionSaveToAlbum')
    .addEventListener('click', onActionSaveToAlbum);
  document
    .querySelector('#actionAlbumView')
    .addEventListener('change', onActionAlbumView);
  document
    .querySelector('#actionAlbumOpen')
    .addEventListener('click', onActionAlbumOpen);
  document
    .querySelector('#actionAlbumExport')
    .addEventListener('click', onActionAlbumExport);
  document
    .querySelector('#actionDropToGround')
    .addEventListener('click', onActionDropToGround);
});

function onActionSaveToAlbum() {
  /** @type {import('./inventory/element/ItemEditorElement.js').ItemEditorElement} */
  const itemEditor = document.querySelector('#editor');
  try {
    let item = itemEditor.getSocketedItem();
    if (item) {
      addItemToAlbum(getInventoryStore(), 'main', item);
      itemEditor.clearEditor();
    }
  } catch (e) {
    console.error('Failed to export item', e);
  }
}

function onActionExportToFile() {
  /** @type {import('./inventory/element/ItemEditorElement.js').ItemEditorElement} */
  const itemEditor = document.querySelector('#editor');
  try {
    let item = itemEditor.getSocketedItem();
    if (item) {
      let jsonData = exportItemToJSON(item);
      downloadText(`${item.displayName || 'New Item'}.json`, JSON.stringify(jsonData, null, 4));
    }
  } catch (e) {
    console.error('Failed to export item', e);
  }
}

function onActionSendToPlayer() {
  /** @type {import('./inventory/element/ItemEditorElement.js').ItemEditorElement} */
  const itemEditor = document.querySelector('#editor');
  try {
    let item = itemEditor.getSocketedItem();
    if (item) {
      const ctx = getCursorContext();
      if (ctx.server && ctx.server.instance) {
        let server = ctx.server.instance;
        let result = window.prompt(`Who do you want to send it to?\n - ${server.getActiveClientNames().join('\n - ')}`).trim().toLowerCase();
        ctx.server.instance.sendItemTo(result, item);
      }
    }
  } catch (e) {
    console.error('Failed to export item', e);
  }
}

function onActionDropToGround() {
  /** @type {import('./inventory/element/ItemEditorElement.js').ItemEditorElement} */
  const itemEditor = document.querySelector('#editor');
  let item = itemEditor.getSocketedItem();
  if (item) {
    dropOnGround(item);
    itemEditor.clearEditor();
  }
}

function onActionAlbumView(e) {
  /** @type {import('./cards/CardAlbumElement.js').CardAlbumElement} */
  const albumElement = document.querySelector('#album');
  albumElement.changeView(e.target.value);
}

function onActionAlbumOpen(e) {
  let sidebar = document.querySelector('.sidebar');
  if (sidebar.classList.contains('expand')) {
    sidebar.classList.remove('expand', 'open');
  } else {
    sidebar.classList.add('expand', 'open');
  }
}

function onActionAlbumExport(e) {
  /** @type {import('./cards/CardAlbumElement.js').CardAlbumElement} */
  const albumElement = document.querySelector('#album');
  const store = getInventoryStore();
  const album = getAlbumInStore(store, albumElement.albumId);
  if (album) {
    const timestamp = Date.now();
    try {
      const jsonData = exportAlbumToJSON(album);
      downloadText(`satchel-album-data-${timestamp}.json`, JSON.stringify(jsonData, null, 4));
    } catch (e) {
      console.error(e);
    }
  }
}

function onEditClick() {
  const sidebar = document.querySelector('.sidebar');
  sidebar.classList.toggle('open');
}

function onDeleteClick() {
  if (window.confirm('Clear all items on the ground?')) {
    clearGround();
  }
}

function onCloudClick() {
  document.querySelector('#cloudButton').toggleAttribute('disabled', true);
  if (shouldConnnectAsClient()) {
    let ctx = getCursorContext();
    connectAsClient(ctx).catch(e => {
      window.alert('Could not connect: ' + e);
      document.querySelector('#cloudButton').toggleAttribute('disabled', false);
    });
  } else {
    let ctx = getCursorContext();
    connectAsServer(ctx).then(() => {
      document.querySelector('#actionSendTo').toggleAttribute('disabled', false);
    }).catch(e => {
      window.alert('Could not connect: ' + e);
    }).finally(() => {
      document.querySelector('#cloudButton').toggleAttribute('disabled', false);
    });
  }
}

function onDownloadClick() {
  const timestamp = Date.now();
  if (isServerSide()) {
    let serverData;
    try {
      serverData = JSON.parse(localStorage.getItem('server_data'));
    } catch {
      serverData = {};
    }
    const jsonData = exportDataToJSON('server_v1', serverData, {});
    const dataString = JSON.stringify(jsonData, null, 4);
    downloadText(`satchel-server-data-${timestamp}.json`, dataString);
  } else {
    const store = getInventoryStore();
    const inv = getExistingInventory(store, 'main');
    const jsonData = exportInventoryToJSON(inv);
    const dataString = JSON.stringify(jsonData, null, 4);
    downloadText(`satchel-client-data-${timestamp}.json`, dataString);
  }
}

function onUploadClick() {
  let input = /** @type {HTMLInputElement} */ (
    document.querySelector('#uploadInput')
  );
  input.click();
}

async function onUploadChange(e) {
  const file = e.target.files[0];

  let jsonData;
  try {
    jsonData = JSON.parse(await file.text());
  } catch {
    window.alert('Cannot load file with invalid json format.');
  }

  switch(jsonData._type) {
    case 'inv_v1': {
      const store = getInventoryStore();
      let inv = getExistingInventory(store, 'main');
      importInventoryFromJSON(jsonData, inv);
      dispatchInventoryChange(store, 'main');
    } break;
    case 'album_v1': {
      const store = getInventoryStore();
      let album = getExistingAlbum(store, 'main');
      importAlbumFromJSON(jsonData, album);
      dispatchAlbumChange(store, 'main');
    } break;
    case 'item_v1': {
      const store = getInventoryStore();
      let album = getExistingAlbum(store, 'main');
      let item = importItemFromJSON(jsonData);
      addItemToAlbum(store, album.albumId, item);
    } break;
    case 'client_v1':
      throw new Error('Not yet implemented.');
    case 'server_v1': {
      const data = jsonData._data;
      localStorage.setItem('server_data', JSON.stringify(data));
      const ctx = getCursorContext();
      if (ctx.server && ctx.server.instance) {
        ctx.server.instance.localData = data;
      }
    } break;
    default:
      window.alert('Cannot load json with unknown data type.');
  }
}
