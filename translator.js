class Translator {

	constructor() {
		this.comonMappings = {
			'VN': 'Insured',
			'AST': 'Assistance Service Provider',
			'WE': 'Value Unit (eg Euro, USD etc)'
		}
	}
	
	expandAbbreviations(text) {
		for (var abbr in this.comonMappings) {
			if (this.comonMappings.hasOwnProperty(abbr)) {
				text = text.replace(abbr, this.comonMappings[abbr])
			}
		}
		return text
	}

	translate(text) {
		text = this.expandAbbreviations(text)
		var xhr = new XMLHttpRequest();
		xhr.open('POST', `https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20171017T074457Z.7bb61328a623d3e7.688014ec7ca547f5ae256771e7ee9512d2f99cc3&lang=de-en&format=plain`);
		xhr.setRequestHeader('Accept', '*/*');
		xhr.setRequestHeader("Content-Type", `application/x-www-form-urlencoded`);
		xhr.send(`text=${encodeURIComponent(text)}`)

		return new Promise((resolve, reject) => {
			xhr.onload = e => {
			    var res = JSON.parse(e.target.response);
			    var translated = res.text[0];

			    resolve(translated)
			};
		})
	}
}