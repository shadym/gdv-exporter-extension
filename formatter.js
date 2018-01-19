class Formatter {
    toTitleCase(x) {
		return x[0].toUpperCase() + x.substr(1)
	}

	toCode(v) {
		return v.toLowerCase().replace(/[^a-z\d\s]+/ig, '').replace(/\s+/g, '_')
	}

	toName(v) {
		 return v.replace(/[^a-z\d\s]+/ig, '').split(' ').filter(x => !!x).map(x => this.toTitleCase(x)).join(' ')
	}

	toDescription(v, n) {
		return `${this.toTitleCase(v)} (${n})`
    }
    
	toMapping(line, indent) {
		indent = indent || 100
		let len = this.toCode(line.english).length + line.code.length + 44
		let spaceCount = indent - len
		return `<mapping typecode="${this.toCode(line.english)}" namespace="glp:gdv" alias="${line.code}" />${' '.repeat(spaceCount)}<!-- ${line.german} -->`
	}
    
	generateTypecode(v, n) {
		return `  <typecode
    code="${this.toCode(v)}"
    desc="${this.toDescription(v, n)}"
    name="${this.toName(v)}"/>`
	}

	generateTypelist(name, record, codes) {
		let template = `<?xml version="1.0"?>
		<typelist xmlns="http://guidewire.com/typelists" name="${name}" desc="ADD DESCRIPTION HERE">
		${codes}
		</typelist>`
	}

	toGermanTranslation(typelistName, line) {
        return `TypeKey.${typelistName}.${this.toCode(line.english)}=${line.german}
TypeKeyDescription.${typelistName}.${this.toCode(line.english)}=${line.german}`
    }

	toEnglishTranslation(typelistName, line) {
        return `TypeKey.${typelistName}.${this.toCode(line.english)}=${line.english}
TypeKeyDescription.${typelistName}.${this.toCode(line.english)}=${line.english}`
    }
}