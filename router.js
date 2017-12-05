class Router {
	constructor() {
		this.recordPattern = /\d{4}/
		this.messagePattern = /^0?\d{2}$/
		this.appendixPattern = /^(1\d{2}|[17])$/
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
					url =`http://www.gdv-online.de/snetz/release2013/le0${+val}.htm`
				} else if (this.appendixPattern.test(val)) {
					url =`http://www.gdv-online.de/snetz/release2013/anl${val}.htm`
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

		div.addEventListener('keyup', e => {
		 	if (e.key  == "Escape" || e.key == "Esc") {
				input.blur()
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

const router = new Router()