export const READ_RECENT_FILES = "read_recent_files";

export function readRecentFiles() {
    return {
        type: READ_RECENT_FILES,
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


export const TOGGLE_ADD_PANEL = "toggle_add_panel";
export function toggleAddPanel(forceActive = false, data = { title: "", type: "", destination: "", reminder: "", description: "" }) {
    return {
        type: TOGGLE_ADD_PANEL,
        payload: {
            data: data,
            forceActive: forceActive
        }
    }
}