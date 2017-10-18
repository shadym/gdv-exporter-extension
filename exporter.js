class Parser {
	formatMultiline(htmlText) {
		const isOneTag = text => text.match(/<\//g) && text.match(/<\//g).length === 1

		var formatted = htmlText.trim()
			.replace(/"/gm, '\'')
			.replace(/<br>/gm,'\n')
			.replace(/(\n\s+)/gm,'')

		return isOneTag(formatted) ? this.formatLink(formatted) : this.quote(formatted)
	}

	formatLink(text) {
		const linkRegex = /<a href='(\w*.htm)'>(.*)<\/a>/g
		return text.replace(linkRegex, `=HYPERLINK("http://www.gdv-online.de/snetz/release2013/$1"; "$2")`)
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
			nameRequest.then(t => a[i].engName = t)
			var descriptionRequest = translator.translate(v.description)
			descriptionRequest.then(t => a[i].engDescription = t)
			translateRequests.push(nameRequest)
			translateRequests.push(descriptionRequest)
		})


		return new Promise((resolve, reject) => {
			Promise.all(translateRequests).then((values) => {
				debugger
				let lines = uniqData.map(x=>`${x.number}\t${x.name}\t${x.darst}\t${x.anzahlBytes}\t${x.byteAdr}\t${x.M}\t${x.description}\t${x.engName}\t${x.engDescription}`)
				var data = lines.join('\n')
				resolve(data)
			})
		})
	}
}

const parser = new Parser()


chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.text === 'get_record') {
    	sendResponse
    	parser.extractRecordData()
    		.then(v => {
    			sendResponse(v)
    		})
    		.then(() => {
    			console.log('GENERATED')
    		})
    }
    
    return true
});





