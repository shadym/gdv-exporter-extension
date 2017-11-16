class InlineTypelistParser {
	constructor() {
		this.init()
		//this.initUI()
	}

	init() {
		document.addEventListener('keydown', e => {
			if (e.key === 'T' && e.altKey && e.shiftKey) {
				let text = window.getSelection().toString()
				let popup = document.getElementById('exporter-container')
				if (popup) {
					popup.style.display = 'block'
					text.split('\n').map(l => this.parseLine(l)).map(l => {l.english = l.german; return l}).forEach(l => this.addToList(l))
				}
				else {
					this.copyToClipboard(this.parse(text))
				}
			}
		})
	}

	initUI() {
		var div = document.createElement('div')
		div.id = "exporter-container"
		div.innerHTML = `
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
	min-height: 150px;
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
	flex-basis: 25px;
	justify-content: space-between;
	background: #eee
}
.exporter-item-code {
	order: 1;
	padding: 0 5px;
	flex-grow: 0;
	flex-basis: 20px;
    flex-shrink: 0;
}
.exporter-item-german {
	order: 2;
	padding: 0 5px;
    flex-grow: 1;
    flex-basis: 220px;
    white-space: nowrap;
    flex-shrink: 0;
}
.exporter-item-english {
	order: 3;
	padding: 0 5px;
	flex-grow: 1;
    flex-basis: 200px;
    flex-shrink: 0;
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

		document.body.appendChild(div)
	}

	addToList(line) {
		let el = document.createElement('div')
		el.attr
		el.className = 'exporter-item'
		el.innerHTML = `
		<span class="exporter-item-code">${line.code}</span>
		<span class="exporter-item-german">${line.german}</span>
		<input type="text" class="exporter-item-english" value="${line.english}"/>`
		document.getElementById('exporter-items').appendChild(el)
	}

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
    name="${this.toName(v)}"
    priority="${+n > 0 ? +n * 10 : 9999}"/>`
	}

	parseLine(l) {
		let d = l.indexOf('=')
		return ({
			german: l.substr(d + 2).trim(),
			code: d === 0 ? ' ' : l.substr(0, d - 1)
		})
	}

	parse(t) {
		return t.split('\n').map(l => this.parseLine(l)).map(l => this.toTypecode(l.german, l.code)).join('\n')
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
