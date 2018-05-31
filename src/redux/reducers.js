import { combineReducers } from 'redux'
import {
    ADD_ITEM,
    DELETE_ITEM,
    FAVORITE_ITEM,
    COMPLETE_ITEM,
    ACTIVE_ITEM,
    TOGGLE_ADD_PANEL,
    ADD_FILTER_CONDITION,
    REMOVE_FILTER_CONDITION,
    CLEAR_FILTER_CONDITIONS,
    NEW_FILE,
    OPEN_FILE,
    SAVE_FILE,
    SAVE_FILE_AS,
    SORT_FILE,
    ADD_FILTER_POSSIBILITY,
    CHANGE_ACTIVE_FILE
} from './actions.js';

import fs from 'fs'
import hash from 'object-hash';

import emptyFile from "./state/partials/_empty-file.json";


const dialog = require('electron').remote.dialog 


import defState from './state/default';

function langReducer(state = defState.lang, {type, payload}) {
    return state;
}

function uiReducer(state = defState.ui, {type, payload}) {
    switch(type) {
        case TOGGLE_ADD_PANEL:
            var s = JSON.parse(JSON.stringify(state));
            s.addPanel.active = payload.forceActive ? true : !state.addPanel.active;
            s.addPanel.data = payload.data
            return s;
        default:
            return state;
    }
}

function openedFilesReducer(state = defState.openedFiles, {type, payload}) {
    var s = JSON.parse(JSON.stringify(state));
    var auxiliaryFile = null;
    let current = null;

    let readFile = (path) => {
        // TODO: catch exceptions and show them in a dialog/ add them to app state
        return fs.readFileSync(path, "utf8");
    }

    switch(type) {

        case OPEN_FILE:
        case CHANGE_ACTIVE_FILE:
        case NEW_FILE:
            current = s.list.findById(s.currentActive)
            // If there is a current active file opened, it will be remove from the active state,
            // so is necessary to keep it's data (on memory) for future uses or for save
            // it to disk in any moment 
            if(current) {
                current.content = s.activeFile;
            }
            // Gets the file that will be the new active file
            if(type === CHANGE_ACTIVE_FILE) { 
                // If the action is "change the active file", it means that the file is already
                // charged on memory, so payload is the file's ID on memory
                auxiliaryFile = s.list.findById(payload)
                // If for any reason the content of the file has been de-allocated, but the reference
                // to this file is still on the opened files list, it means that the file is still
                // needed, so reload his content.
                if(!auxiliaryFile.content) {
                    // TODO: if the file content had been de-allocated, it was for memory reasons.
                    // So, before reloading its content, it will necessary to check if there is enough
                    // memory for doing that, if not, it will necessary to free some memory before process 
                    auxiliaryFile.content = JSON.parse(readFile(auxiliaryFile.path, "utf8"))
                }
            }
            else if(type === OPEN_FILE) { 
                // If the action is "open a new file", it means that the file isn't already
                // charged on memory, so payload is the full path to the opened file
                // The id of the file will be the hash of his absolute path. As an absolute path
                // is unique, the hash will be too
                let id = hash(payload)
                auxiliaryFile = s.list.findById(id)
                // If there is already a file with the same id, it means that the file
                // is already opened, so just change his state to active (its done on the end of this case).
                // Otherwise, create a new reference to the file and add it to the system.
                if(!auxiliaryFile) {
                    auxiliaryFile = {
                        id: id,
                        name: payload,
                        path: payload,
                        content: JSON.parse(readFile(payload, "utf8")),
                    }
                    // TODO: check if there is enough memory to store the file, otherwise release some.
                    s.list.unshift(auxiliaryFile)
                }
            }
            else if(type === NEW_FILE) {
                auxiliaryFile = {
                    id: "newfile"+s.nextNewfileId,
                    name: defState.lang.common.newfile + " " + s.nextNewfileId,
                    content: emptyFile
                }
                s.list.unshift(auxiliaryFile);
                s.nextNewfileId++;
            }
            // Saves the data of the new active file on the state if the content is correctly loaded
            if(auxiliaryFile.content) {
                s.currentActive = auxiliaryFile.id;
                s.activeFile = auxiliaryFile.content;
            }
            break;

        case SAVE_FILE:
        case SAVE_FILE_AS:
            current = s.list.findById(s.currentActive)
            // If the file is still not on the opened files list, it means that the file has never
            // been saved before, so its necessary to save it. For that reason, if there is no reference
            // to the file on the list, creates and adds that reference
            if(!current) {
                current = {}
                s.list.unshift(current)
            }
            // Saves the modified data of the file reference on the opened file's list.
            current.content = s.activeFile;
            // If the file that is going to be save has no path (the file has never been saved before),
            // or the user wants to save the file in a different location, asks the user for the that path.
            if(!current.path || type === SAVE_FILE_AS) {
                let newPath = dialog.showSaveDialog({}) // Without callback it's a blocking dialog
                // If the user entered a valid path, then proceed with the saving action,
                // otherwise stop the action and show an error message
                if(newPath) {
                    current.name = newPath
                    current.path = newPath
                }
                else {
                    // Reverses all the changes to the previous state and exits the case
                    s = state;
                    break;
                }
            }
            // On this point, the current file will have an assigned path, so now
            // verifies if the file has an ID. If does, leaves it as it is, otherwise assigns it.
            current.id = current.id.startsWith("newfile") ? hash(current.path) : current.id
            // As the ID of the file could had been created on the previous step, then
            // adds that ID as the new active file. As here the active file will not be
            // changed to another one, the s.activeFile info not need to be modified
            s.currentActive = current.id
            // Saves the file to disk
            fs.writeFile(current.path, JSON.stringify(current.content), e => {
                if(e)
                    dialog.showMessageBox({ message: e.toString(), buttons: ["Ok"]})
            })
            break;

        case SORT_FILE:
        case ADD_ITEM:
        case DELETE_ITEM:
        case FAVORITE_ITEM:
        case COMPLETE_ITEM:
        case ACTIVE_ITEM:
        case ADD_FILTER_CONDITION:
        case REMOVE_FILTER_CONDITION:
        case CLEAR_FILTER_CONDITIONS:
            s.activeFile = currentFileReducer(s.activeFile, {type: type, payload: payload})
            break;
    }
    return s;
}

function currentFileReducer(state = defState.openedFiles.activeFile, {type, payload}) {
    var s = JSON.parse(JSON.stringify(state));
    switch(type) {
        case SORT_FILE:
            s.sort.condition = payload;
            s.sort.asc = payload !== state.sort.condition ? true : !state.sort.asc;
            s.items.list = s.items.list.sortByCondition(s.sort.condition, s.sort.asc)
            break;

        case ADD_ITEM:
        case DELETE_ITEM:
        case FAVORITE_ITEM:
        case COMPLETE_ITEM:
        case ACTIVE_ITEM:
            // If its necessary sorting the file on one of this actions, call sort here
            s.items = itemsReducer(s.items, {type, payload})
            if(type === ADD_ITEM) {
                s.filter = filterReducer(s.filter, {type, payload})
                s.items.list.filterWithList(s.filter.list);
            }
            break;

        case ADD_FILTER_CONDITION:
        case REMOVE_FILTER_CONDITION:
        case CLEAR_FILTER_CONDITIONS:
            s.filter = filterReducer(s.filter, {type, payload})
            s.items.list.filterWithList(s.filter.list);
            break;
    }
    return s;
}

function itemsReducer(state = defState.openedFiles.activeFile.items, {type, payload}) {
    var s = JSON.parse(JSON.stringify(state));
    var item;
    switch(type) {

        case ADD_ITEM:
            item = s.list.findById(payload.id)
            if(item) {
                // If an item with the same id indicated on the payload exists on the item list,
                // it means that the "add item" action is an update of the indicated item.
                // For that reason, replaces on the position of that item inside the items array
                // the old data with the new data indicated on the payload
                s.list[s.list.indexOf(item)] = payload;
            }
            else {
                payload.id = s.nextId;
                payload.visible = true;
                s.nextId+=1;
                s.list.push(payload);
            }
            break;

        case DELETE_ITEM:
            s.list = s.list.filter(item => item.id !== payload);
            break;

        case FAVORITE_ITEM:
            item = s.list.findById(payload)
            item.favorite = !item.favorite
            item.completed = false
            break;

        case COMPLETE_ITEM:
            item = s.list.findById(payload)
            item.completed = !item.completed
            item.favorite = false
            break;

        case ACTIVE_ITEM:
            item = s.list.findById(payload)
            item.active = !item.active;
            break;
    }
    return s;
}

function filterReducer(state = defState.openedFiles.activeFile.filter, {type, payload}) {
    var s = JSON.parse(JSON.stringify(state));
    switch(type) {
        case ADD_ITEM:
            payload.title.split(" ").forEach(element =>  {if(element !== "") s.possibilities.title.pushOrIncrease(element, e => e.content === element, e => e.count++)})
            payload.type.split(" ").forEach(element =>  {if(element !== "") s.possibilities.type.pushOrIncrease(element, e => e.content === element, e => e.count++)})
            payload.destination.split(" ").forEach(element =>  {if(element !== "") s.possibilities.destination.pushOrIncrease(element, e => e.content === element, e => e.count++)})
            break;

        case ADD_FILTER_CONDITION:
            let obj = { id: payload.id, field: payload.field, condition: payload.condition };
            s.list.push(obj);
            break; 

        case REMOVE_FILTER_CONDITION:
            s.list = state.list.filter(f => f.id !== payload);
            break;

        case CLEAR_FILTER_CONDITIONS:
            s.list = [];
            break;
    }
    return s;
}

export default combineReducers({
    lang: langReducer,
    ui: uiReducer,
    openedFiles: openedFilesReducer,
})