import { combineReducers } from 'redux'
import {
    ADD_ITEM,
    DELETE_ITEM,
    FAVORITE_ITEM,
    TICK_ITEM,
    ACTIVE_ITEM,
    TOGGLE_ADD_PANEL,
    ADD_FILTER_CONDITION,
    REMOVE_FILTER_CONDITION,
    CLEAR_FILTER_CONDITIONS,
    OPEN_FILE,
    SAVE_FILE,
    SORT_FILE,
    ADD_FILTER_POSSIBILITY
} from './actions.js';
import fs from 'fs'

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

function currentFileReducer(state = defState.current_file, {type, payload}) {
    var s = JSON.parse(JSON.stringify(state));
    switch(type) {
        case OPEN_FILE:
            s = JSON.parse(fs.readFileSync(payload, "utf8"));
            break;

        case SAVE_FILE:
            fs.writeFile(payload, JSON.stringify(s), e => { if(e) dialog.showMessageBox({ message: e.toString(), buttons: ["Ok"] }) })
            break;

        case SORT_FILE:
            s.sort.condition = payload;
            s.sort.asc = payload !== state.sort.condition ? true : !state.sort.asc;
            s.items.list = s.items.list.sortByCondition(s.sort.condition, s.sort.asc)
            break;

        case ADD_ITEM:
        case DELETE_ITEM:
        case FAVORITE_ITEM:
        case TICK_ITEM:
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

function itemsReducer(state = defState.current_file.items, {type, payload}) {
    var s = JSON.parse(JSON.stringify(state));
    var item;
    switch(type) {
        case ADD_ITEM:
            item = s.list.findById(payload.id)
            if(item) {
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

        case TICK_ITEM:
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

function filterReducer(state = defState.current_file.filter, {type, payload}) {
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
    current_file: currentFileReducer
})