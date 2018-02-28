class MessageParser {
    constructor(metaProvider) {
        this.metaProvider = metaProvider

    }

    getRecords() {
        const rows = Array.from(document
            .querySelectorAll('body > table > tbody > tr > td:nth-child(3) > blockquote:nth-child(6) > table tr'))
            .slice(1)

        this.records = rows
            .map(r => new Record(
                +r.children[0].innerText.trim(),
                r.children[1].innerText.trim(),
                r.children[2].innerText.trim()
            ))
            .map(r => this.metaProvider.getRecord(r))

        return this.records
    }
    
}
