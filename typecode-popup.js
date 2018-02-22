class TypecodePopup {

    get typelistName() {
        const name = document.getElementById('name')
        return `${name.value}_Ext`
    }

    constructor(formatter) {
        this.formatter = formatter
    }

	init() {
		var container = document.createElement('div')
		container.id = "exporter-container"
		container.tabIndex = 1
		container.style.display = 'none'
		container.innerHTML = getPopupTemplate()

		container.addEventListener('keyup', e => {
			if (e.key === 'Escape') {
				this.close()
			}
		})

		document.body.appendChild(container)
		
        const name = document.getElementById('name')

		const copyTypelist = document.querySelector('#copy-typelist')
		copyTypelist.addEventListener('click', e => {
			this.copyToClipboard(this.getLines().map(l => this.formatter.generateTypecode(l.english, l.code)).join('\n'))
		})
		
		const copyMapping = document.querySelector('#copy-mapping')
		copyMapping.addEventListener('click', e => {
			let lines = this.getLines()
				.map(l => ({
					indent: this.formatter.toCode(l.english).length + l.code.length + 44,
					line: l
				}))
				.reduce((accum, curr, index, array) => {
					accum.lines.push(curr.line)
					return {
						indent: Math.max(accum.indent, curr.indent),
						lines: accum.lines
					}
				}, {indent: 0, lines: []})
			
			let mappings = lines.lines
				.map(l => this.formatter.toMapping(l, lines.indent + 5))
				.join('\n')
			
			this.copyToClipboard(mappings)
        })
        
        const copyGermanTranslations = document.getElementById('copy-german-translations')
        copyGermanTranslations.addEventListener('click', e => {
            if (this.typelistName.length < 5) {
                name.focus()
                alert('Enter the name of typelist')
            } else {
                this.copyToClipboard(this.getLines().map(l => this.formatter.toGermanTranslation(this.typelistName, l)).join('\n'))
            }
        })

        name.addEventListener('keyup', e => {
            if (e.target.value.toLowerCase() == 'con los terroristas') {
                const harlem = new Harlem()
                harlem.shake()
            }
        })
	}

	open() {
		const popup = document.getElementById('exporter-container')
		const list = document.getElementById('exporter-items')
		list.innerHTML = ''
		popup.style.display = 'block'
		popup.focus()
	}

	close() {
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
			code: n.querySelector('.exporter-item-code').innerText || ' ',
			german: n.querySelector('.exporter-item-german').innerText.trim(),
			english: n.querySelector('.exporter-item-english').value.trim()
		}))
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
    overflow-y: auto;
    max-height: 500px;
}
.exporter-item {
	display: flex;
	flex-wrap: nowrap;
	flex-basis: 3em;
	justify-content: space-between;
    background: #eee;
    flex-shrink: 0;
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
		<span class="exporter-name-prefix"></span>
		<input id="name" type="text"></input>
		<span class="exporter-name-postfix">_Ext.tti</span>
	</div>

	<div id="exporter-items"></div>

	<div class="exporter-controls">
	<button id="copy-typelist">Copy Typecodes</button>
	<button id="copy-mapping">Copy Mappings</button>
	<button id="copy-german-translations">Copy German Translations</button>
	</div>
</div>
`
}
