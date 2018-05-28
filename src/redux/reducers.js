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
    SORT_FILE
} from './actions.js';

import fs from 'fs'

const dialog = require('electron').remote.dialog 

import lang_state from "../config/lang/es.json";

const ui_state = {
    addPanel: {
        active: false,
        data: {
            title: "",
            type: "",
            destination: "",
            reminder: {
                active: false,
                date: null,
                formated : null
            },
            description: ""
        }
    }
}

import current_file_state from "../config/tutorials/tutorial-nosave.json";

// const current_file_state = {
//     sort:{
//         condition: "title",
//         asc: true
//     },
//     filter: {
//         next: 0,
//         list: []
//     },
//     items: {
//         nextId: 0,
//         list: []
//     }
// }

function langReducer(state = lang_state, {type, payload}) {
    switch (type) {
        default:
            return state;
    }
}

function uiReducer(state = ui_state, {type, payload}) {
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

function sortItems(items, condition, asc) {
    const callback = (a,b) => {
        if(a.completed && !b.completed)
            return 1;
        if(!a.completed && b.completed)
            return -1;
        if(a.favorite && !b.favorite)
            return -1;
        if(!a.favorite && b.favorite)
            return 1;
        if(a[condition] < b[condition])
            return asc ? -1 : 1;
        if(a[condition] > b[condition])
            return asc ? 1 : -1;
        return 0;
    }
    return items.sort(callback);
}

function findItem(items, id) {
    return items.find(item => item.id === id)
}

function filterItems(items, list) {
    items.forEach((item) => {
        for (var i = 0 ; i < list.length ; i++) {
            if(!item[list[i].field].toUpperCase().trim().includes(list[i].condition.toUpperCase().trim())) {
                item.visible = false;
                return
            }
        }
        item.visible = true;        
    })
}

function currentFileReducer(state = current_file_state, {type, payload}) {
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
            s.items.list = sortItems(s.items.list, s.sort.condition, s.sort.asc)
            break;

        case ADD_ITEM:
        case DELETE_ITEM:
        case FAVORITE_ITEM:
        case TICK_ITEM:
        case ACTIVE_ITEM:
            // If its necessary sorting the file on one of this actions, call sortItems here
            s.items = itemsReducer(s.items, {type, payload})
            if(type === ADD_ITEM)
                filterItems(s.items.list, s.filter.list)
            break;

        case ADD_FILTER_CONDITION:
        case REMOVE_FILTER_CONDITION:
        case CLEAR_FILTER_CONDITIONS:
            s.filter = filterReducer(s.filter, {type, payload})
            filterItems(s.items.list, s.filter.list)
            break;
    }
    return s;
}

function itemsReducer(state = current_file_state.items, {type, payload}) {
    var s = JSON.parse(JSON.stringify(state));
    var item;
    switch(type) {
        case ADD_ITEM:
            item = findItem(s.list, payload.id)
            if(item) {
                s.list[s.list.indexOf(item)] = payload;
            }
            else {
                payload.id = s.nextId;
                s.nextId+=1;
                s.list.push(payload);
            }
            break;

        case DELETE_ITEM:
            s.list = s.list.filter(item => item.id !== payload);
            break;

        case FAVORITE_ITEM:
            item = findItem(s.list, payload)
            item.favorite = !item.favorite
            item.completed = false
            break;

        case TICK_ITEM:
            item = findItem(s.list, payload)
            item.completed = !item.completed
            item.favorite = false
            break;

        case ACTIVE_ITEM:
            item = findItem(s.list, payload)
            item.active = !item.active;
            break;
    }
    return s;
}

function filterReducer(state = current_file_state.filter, {type, payload}) {
    var s = JSON.parse(JSON.stringify(state));
    switch(type) {
        case ADD_FILTER_CONDITION:
            s.list.push({ id: state.next, field: payload.field, condition: payload.condition })
            s.next += 1;
            break; 

        case REMOVE_FILTER_CONDITION:
            s.list = state.list.filter(f => f.id !== payload);
            break;

        case CLEAR_FILTER_CONDITIONS:
            s.list = [];
            s.next = 0;
            break;
    }
    return s;
}

export default combineReducers({
    lang: langReducer,
    ui: uiReducer,
    current_file: currentFileReducer
})