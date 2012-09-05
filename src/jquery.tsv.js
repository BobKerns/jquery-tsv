(function ($) {
    $.tsvEntry2Array = function tsvEntry2Array(tsv) {
        return tsv.split(/\t/g);
    };

    $.tsvArray2Entry = function tsvEntry2Array(array) {
        return array.join("\t");
    };

    $.tsv2Array = function tsvToArray(tsv) {
        var result = [];
        var lines = tsv.split(/\r?\n/g);
        for (var i = 0; i < lines.length; i++) {
            result.push($.tsvEntry2Array(lines[i]));
        }
        return result;
    };

    $.tsvArray2TSV = function tsvArray2TSV(array) {
        var rtemp = [];
        for (var i = 0; i < array.length; i++) {
            rtemp[i] = $.tsvArray2Entry(array[i]);
        }
        return rtemp.join("\n");
    };

    $.tsvArray2Dictionary = function tsvArray2Dictionary(array, columns) {
        if (! columns) {
            columns = array.shift();
        }
        var result = [];
        for (var i = 0; i < array.length; i++) {
            var row = array[i];
            var dict = {};
            for (var j = 0; j < columns.length; j++) {
                dict[columns[j]] = row[j];
            }
            result.push(dict);
        }
        return result;
    };

    $.tsv2Dictionary = function tsv2Dictionary(tsv, columns) {
        return $.tsvArray2Dictionary($.tsv2Array(tsv), columns);
    };

    $.tsvDictionary2Array = function tsvDictionary2Array(array, columns) {
        var result = [];
        for (var i = 0; i < array.length; i++) {
            var dict = array[i];
            if (! columns) {
                columns = Object.keys(dict);
            }
            var row = [];
            for (var j = 0; j < columns.length; j++) {
                row.push(dict[columns[j]]);
            }
            result.push(row);
        }
        return result;
    };

    $.tsvDictionary2TSV = function tsvDictionary2TSV(array, columns) {
        return $.tsvArray2TSV($.tsvDictionary2Array(array, columns));
    };

})(jQuery);