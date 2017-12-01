class InlineTypelistParser {
	constructor() {
		this.init()
		this.initUI()
	}

	init() {
		const translator = new Translator()

		document.addEventListener('keydown', e => {
			if (e.key === 'T' && e.altKey && e.shiftKey) {
				let text = window.getSelection().toString()
				let popup = document.getElementById('exporter-container')
				if (popup) {
					var translateRequests = []
					this.openUI()
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
						lines.forEach(l => this.addToList(l))
					})
				}
				else {
					this.copyToClipboard(this.generateTypelist(text))
				}
			}
		})
	}

	/* Popup */
	initUI() {
		var container = document.createElement('div')
		container.id = "exporter-container"
		container.tabIndex = 1
		container.style.display = 'none'
		container.innerHTML = getPopupTemplate()

		container.addEventListener('keyup', e => {
			if (e.key === 'Escape') {
				this.closeUI()
			}
		})

		document.body.appendChild(container)
		
		const copyTypelist = document.querySelector('#copy-typelist')
		copyTypelist.addEventListener('click', e => {
			this.copyToClipboard(this.getLines().map(l => this.toTypecode(l.english, l.code)).join('\n'))
		})
	}

	openUI() {
		const popup = document.getElementById('exporter-container')
		const list = document.getElementById('exporter-items')
		list.innerHTML = ''
		popup.style.display = 'block'
		popup.focus()
	}

	closeUI() {
		const popup = document.getElementById('exporter-container')
		popup.style.display = 'none'		
	}

	addToList(line) {
		let el = document.createElement('div')
		el.dataset['code'] = line.code
		el.className = 'exporter-item'
		el.innerHTML = `
		<span class="exporter-item-code">${line.code}</span>
		<span class="exporter-item-german">${line.text}</span>
		<input type="text" class="exporter-item-english" value="${line.english}"/>`
		document.getElementById('exporter-items').appendChild(el)
	}

	getLines() {
		var nodes = [].slice.call(document.querySelectorAll('.exporter-item[data-code]'))
		return nodes.map(n => ({
			code: n.querySelector('.exporter-item-code').innerText,
			german: n.querySelector('.exporter-item-german').innerText,
			english: n.querySelector('.exporter-item-english').value
		}))
	}


	/* Parser */

	toTitleCase(x) {
		return x[0].toUpperCase() + x.substr(1)
	}

	toCode(v) {
		return v.toLowerCase().replace(/[^a-z\d\s]+/ig, '').replace(/\s+/g, '_')
	}

	toName(v) {
		 return v.replace(/[^a-z\d\s]+/ig, '').split(' ').filter(x => !!x).map(x => this.toTitleCase(x)).join('')
	}

	toDescription(v, n) {
		return `${this.toTitleCase(v)} (${n})`
	}

	toTypecode(v, n) {
		return `  <typecode
    code="${this.toCode(v)}"
    desc="${this.toDescription(v, n)}"
    name="${this.toName(v)}"/>`
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

	generateTypelist(t) {
		return this.parse(t).map(l => this.toTypecode(l.text, l.code)).join('\n')
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

const typelistParser = new InlineTypelistParser()


function getPopupTemplate() { return `
<style>
.exporter {
	position: fixed;
	display: flex;
	flex-direction: column;
	flex-wrap: nowrap;
	justify-content: space-between;
	top: 100;
	right: 100;
	min-width: 500px;
	min-height: 50px;
	background: #fff;
    box-shadow: 0 0 20px 0px rgba(8, 8, 8, 0.66);
    z-index: 99;
}
.exporter-name-panel {
	margin: 5px 0 0 0;
	flex-shrink: 0;
	display: flex;
	flex-wrap: nowrap;
	justify-content: center;
	align-items: baseline;
}
#name {
	flex-basis: 30px;
	border: none;
    border-bottom: 1px solid #dcdcdc;
}
.exporter-name-prefix, .exporter-name-postfix {
	color: #888;
}
#exporter-items {
	margin: 10px 0 0 0;
	flex-grow: 1;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}
.exporter-item {
	display: flex;
	flex-wrap: nowrap;
	flex-basis: 3em;
	justify-content: space-between;
	background: #eee
}
.exporter-item-code {
	order: 1;
	padding: 0 3px;
	margin: 3px 0 3px 5px;
	flex-grow: 0;
	flex-basis: 20px;
    flex-shrink: 0;
}
.exporter-item-german {
	order: 2;
    padding: 0px 3px;
    margin: 3px 0;
	border-left: 1px solid #d2d2d2;
    flex-grow: 1;
    flex-basis: 220px;
    //white-space: nowrap;
    flex-shrink: 0;
}
.exporter-item-english {
    order: 3;
    padding: 0px 3px;
    border: none;
    border-left: 1px solid #d2d2d2;
    background: #fdfdfd;
    flex-grow: 1;
    flex-basis: 200px;
    flex-shrink: 0;
}
.exporter-item-english:focus {
	outline: 1px solid #d2d2d2
}
.exporter-controls {
	flex-grow: 0;
	display: flex;
}
</style>

<div class="exporter">
	<div class="exporter-name-panel">
		<span class="exporter-name-prefix">GDV</span>
		<input id="name" type="text"></input>
		<span class="exporter-name-postfix">_Ext.tti</span>
	</div>

	<div id="exporter-items"></div>

	<div class="exporter-controls">
		<button id="copy-typelist">Copy Typelist</button>
	</div>
</div>
`
}