import { setCursorElement } from './CursorHelper.js';
import { setGroundContainer } from './GroundHelper.js';
import { createInventoryView } from './InventoryView.js';
import { getInventoryStore, createInventory } from './InventoryStore.js';
import { applyItemBuilder, openItemBuilder, resetItemBuilder } from './ItemBuilder.js';
import { loadFromLocalStorage, saveToLocalStorage } from './InventoryLoader.js';

window.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#appVersion').textContent = 'v1.0.1';
    document.querySelector('#itemBuilder').addEventListener('submit', (e) => {
        e.preventDefault();

        let editor = document.querySelector('#editor');
        editor.classList.toggle('open', false);

        let target = e.target;
        applyItemBuilder(target);
        return false;
    });
    document.querySelector('#itemResetButton').addEventListener('click', (e) => {
        e.preventDefault();

        let editor = document.querySelector('#editor');
        editor.classList.toggle('open', false);

        let itemBuilder = document.querySelector('#itemBuilder');
        resetItemBuilder(itemBuilder);

        return false;
    });
    document.addEventListener('itemcontext', (e) => {
        e.preventDefault();
        e.stopPropagation();

        let editor = document.querySelector('#editor');
        editor.classList.toggle('open', false);
        let itemId = e.detail.itemId;
        if (itemId) {
            openItemBuilder(document.querySelector('#itemBuilder'), itemId);
            // Animate open/close transition
            setTimeout(() => editor.classList.toggle('open', true), 100);
        }

        return false;
    })
});

window.addEventListener('DOMContentLoaded', () => {
    let store = getInventoryStore();
    let workspace = document.querySelector('#workspace');
    let cursor = document.querySelector('#cursor');
    let ground = document.querySelector('#ground');

    let cursorInventory = createInventory(getInventoryStore(), 'cursor', 'socket', 1, 1);
    let cursorElement = createInventoryView(store, cursorInventory.name);
    cursor.appendChild(cursorElement);

    setCursorElement(cursorElement);
    setGroundContainer(ground);

    let mainInventory = createInventory(store, 'main', 'grid', 12, 9);
    let mainElement = createInventoryView(store, mainInventory.name);
    workspace.appendChild(mainElement);

    // Load from storage...
    loadFromLocalStorage(getInventoryStore());

    // Auto save to local storage every 1 second
    setInterval(() => {
        console.log('Autosave...');
        saveToLocalStorage(getInventoryStore());
    }, 1000);
});