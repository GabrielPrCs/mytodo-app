import lang from "./partials/lang/_es.json";
import ui from "./partials/_ui.json";
import file from "./partials/_empty-file.json";

const openedFiles = {
    currentActive: "newfile0",
    nextNewfileId: 1,
    list: [{
        id: "newfile0",
        name: lang.common.newfile,
        content: file
    }],
    activeFile: file
}

let state = {
    lang: lang,
    ui: ui,
    openedFiles: openedFiles,
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

/**
 * State -> current_file -> list
 */
Array.prototype.findById = function(id) {
    return this.find(e => e.id === id);
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