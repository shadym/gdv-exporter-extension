'use strict';

class Record {

    constructor(number, titleGerman, restrictions) {
        this.number = number
        this.titleGerman = titleGerman
        this.restrictions = restrictions
        this.className = null
        this.isIn = null
        this.isOut = null
        this.isImplementedIn = null
        this.isImplementedOut = null
    }
}