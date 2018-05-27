import { combineReducers } from 'redux'
import {
    ADD_ITEM,
    DELETE_ITEM,
    FAVORITE_ITEM,
    SORT_ITEMS,
    TICK_ITEM,
    ACTIVE_ITEM,
    TOGGLE_ADD_PANEL,
    ADD_FILTER_ITEMS,
    REMOVE_FILTER_ITEMS,
    CLEAR_FILTER_ITEMS
} from './actions.js';

const lang_state = {
    common: {
        optional: "Los siguientes datos son opcional",
        date: {
            enterYear: "Ingrese un año de 4 dígitos",
            days: ['Lun','Mar','Mie','Jue','Vie','Sab','Dom'],
            months: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']
        }
    },

    item: {
        title: "título",
        type: "categoría",
        destination: "destinatario",
        reminder: "alarma",
        description: "descripción",
        new: "último item agregado"
    },

    filter: {
        add: "agregar una nueva condición de filtrado",
        remove: "remover una condición de filtrado",
        clear: "remover todas las condiciones de filtrado",
        words: "palabras a filtrar, separadas por coma"
    },


    buttons: {
        add: "agregar",
        confirm: "confirmar",
        cancel: "cancelar",
        remove: "borrar",
        favorite: "favorito",
        edit: "editar",
        complete: "completar"
    }
}

const ui_state = {
    addPanel: {
        active: false,
        data: {
            title: "",
            type: "",
            destination: "",
            reminder: {
                active: false,
                date: new Date()
            },
            description: ""
        }
    }
}

const current_file_state = {
    ids: 3,
    sort:{
        condition: "title",
        asc: true
    },
    filter: {
        next: 0,
        list: []
    },
    items: [
        {
            id: 0,
            visible: true,
            active: true,
            favorite: true,
            completed: false,
            creation: Date.now(),
            title: "Item Favorito",
            type:  "Tutorial",
            destination: "Nuevo Usuario",
            reminder: {
                active: false,
                date: new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
            },
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur, numquam. Dicta temporibus minima aliquam assumenda, placeat minus, culpa maiores itaque omnis voluptatibus molestias animi officiis tempora adipisci ullam consequatur eveniet"
        },
        {
            id: 1,
            visible: true,
            active: true,
            favorite: false,
            completed: false,
            creation: Date.now(),
            title: "Item Normal",
            type:  "Tutorial",
            destination: "Nuevo Usuario",
            reminder: {
                active: false,
                date: new Date()
            },
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur, numquam. Dicta temporibus minima aliquam assumenda, placeat minus, culpa maiores itaque omnis voluptatibus molestias animi officiis tempora adipisci ullam consequatur eveniet"
        },
        {
            id: 2,
            visible: true,
            active: true,
            favorite: false,
            completed: true,
            creation: Date.now(),
            title: "Item Finalizado",
            type:  "Tutorial",
            destination: "Nuevo Usuario",
            reminder: {
                active: false,
                date: new Date()
            },
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur, numquam. Dicta temporibus minima aliquam assumenda, placeat minus, culpa maiores itaque omnis voluptatibus molestias animi officiis tempora adipisci ullam consequatur eveniet"
        },
    ]
}

function lang(state = lang_state, {type, payload}) {
    switch (type) {
        default:
            return state;
    }
}

function ui(state = ui_state, {type, payload}) {
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

function current_file(state = current_file_state, {type, payload}) {
    var s = JSON.parse(JSON.stringify(state));
    switch(type) {
        case ADD_ITEM:
            let i = s.items.find(item => item.id === payload.id)
            if(i) {
                i = payload
            }
            else {
                payload.id = s.ids;
                s.ids = s.ids+1;
                s.items.push(payload);
            }
            break;

        case DELETE_ITEM:
            s.items = state.items.filter(function(item) {
                return item.id !== payload;
            });
            break;

        case FAVORITE_ITEM:
            s.items.find(item => item.id === payload).favorite = !state.items.find(item => item.id === payload).favorite
            s.items.find(item => item.id === payload).completed = false
            break;

        case TICK_ITEM:
            s.items.find(item => item.id === payload).completed = !state.items.find(item => item.id === payload).completed
            s.items.find(item => item.id === payload).favorite = false
            break;

        case ACTIVE_ITEM:
            s.items.find(item => item.id === payload).active = !s.items.find(item => item.id === payload).active;
            break;

        case SORT_ITEMS:
            s.sort.condition = payload;
            s.sort.asc = payload !== state.sort.condition ? true : !state.sort.asc;
            break;

        case ADD_FILTER_ITEMS:
            s.filter.list.push({id: state.filter.next, field: payload.field, condition: payload.condition})
            s.filter.next += 1;
            break; 

        case REMOVE_FILTER_ITEMS:
            s.filter.list = state.filter.list.filter((f) => {
                return f.id !== payload;
            })
            break;

        case CLEAR_FILTER_ITEMS:
            s.filter.list = [];
            s.filter.next = 0
            break;

        default:
            return state;
    }

    s.items.forEach((item) => {
        for (var i = 0 ; i < s.filter.list.length ; i++) {
            if(!item[s.filter.list[i].field].toUpperCase().trim().includes(s.filter.list[i].condition.toUpperCase().trim())) {
                item.visible = false;
                return
            }
        }
        item.visible = true;        
    })

    s.items.sort((a,b) => {
        if(a.completed && !b.completed)
            return 1;
        if(!a.completed && b.completed)
            return -1;
        if(a.favorite && !b.favorite)
            return -1;
        if(!a.favorite && b.favorite)
            return 1;
        if(a[s.sort.condition] < b[s.sort.condition])
            return s.sort.asc ? -1 : 1;
        if(a[s.sort.condition] > b[s.sort.condition])
            return s.sort.asc ? 1 : -1;
        return 0;
    });
    return s;
}

const reducers = combineReducers({
    lang,
    ui,
    current_file
})

export default reducers