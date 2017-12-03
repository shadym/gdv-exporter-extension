class InlineTypelistParser {
	constructor(popup, formatter) {
		this.init()
		this.popup = popup
		this.formatter = formatter
		this.popup.init()
	}

	init() {
		const translator = new Translator()

		document.addEventListener('keydown', e => {
			if (e.key === 'T' && e.altKey && e.shiftKey) {
				let text = window.getSelection().toString()
				if (this.popup) {
					var translateRequests = []
					this.popup.open()
					var lines = this.parse(text)

					lines.forEach((v, i, a) => {
						const tp = translator.translate(v.text)
						translateRequests.push(tp)
						tp.then(t => {
							lines[i].english = t
						})
					})

					Promise.all(translateRequests).then(_ => {
						debugger
						lines.forEach(l => this.popup.addToList(l))
					})
				}
				else {
					this.copyToClipboard(this.generateTypecodes(text))
				}
			}
		})
	}

	parseLine(l) {
		let d = l.indexOf('=')
		return ({
			text: l.substr(d + 2).trim(),
			code: d === -1 ? null : d === 0 ? ' ' : l.substr(0, d - 1)
		})
	}

	parse(t) {
		return t.split('\n').map(l => this.parseLine(l)).filter(l => l.code)
	}

    generateTypecodes(t) {
		return this.parse(t).map(l => this.formatter.generateTypecode(l.text, l.code)).join('\n')
	}

	copyToClipboard(text) {
		var $temp = document.createElement('textarea');
		document.body.append($temp);
		$temp.value = text;
		$temp.select();
		document.execCommand("copy");
		$temp.remove();
	}
}

const formatter = new Formatter()
const popup = new TypecodePopup(formatter)
const typelistParser = new InlineTypelistParser(popup, formatter)
