class Parser {
	formatMultiline(htmlText) {
		const isOneTag = text => text.match(/^<\//g) && text.match(/<\a>&//g).length === 1

		var formatted = htmlText.trim()
			.replace(/"/gm, '\'')
			.replace(/<br>/gm,'\n')
			.replace(/(\n\s+)/gm,'')

		return isOneTag(formatted) ? this.formatLink(formatted) : this.quote(formatted)
	}

	formatLink(text) {
		const linkRegex = /<a href='(\w*.htm)'>(.*)<\/a>/g
		return text.replace(linkRegex, `=HYPERLINK("http://www.gdv-online.de/snetz/release2013/$1", "$2")`)
	}

	format(text) {
		text = text.trim()
		if (text[0] === '-') {
			text = text.substr(1)
		}
		return text.replace(/\n/gm, '');
	}

	quote(text) {
		return `"${text}"`
	}

	extractRecordData() {
		let table = document.querySelector('body > table > tbody > tr > td:nth-child(3) > table:nth-child(5)')
		let rows = Array.prototype.slice.call(table.children[0].children)

		let dataRows = rows.filter(row => row.children[0].width === "6%" && isFinite(+row.children[0].textContent))
		let data = dataRows.map(row => ({
			number: parseInt(row.children[0].textContent),
			name: this.format(row.children[1].textContent),
			darst: this.format(row.children[2].textContent),
			anzahlBytes: this.format(row.children[3].textContent),
			byteAdr: this.format(row.children[4].textContent),
			M: this.format(row.children[5].textContent),
			description: this.formatMultiline(row.children[6].innerHTML)
		}))

		let uniqData = data.reduce((acc, current, index, array) => {
			// TODO implement duplication check
			acc.push(current)
			return acc
		}, [])

		const translator = new Translator()

		var translateRequests = []
		uniqData.forEach((v, i, a) => {
			var nameRequest = translator.translate(v.name)
			nameRequest.then(t => a[i].engName = this.format(t))
			var descriptionRequest = translator.translate(v.description)
			descriptionRequest.then(t => a[i].engDescription = this.formatMultiline(t).replace(/\'/gm, ''))
			translateRequests.push(nameRequest)
			translateRequests.push(descriptionRequest)
		})
		
		return new Promise((resolve, reject) => {
			Promise.all(translateRequests).then((values) => {
				let lines = uniqData.map(x=>`${x.number}\t${x.name}\t${x.darst}\t${x.anzahlBytes}\t${x.byteAdr}\t${x.M}\t${x.description}\t${x.engName}\t${x.engDescription}`)
				var data = lines.join('\n')
				resolve(data)
			})
		})
	}
}

class Router {
	constructor() {
		this.recordPattern = /\d{4}/
		this.messagePattern = /\d{3}/
		this.messagePatternShort = /\d{2}/
		this.initUI()
	}

	initUI() {
		var div = document.createElement('div')
		div.style.position = "fixed"
		div.style.width = "120px"
		div.style.height = "30px"
		div.style.backgroundColor = "#fff"
		div.style.top = 0
		div.style.right = 0
		var input = document.createElement('input')
		input.style.height = "30px"
		input.style.fontSize = "1.3em"

		input.addEventListener('keypress', e => {
			if (e.key === "Enter") {
				let val = input.value.trim()
				var url = null
				if (this.recordPattern.test(val)) {
					url = `http://www.gdv-online.de/snetz/release2013/ds${val}.htm`
				} else if (this.messagePattern.test(val)) {
					url =`http://www.gdv-online.de/snetz/release2013/le${val}.htm`
				} else if (this.messagePatternShort.test(val)) {
					url =`http://www.gdv-online.de/snetz/release2013/le0${val}.htm`
				}

				if (url) {
					let test = this.testUrl(url)
					if (test.success) {
						document.location = url
					} else {
						this.showError(test.error)
						input.value = ""
					}
				}
			}
		})

		document.addEventListener('keypress', e => {
			if (e.keyCode === 10) {
				input.focus()
			}
		})

		div.appendChild(input)
		document.body.appendChild(div)
	}

	testUrl(url) {
		var xhr = new XMLHttpRequest();
		xhr.open('HEAD', url, false);
		xhr.send();
		if (xhr.status != 200) {
			return {
				success: false,
				error: `${xhr.status}: ${xhr.statusText}`
			}
		} else {
			return {
				success: true
			}
		}
	}

	showError(text) {
		notify("ERROR", text)	
	}
}

const parser = new Parser()
const router = new Router()


chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
	if (msg.text === 'get_record') {
		parser.extractRecordData()
			.then(v => {
				sendResponse(v)
			})
			.then(() => {
				console.log('GENERATED')
				notify("Record Generated", "GDV Record generated with translations")
			})
	}

    return true
});


function notify(title, message) {
	if (!("Notification" in window)) {
		alert(`${title}\n${message}`);
	}

	else if (Notification.permission === "granted") {
		var notification = new Notification(title, {
			body: message
		});
	}

	else if (Notification.permission !== "denied") {
		Notification.requestPermission(function (permission) {
			if (permission === "granted") {
				var notification = new Notification(title, {
					body: message
				});
			}
		});
	}
}
