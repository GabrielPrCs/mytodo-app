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

export const SAVE_FILE_AS = "save_file_as";
export function saveFileAs(path) {
    return {
        type: SAVE_FILE_AS,
        payload: path
    }
}

export const SAVE_FILE = "save_file";
export function saveFile() {
    return {
        type: SAVE_FILE
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

export const SORT_FILE = "favorite_items";
export function sortFile(condition) {
    return {
        type: SORT_FILE,
        payload: condition
    }
}


/**
 * Filter actions
 */
export const ADD_FILTER_POSSIBILITY = "add_filter_possibility";

export const ADD_FILTER_CONDITION = "add_filter_items";
export function addFilterCondition(id, field, condition) {
    return {
        type: ADD_FILTER_CONDITION,
        payload: {
            id: id,
            field: field,
            condition: condition
        }
    }
}

export const REMOVE_FILTER_CONDITION = "remove_filter_items";
export function removeFilterCondition(id) {
    return {
        type: REMOVE_FILTER_CONDITION,
        payload: id
    }
}

export const CLEAR_FILTER_CONDITIONS = "clear_filter_items";
export function clearFilterConditions() {
    return {
        type: CLEAR_FILTER_CONDITIONS
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

/**
 * Tabs actions
 */
export const CHANGE_ACTIVE_FILE = "change_active_file";
export function changeActiveFile(id) {
    return {
        type: CHANGE_ACTIVE_FILE,
        payload: id
    }
}