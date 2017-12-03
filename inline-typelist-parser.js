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
		l = l.trim()
		const inline = l.split('=')
		const appendix = l.split('\t')
		const line = inline.length === 2 ? inline : appendix.length === 2 ? appendix : null
		return line === null ? null : ({
			code: line[0].trim(),
			text: line[1].trim()
		})
	}

	parse(t) {
		return t.split('\n').map(l => this.parseLine(l)).filter(l => l)
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
