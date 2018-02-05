var UpperCaser = {
    MAP: {
        'ά':'α',
        'έ':'ε',
        'ό':'ο',
        'ώ':'ω',
        'ύ':'υ',
        'ϋ':'υ',
        'ΰ':'υ',
        'ί':'ι',
        'ϊ':'ι',
        'ΐ':'ι',
        'ή':'η',
        'Ά':'α',
        'Έ':'ε',
        'Ό':'ο',
        'Ώ':'ω',
        'Ύ':'υ',
        'Ί':'ι',
        'Η':'η'
    },
    toUpper: function(text) {
        if (!text) return '';
        var i, c;
        for(i=0; i<text.length; i++) {
            c = text[i];
            if (this.MAP[c]) {
                text = this.replaceAt(text, i, this.MAP[c]);
            }
        }
        return text.toUpperCase();
    },
    replaceAt: function(text, index, char) {
        return text.substr(0, index) + char + text.substr(index+char.length);
    }
};