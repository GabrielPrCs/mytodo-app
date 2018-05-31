import lang from "./partials/_lang.json";
import ui from "./partials/_ui.json";
import emptyContent from "./partials/_empty-file-content.json";


const emptyFile = {
    id: "newfile0",
    path: null,
    name: lang.common.newfile,
    content: emptyContent
}

const workarea = {
    activeFileId: emptyFile.id,
    nextNewfileId: emptyFile+1,
    openedFiles: [emptyFile],
}

let state = {
    lang: lang,
    ui: ui,
    workarea: workarea,
}

/**
 * Designed for an array of objects. Each object inside the array must have a property called id.
 * Searches and returns the unique object inside the array that has the indicated id.
 */
Array.prototype.findById = function(id) {
    return this.find(e => e.id === id);
}

Array.prototype.returnIfExists = function(comparer) {
    for(var i=0; i < this.length; i++)
        if(comparer(this[i])) return this[i]; 
    return undefined; 
}

Array.prototype.pushOrIncrease = function(element, comparer, increaser) {
    let e = this.returnIfExists(comparer);
    if(e)
        increaser(e)
    else
        this.push({count: 1, content: element})
}

Array.prototype.filterWithList = function(list) {
    this.forEach((item) => {
        item.visible = true;
        if(list.length === 0) return
        for (var i = 0 ; i < list.length ; i++) {
            if(item[list[i].field].toUpperCase().trim().includes(list[i].condition.toUpperCase().trim()))
                return
        }
        item.visible = false;
    })
}

Array.prototype.sortByCondition = function(condition, asc) {
    const sortComparator = (a, b, condition, asc) => {
        if((a.completed && !b.completed) || (!a.favorite && b.favorite))
            return 1;
        if((!a.completed && b.completed) || (a.favorite && !b.favorite))
            return -1;
        if(a[condition] < b[condition])
            return asc ? -1 : 1;
        if(a[condition] > b[condition])
            return asc ? 1 : -1;
        return 0;
    }
    return this.sort((a,b) => sortComparator(a, b, condition, asc))
}

export default state;