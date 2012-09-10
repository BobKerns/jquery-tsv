/**
 *  jQuery-tsv (jQuery Plugin)
 *
 *  Inspired by jQuery-csv by Evan Plaice.
 *
 *  Copyright 2012 by Bob Kerns
 *
 *  This software is licensed as free software under the terms of the MIT License:
 *  http://www.opensource.org/licenses/mit-license.php
 */

(function ($) {
    // Make sure we have a copy, not original, of $.tsv.options.
    function copyOptions(options) {
        return $.extend({__copy: true}, options);
    }
    // Default the options.
    function tsvOptions(options) {
        if (options) {
            if (options.__defaults_applied) {
                return options;
            }
            return $.extend(copyOptions($.tsv.options), options);
        }
        return copyOptions($.tsv.options);
    }

    function tsvColumn(options, index) {
        var opts = tsvOptions(options);
        return String(opts.columns ? opts.columns[index] : index);
    }

    function tsvColumns(options, top) {
        if (options.columns) {
            return options.columns;
        } else {
            var cols = Object.keys(top || {}).sort();
            options.columns = cols;
            return cols;
        }
    }

    $.tsv = {
	version: "0.957",
            /**
             * The default set of options. It is not recommended to change these, as the impact will be global
             */
        options: {
            /**
             * If supplied, a function to format a value on output.
             * The returned value is used in the output instead of the supplied value.
             * If not supplied, it is simply converted to a string.
             *
             * @param value the value to be formatted.
             * @param the options
             * @param colnum the column number
             * @param colname the column name, if known, or the column number as a string.
             * @param rownum the row number
             * @returns the value, formatted
             */
            formatValue: null,
            /**
             *  If supplied, a function to parse or canonicalize a value on input.
             * The returned value is used in place of the input.
             *
             * @param value the value to be formatted.
             * @param the options
             * @param colnum the column number
             * @param colname the column name, if known, or the column number as a string.
             * @param rownum the row number
             * @returns the value, parsed
             */
            parseValue: null,
            /**
             *  The character sequence to use to separate lines.
             */
            lineSeparator: "\n",
            /** A RegExp to recognize line separators */
            lineSplitter: /\r?\n/,
            /** The character sequence to use to separate values. */
            valueSeparator: "\t",
            /** A RegExp to recognize value separators. */
            valueSplitter: /\t/,
            /**
             * If supplied, a function of one argument to convert a row to an object.
             *
             * @param row an array of values, e.g. ["1", "2", "3.14"]
             * @param options { columns: ["id", "count", "price"] }
             * @returns e.g. {id: "1", count: "2", price: "3.14"}
             */
            arrayToObject: null,
            /**
             * If supplied, a function of one argument to convert an object to a row. Typically, this will implement a variant
             * of the contract for $.tsv.objectToArray.
             *
             * @param object an object to be converted to a row, e.g. {id: "1", count: "2", price: "3.14"}
             * @param options { columns: ["id", "count", "price"] }
             * @returns an array of values, e.g. ["1", "2", "3.14"]. Typically these would be ordered by options.column
             */
            objectToArray: null,
            /**
             * If true, when converting from an array of objects to a TSV string, include the column names as the
             * first line. For most purposes, you won't want to override this, but if you're working with tables in sections,
             * for example, you'd want to suppress this for the latter segments.
             *
             * But you are strongly encouraged to use column names whenever possible, especially if you work with objects.
             */
            includeHeader: true,
            /**
             * The starting row number, not counting the header, if any (which is always numbered -1).
             * This can be useful for computing subranges of a table, or appending to a table.
             */
            startRownum: 0,
            // An internal flag, to avoid multiple defaulting steps.
            // values are true, if it is this default, or 'copy'.
            ___defaults_applied: true,
            extend: $.extend
        },

        /**
         * Parse one value. This can be overridden in the options.
         * @param value the string to parse
         * @param options optional: { parseValue: <substitute function> }
         * @param colnum the column number
         * @param colname the column name, if known, or the column number as a string.
         * @param rownum the row number
         * @returns the string
         */
        parseValue: function parseValue(value, options, colnum, colname, rownum) {
            var opts = tsvOptions(options);
            if (opts.parseValue) {
                // We have an override; use that instead.
                return options.parseValue(value, opts, colnum, colname, rownum);
            }
            return value;
        },

        /**
         * Format one value. This can be overridden in the options.
         * @param value the value to format
         * @param options optional: { formatValue: <substitute function> }
         * @param colnum the column number
         * @param colname the column name, if known, or the column number as a string.
         * @param rownum the row number
         */
        formatValue: function formatValue(value, options, rownum, colnum, colname, rownum) {
            var opts = tsvOptions(options);
            if (opts.formatValue) {
                // We have an override; use that instead.
                return options.formatValue(value, opts, colnum, colname, rownum);
            }
            return String(value);
        },

        /**
         * $.tsv.toArray(line, options) parses one line of TSV input into an array of values.
         * @param line A line with values separated by single tab characters, e.g. "11\t12\t13"
         * @param options optional: { valueSplitter: /\t/, parseValue: <a function to parse each value>}
         * @param rownum optional: the row number (defaults to 0);
         * @returns an array of values, e.g. ["11" "12", "13"]
         */
        toArray: function toArray(line, options, rownum) {
            var opts = tsvOptions(options);
            var valueSplitter = opts.valueSplitter;
            rownum = rownum || 0;
            var colnum = 0;
            function doValue(val) {
                var c = colnum++;
                return $.tsv.parseValue(val, opts, c, tsvColumn(opts, c), rownum);
            }
            return line.split(valueSplitter).map(doValue);
        },

        /**
        * $.tsv.fromArray(row, options) returns one line of TSV input from an array of values.
        * @param array an array of values, e.g. ["11" "12", "13"]
        * @param options optional: { valueSeparator: "\t", formatValue: <a function to format each value>}
        * @param rownum optional: the row number (defaults to 0);
        * @returns A line with values separated by single tab characters, e.g. "11\t12\t13"
        */
        fromArray: function fromArray(array, options, rownum) {
            var opts = tsvOptions(options);
            var valueSeparator = opts.valueSeparator;
            var colnum = 0;
            function doValue(val) {
                var c = colnum++;
                return $.tsv.formatValue(val, opts, c, tsvColumn(c), rownum);
            }
            return array.map(doValue).join(valueSeparator);
        },

        /**
         * $.tsv.toArrays(tsv, options) returns an array of arrays, one per line, each containing values from one row.
         * @param tsv a tab-separated-values input, e.g. "11\t\12\t13\n21\t22\t23"
         * @param options optional: { valueSplitter: /\t/, lineSplitter: /\r?\n/, parseValue: <a function to parse each value> }
         * @returns an array of arrays, e.g. [["11", "12", "13"], ["21", "22", "23"]]
         */
        toArrays: function toArrays(tsv, options) {
            var opts = tsvOptions(options);
            var lines = tsv.split(opts.lineSplitter);
            var rownum = opts.startRownum || 0;
            return lines.map(function doLine(line) {
                return $.tsv.toArray(line, opts, rownum++);
            });
        },

        /**
         * $.tsv.fromArrays(array, options) returns a TSV string representing the array of row arrays.
         * @param array an array of arrays of values. To produce valid TSV, all the arrays should be of the same length.
         * @param options optional: { valueSeparator: "\t", lineSeparator: "\n", columns: ["c1", "c2", "c3"], formatValue: <a function to format each value> }
         * @returns An tsv string, e.g. "c1\tc2\tc3\n11\t\12\t13\n21\t22\t23"
         */
        fromArrays: function fromArrays(array, options) {
            var opts = tsvOptions(options);
            var first = array.length ? array[0] : [];
            var cols = tsvColumns(opts, first);
            var rownum = opts.startRownum || 0;
            var header = opts.includeHeader ? $.tsv.fromArray(cols, opts, -1) : undefined;
            function doRow(row) {
                return $.tsv.fromArray(row, opts, rownum++);
            }
            var rtemp = array.map(doRow);
            if (header) {
                rtemp.unshift(header);
            }
            return rtemp.join(opts.lineSeparator);
        },

        /**
         * $.tsv.arrayToObject(row, options) returns an object whose fields are named in options.columns, and
         * whose values come from the corresponding position in row (an array of values in the same order).
         *
         * If the columns are not supplied, "0", "1", etc. will be used.
         * @param row the values, e.g. ["v1", "v2"]
         * @param options optional: { columns: ["name1", "name2"], rowToObject: <optional conversion function to call instead> }
         * @param rownum optional: the row number
         * @returns an object derived from the elements of the row.
         */
        arrayToObject: function arrayToObject(row, options, rownum) {
            var opts = tsvOptions(options);
            rownum = rownum || 0;
            var columns = tsvColumns(opts, row);
            if (opts.arrayToObject) {
                // We have an override; use that instead.
                return opts.arrayToObject(row, opts, rownum);
            }
            var dict = {};
            for (var j = 0; j < columns.length; j++) {
                dict[columns[j]] = row[j];
            }
            return dict;
        },

        /**
         * $.tsv.arraysToObjects(array, options) returns an array of objects, derived from the array.
         * The array must either have the first row be column names, or columns: ["name1", "name2", ...] must be supplied
         * in the options.
         * @param array an array of arrays of values. [ ["name1", "name2" ...],? ["val1", "val2" ...] ...]
         * @param options optional: { columns: ["name1", "name2", ...] }
         * @returns An array of objects, [ { name1: val1, name2: val2 ... } ... ]
         */
        arraysToObjects: function arraysToObjects(array, options) {
            var opts = tsvOptions(options);
            if (! opts.columns) {
                opts.columns = array.shift();
            }
            var rownum = opts.startRownum || 0;
            return array.map(function convert(row) {
                return $.tsv.arrayToObject(row, opts, rownum++);
            });
        },

        /**
         * $.tsv.toObjects(tsv, options) returns an array of objects from a tsv string.
         * The string must either have the first row be column names, or columns: ["name1", "name2", ...] must be supplied
         * in the options.
         *
         * @param A TSV string, e.g. "val1\tval2..." or "name1\tname2...\n\val1\val2..."
         * @param options optional: { columns ["name1", "name2" ...] }
         * @returns an array of objects, e.g. [ {name1: val1, name2: val2 ...} ...]
         */
        toObjects: function toObjects(tsv, options) {
            var opts = tsvOptions(options);
            return $.tsv.arraysToObjects($.tsv.toArrays(tsv, opts), opts);
        },

        /**
         * $.tsv.objectToArray(obj, options) Convert one object to an array representation for storing as a TSV line.
         *
         * @param obj an object to convert to an array representations, e.g. { name1: "val1", name2: "val2" ... }
         * @param options optional: { columns: ["name1", "name2"], objectToArray: <a function to use instead> }
         * @param rownum optional: the row number
         * @result an array, e.g. ["val1", "val2"]
         */
        objectToArray: function objectToArray(obj, options, rownum) {
            var opts = tsvOptions(options);
            var columns = tsvColumns(opts, obj);
            rownum = rownum || 0;
            if (opts.objectToArray) {
                // We have an override; use that instead.
                return opts.objectToArray(obj, opts, rownum);
            }
            var row = [];
            for (var j = 0; j < columns.length; j++) {
                row.push(obj[columns[j]]);
            }
            return row;
        },

        /**
         * $.tsv.objectsToArrays(array, options) converts an array of objects into an array of row arrays.
         *
         * @param array An array of objects, e.g. [ { name1: "val1", name2: "val2", ...} ...]
         * @param options { columns: ["name1", "name2"...], includeHeaders: true, objectToArray: <optional function to convert each object> }
         */
        objectsToArrays: function objectsToArrays(array, options) {
            var opts = tsvOptions(options);
            var rownum = options.startRownum;
            var result = array.map(function convert(obj) {
                return $.tsv.objectToArray(obj, opts, rownum++);
            });
            return result;
        },

        fromObject: function fromObject(array, options) {
            var opts = tsvOptions(options);
            return $.tsv.fromArray($.tsv.objectToArray(array, opts), opts);
        },

        /**
         * $.tsv.fromObjects(array, options) converts an array of objects into a tsv string.
         *
         * @param array An array of objects, e.g. [ { name1: "val1", name2: "val2", ...} ...]
         * @param options { columns: ["name1", "name2"...], includeHeaders: true, objectToArray: <optional function to convert each object> }
         */
        fromObjects: function fromObjects(array, options) {
            var opts = tsvOptions(options);
            var first = array.length ? array[0] : {};
            // Calculate the columns while we still have the original objects.  This is being called for side-effect!
            tsvColumns(opts, first);
            return $.tsv.fromArrays($.tsv.objectsToArrays(array, opts), opts);
        },

        extend: $.extend
    };
    // Compatibility with initial release.
    $.tsv.parseRow = $.tsv.toArray;
    $.tsv.parseRows = $.tsv.toArrays;
    $.tsv.parseObject = $.tsv.toObject;
    $.tsv.parseObjects = $.tsv.toObjects;
    $.tsv.formatValue = $.tsv.formatValue;
    $.tsv.formatRow = $.tsv.fromArray;
    $.tsv.formatRows = $.tsv.fromArrays;
    $.tsv.formatObject = $.tsv.fromObject;
    $.tsv.formatObjects = $.tsv.fromObjects;

})(jQuery);
