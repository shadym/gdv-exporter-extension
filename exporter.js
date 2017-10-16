
function copyToClipboard(text) {
  var $temp = document.createElement('textarea');
  document.body.append($temp);
  $temp.value = text;
  $temp.select();
  document.execCommand("copy");
  $temp.remove();
}

function formatMultiline(htmlText) {
	const isOneTag = text => text.match(/<\//g) && text.match(/<\//g).length === 1

	var formatted = htmlText.trim()
		.replace(/"/gm, '\'')
		.replace(/<br>/gm,'\n')
		.replace(/(\n\s+)/gm,'')

	return isOneTag(formatted) ? formatLink(formatted) : quote(formatted)
}

const quote = t => `"${t}"`

function formatLink(text) {
	const linkRegex = /<a href='(\w*.htm)'>(.*)<\/a>/g
	return text.replace(linkRegex, `=HYPERLINK("http://www.gdv-online.de/snetz/release2013/$1"; "$2")`)
}

function format(text) {
	text = text.trim()
	if (text[0] === '-') {
		text = text.substr(1)
	}
	return text.replace(/\n/gm, '');
}

function extractRecordData() {
	let table = document.querySelector('body > table > tbody > tr > td:nth-child(3) > table:nth-child(5)')
	let rows = Array.prototype.slice.call(table.children[0].children)

	let dataRows = rows.filter(row => row.children[0].width === "6%" && isFinite(+row.children[0].textContent))
	let data = dataRows.map(row => ({
		number: +row.children[0].textContent,
		name: format(row.children[1].textContent),
		darst: format(row.children[2].textContent),
		anzahlBytes: format(row.children[3].textContent),
		byteAdr: format(row.children[4].textContent),
		M: format(row.children[5].textContent),
		description: formatMultiline(row.children[6].innerHTML)
	}))

	let uniqData = data.reduce((acc, current, index, array) => {
		if (!acc[current.number]) {
			//acc[current.number] = current
			acc.push(current)
		}
		return acc
	}, [])

	let lines = uniqData.map(x=>`${x.number}\t${x.name}\t${x.darst}\t${x.anzahlBytes}\t${x.byteAdr}\t${x.M}\t${x.description}`)

	return lines.join('\n')
}


// let lines = uniqData.map(x=>`<tr><td>${x.number}</td><td>${x.name}</td><td>${x.darst}</td><td>${x.anzahlBytes}</td><td>${x.byteAdr}</td><td>${x.M}</td><td>${x.description}</td></tr>`)
// copyToClipboard('<table>' + lines.join('\n') + '/<table>')

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.text === 'get_record') {
        sendResponse(extractRecordData());
    }
});