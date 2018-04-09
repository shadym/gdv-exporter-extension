class MetaProvider {

    constructor() {
        this.config = {
            record: {},
            message: {}
        }
        if (!!localStorage.getItem('gdv-meta')) {
            this.config = JSON.parse(localStorage.getItem('gdv-meta'))
            this.status = 'cache'
        } else {
            this.status = 'no'
        }
    }

    checkStatus() {
        if (["updated", "updating", "cache"].indexOf(this.status)>-1) {
            if (this.status === "cache") {
                this.update()
            }
            return new Promise((resolve, reject) => {
                resolve()
            })
        }
        return this.update()
    }

    update() {
        this.status = "updating"

        let opt = {
            url: 'https://spreadsheets.google.com/feeds/list/1bTRejM2CsRNCKKDRl9iAUzV8FZu4dh4XH4UNAl8WVKE/od6/public/values?alt=json-in-script&callback=data',
            method: 'GET',
            mode: 'cors',
            headers: {
                'Access-Control-Allow-Origin':'*'
            }
        }
        let header = new Headers({
            'Access-Control-Allow-Origin':'*'
        })
        let sentData = {
            method: opt.method,
            mode: 'cors',
            header: header
        }
        return fetch(opt.url, sentData)
            .then(r => r.text())
            .catch((e) => {
                console.error(e)
            })
            .then(text => {
                text = text.split('\n')[1]
                text = text.substr(5, text.length - 7)
                var data = JSON.parse(text)
                
                data.feed.entry.forEach(e => {
                    const number = +e['gsx$number'].$t
                    const className = e['gsx$classname'].$t
                    const implementedIn = e['gsx$implementedin'].$t === "yes"
                    const implementedOut = e['gsx$implementedout'].$t === "yes"
                    this.config.record[number] = {
                        className: className,
                        implementedIn: implementedIn,
                        implementedOut: implementedOut
                    }
                })
            })
            .then(() => {
                localStorage['gdv-meta'] = JSON.stringify(this.config)
                this.status = "updated"
                console.log('set updated')
            })
    }


    getRecord(record) {
        return this.checkStatus().then(() => {
            const meta = this.config.record[record.number]
            return meta ? Object.assign(record, meta) : record
        })
    }

    getMessage(message) {
        return this.checkStatus().then(() => {
            const meta = this.config.message[message.number]
            return meta ? Object.assign(message, meta) : message
        })
    }
}
