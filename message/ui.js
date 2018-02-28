class MessageUI {

    constructor(messageParser) {
        this.parser = messageParser

        Promise.all(this.parser.getRecords()).then(r => {
            this.records = r
            return r
        })
        .then(records => this.initUI(records))
    }

    initUI(records) {
        this.removeDefaultUI()

        const container = document.createElement('div')
		container.id = "message-container"
        container.innerHTML = this.getTemplate(records)
        const parent = document.querySelector('body > table > tbody > tr > td:nth-child(3) > blockquote:nth-child(6)')
        parent.appendChild(container)
    }

    removeDefaultUI() {
        const table = document.querySelector('body > table > tbody > tr > td:nth-child(3) > blockquote:nth-child(6) > table')
        table.remove()
    }


    getTemplate(records) {
        const genLink = (number, title) => `<a href="/snetz/release2013/ds${number}.htm">${title}</a>`

        return `
        <style>
            #message-container {}
            .message-records {}
            .message-record {
                display: flex;
                justify-content: space-between;
                margin: 10px 0 0 0;
                height: 3em;
                border-bottom: 1px solid #eee;

            }
            .message-record_number {
                flex-basis: 4em;
                flex-grow: 0;
            }

            .message-record_title {
                display: flex;
                flex-direction: column;
                flex-grow: 1;
                font-size: 1.2em;
            }
                .message-record_className {

                }

            .message-record_status {
                flex-basis: 6em;
                flex-grow: 0;
            }
                .message-record_status--in {    
                    color: #b13c3c;
                }
                .message-record_status--out {
                    color: #20983b;
                }
                .message-record_status .implemented {
                    font-weight: 800;
                }
                .message-record_status .not-implemented {
                    color: #bbb;
                }
                .message-record_status .not-exists {
                    visibility: hidden;
                }
            
            .message-record_restrictions {
                flex-grow: 0;
            }
        </style>
        <div class="message-records">
            ${records.map(r => `
            <div class="message-record">
                <div class="message-record_number">${genLink(r.number, r.number)}</div>
                <div class="message-record_status">
                    <span class="message-record_status--in ${r.isImplementedIn?"implemented":r.isIn?"not-implemented":"not-exists"}">IN</span>
                    <span class="message-record_status--out ${r.isImplementedOut?"implemented":r.isOut?"not-implemented":"not-exists"}">OUT</span>
                </div>
                <div class="message-record_title">
                    ${genLink(r.number, r.titleGerman)}
                    <div class="message-record_className">${r.className || ''}</div>
                </div>
                <div class="message-record_restrictions">${r.restrictions}</div>
            </div>
            `).join('')}
        </div>
        `
    }
}


var metaProvider = new MetaProvider()
var messageParser = new MessageParser(metaProvider)
var ui = new MessageUI(messageParser)