class Translator {

	translate(text) {
		var xhr = new XMLHttpRequest();
		xhr.open('POST', `https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20171017T074457Z.7bb61328a623d3e7.688014ec7ca547f5ae256771e7ee9512d2f99cc3&lang=de-en&format=plain`);
		xhr.setRequestHeader('Accept', '*/*');
		xhr.setRequestHeader("Content-Type", `application/x-www-form-urlencoded`);
		xhr.send(`text=${encodeURIComponent(text)}`)

		return new Promise((resolve, reject) => {
			xhr.onload = function (e) {
			    var res = JSON.parse(e.target.response);
			    resolve(res.text[0])
			};
		})
	}
}