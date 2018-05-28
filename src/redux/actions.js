/**
 * Current file actions
 */

export const OPEN_FILE = "open_file";
export function openFile(path) {
    return {
        type: OPEN_FILE,
        payload: path
    }
}

export const SAVE_FILE = "save_file";
export function saveFile(path) {
    return {
        type: SAVE_FILE,
        payload: path
    }
}

export const ADD_ITEM = "add_item";
export function addItem(item) {
    return {
        type: ADD_ITEM,
        payload: item
    }
}

export const DELETE_ITEM = "delete_item";
export function deleteItem(itemid) {
    return {
        type: DELETE_ITEM,
        payload: itemid
    }
}

export const FAVORITE_ITEM = "favorite_item";
export function favoriteItem(itemid) {
    return {
        type: FAVORITE_ITEM,
        payload: itemid
    }
}

export const TICK_ITEM = "tick_item";
export function tickItem(itemid) {
    return {
        type: TICK_ITEM,
        payload: itemid
    }
}

export const ACTIVE_ITEM = "active_item";
export function activeItem(itemid) {
    return {
        type: ACTIVE_ITEM,
        payload: itemid
    }
}

export const SORT_ITEMS = "favorite_items";
export function sortItems(condition) {
    return {
        type: SORT_ITEMS,
        payload: condition
    }
}


/**
 * Filter actions
 */
export const ADD_FILTER_ITEMS = "add_filter_items";
export function addFilterItems(field, condition) {
    return {
        type: ADD_FILTER_ITEMS,
        payload: {
            field: field,
            condition: condition
        }
    }
}

export const REMOVE_FILTER_ITEMS = "remove_filter_items";
export function removeFilterItems(id) {
    return {
        type: REMOVE_FILTER_ITEMS,
        payload: id
    }
}

export const CLEAR_FILTER_ITEMS = "clear_filter_items";
export function clearFilterItems() {
    return {
        type: CLEAR_FILTER_ITEMS
    }
}

/**
 * User interface actions
 */
export const TOGGLE_ADD_PANEL = "toggle_add_panel";
export function toggleAddPanel(forceActive = false, data = { title: "", type: "", destination: "", reminder: { active: false, date: null }, description: "" }) {
    return {
        type: TOGGLE_ADD_PANEL,
        payload: {
            data: data,
            forceActive: forceActive
        }
    }
}