class Title {
    constructor() {
        this.setTitle()
    }

    setTitle() {
        const docName = document.location.pathname.split('/')[3].split('.')[0]
        const docTypeCode =  docName.substr(0, 2)
        const docNumber = /\d+/.exec(docName)[0]
        let docType
        switch (docTypeCode) {
            case 'ds':
                docType = 'Record'
                break
            case 'an':
                docType = 'Appendix'
                break
            case 'le':
                docType = 'Message'
                break
            default:
                docType = 'UNKNOWN'
        }
        document.title = `${docType} ${docNumber}`;
    }
}

const title = new Title()
