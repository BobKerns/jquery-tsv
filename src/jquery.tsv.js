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

    function parser(str, single, options) {
        var opts = tsvOptions(options);
        function endOfValue(value) {
            value = (value !== undefined) ? value : this.value;
            if (this.opts.parseValue) {
                value = this.opts.parseValue(value);
            }
            this.row.push(value);
            this.value = "";
        }
        function endOfRow(row) {
            row = (row !== undefined) ? row : this.row;
            this.result.push(row);
            this.row = [];
            if (this.single) {
                result = this.endOfTable();
            }
        }
        function endOfHeader(headers) {
            this.headers = (headers || this.headers);
        }
        function endOfTable(result) {
            result = (result !== undefined) ? result : this.result;
            if (! this.done) {
                this.done = true;
                if (this.finalize) {
                    return this.finalize(result);
                }
            }
            return result;
        }
        var state = {
                options: opts,
                single: single,
                state: -1, // -1 = initialize, 0 = end of value, 1 = end of row, 2 = end of table, others defined by parserKernel
                value: "",
                row: [],
                array: [],
                headers: [],
                done: false,
                error: false,
                endOfValue: endOfValue,
                endOfRow: endOfRow,
                endOfTable: endOfTable,
                endOfHeader: endOfHeader
        };
        opts.initialize.call(state, state); // Initialize
        lexer.lastIndex = 0; // Start at the beginning
        str.replace(options.lexer, function transition(m0, m1) {
            if (! state.done) {
                opts.kernel.apply(state, arguments);
            }
            if (state.error) {
                throw new Error((typeof error === "string") ? state.error : "parsing error");
            }
            return "";
        });
        return state.endOfTable();
    }

    function tsvKernel(m) {
        if (m === "\n") {
            this.endOfRow();
        } else if (m === "\r") {
            // Do nothing at all; we let the newline do the work.
        } else if (m !== "\t") {
            this.endOfValue(m);
        }
    }

    $.tsv = {
            /**
             * This version of the jQuery.tsv plugin.
             */
	version: "0.957-git",
            /**
             * The default set of options. It is not recommended to change these, as the impact will be global.
             * Instead, use a copy via $.tsv.extend(true, {}, { options: { settings } });
             * Or supply any overridden options to each call.
             */
        options: {
            /**
             * The parser kernel. It is called with the arguments that String.replace supplies on each match.
             * The matches it is called on is determined by the lexer -- a regex that identifies the sequence
             * of pieces that the parser kernel should operate on.
             *
             * The context of the kernel will be the parser state object, which provides various parts of the
             * parsing process:
             *
             * state: This is initially 0 to denote the initial state; the kernel should use this to identify
             *        the current state of scanning the line. The additional states and their interpretation
             *        are up to the kernel.
             *
             * The kernel must call this.endOfValue([value]) on each complete value.
             * If no value is supplied, the value of this.value is used.
             *
             * The kernel must call this.endOfRow([row]) on each complete row
             * If no value is supplied, the value of this.row is used. This is maintained automatically by
             * this.endOfValue()
             *
             * The kernel should call this.endOfTable([result]) if it detects the end of the table. If this
             * is not called (as will often be the case when end-of-table is marked by simply no more input
             * string) it will be called automatically as this.endOfTable(), taking the result from this.result.
             *
             * The kernel is free to maintain any stack or history it needs to perform backtracking and other
             * more advanced parser behavior. If the parser can only perform its work when the complete input has been
             * seen, it may set this.finalize to a function to be called when this.endOfTable() is called. It will
             * be called with the result-as-supplied, and should return the result-to-be-used.
             */
            kernel: tsvKernel,
            lexer: /[\t\r\n]|[^\t\r\n]+/,
            /**
             * If supplied, a function to format a value on output.
             * The returned value is used in the output instead of the supplied value.
             * If not supplied, it is simply converted to a string.
             *
             * In most cases, only the first argument, or possibly the second, are used. The row/column information
             * is supplied only for special cases where formatting needs to be aware of the position.
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
             * In most cases, only the first argument, or possibly the second, are used. The row/column information
             * is supplied only for special cases where formatting needs to be aware of the position.
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


    /**
     * Parse one value. This can be overridden in the options.
     *
     * This is not intended to be called by end users.
     * @param value the string to parse
     * @param options optional: { parseValue: <substitute function> }
     * @param colnum the column number
     * @param colname the column name, if known, or the column number as a string.
     * @param rownum the row number
     * @returns string
     */
    function parseValue(value, options, colnum, colname, rownum) {
        var opts = tsvOptions(options);
        if (opts.parseValue) {
            // We have an override; use that instead.
            return options.parseValue(value, opts, colnum, colname, rownum);
        }
        return value;
    }

    /**
     * Format one value. This can be overridden in the options.
     *
     * This is not intended to be called by end users.
     * @param value the value to format
     * @param options optional: { formatValue: <substitute function> }
     * @param colnum the column number
     * @param colname the column name, if known, or the column number as a string.
     * @param rownum the row number
     * @returns object, string or other value.
     */
    function formatValue(value, options, rownum, colnum, colname, rownum) {
        var opts = tsvOptions(options);
        if (opts.formatValue) {
            // We have an override; use that instead.
            return options.formatValue(value, opts, colnum, colname, rownum);
        }
        return String(value);
    }
    // Compatibility with initial release.
    $.tsv.parseRow = $.tsv.toArray;
    $.tsv.parseRows = $.tsv.toArrays;
    $.tsv.parseObject = $.tsv.toObject;
    $.tsv.parseObjects = $.tsv.toObjects;
    $.tsv.formatRow = $.tsv.fromArray;
    $.tsv.formatRows = $.tsv.fromArrays;
    $.tsv.formatObject = $.tsv.fromObject;
    $.tsv.formatObjects = $.tsv.fromObjects;

    if (! $.csv) {
        $.csv = $.tsv.clone({
            toArrays: function csvToArrays(csv, options) {
                var opts = tsvOptions(options);
                var state = 0;
                var value = "";
                var result = [];
                var row = [];
                function endOfCell() {
                row.push(value);
                value = "";
                state = 0;
                }
                function endOfRow() {
                row.push(value);
                result.push(row);
                row = [];
                state = 0;
                }
                s.replace(/(\"|,|\n|\r|[^\",\r\n]+)/gm,
                function (m0, m1){
                  switch (state) {
                  case 0:
                      // top level, intial state.
                      if (m1 === "\"") {
                      state = 1;
                      } else if (m1 === ",") {
                      endOfCell();
                      } else if (m1 === "\n") {
                      endOfRow();
                      } else if (/^\r$/.test(m1)) {
                      // Ignored, null transition
                      } else {
                      if (value) {
                          // We shouldn't get here
                          throw new Error("Internal error: we have a value already.");
                      }
                      value = m1;
                      state = 3;
                      }
                      break;
                  case 1:
                      // We've seen a delimiter.
                      if (m1 === "\"") {
                      // A second one, is it the end?
                      state = 2;
                      } else if ((m1 === ",") || (m1 === "\n") || (m1 === "\r")) {
                      value +=  m1;
                      state = 1;
                      } else {
                      value += m1;
                      state = 1;
                      }
                      break;
                  case 2:
                      // We've seen a delimiter while scanning a delimited string.
                      // Is it doubled?
                      if (m1 === "\"") {
                      // Quoted delimiter
                      value += m1;
                      state = 1;
                      } else if (m1 === ",") {
                      endOfCell();
                      } else if (m1 === "\n") {
                      endOfRow();
                      } else if (m1 === "\r") {
                      // ignore.
                      } else {
                      throw new Error("Illegal state");
                      }
                      break;
                  case 3:
                      // We've seen an undelimited input. We should only see separator or EOL now.
                      if (m1 === "\"") {
                      throw new Error("Unquoted delimiter in string");
                      } else if (m1 === ",") {
                      endOfCell();
                      } else if (m1 === "\n") {
                      endOfRow();
                      } else if (m1 === "\r") {
                      // Ignore
                      } else {
                      throw new Error("Two values, no separator?");
                      }
                      break;
                  default:
                      throw new Error("Unknown state");
                  }
                  return "";
                });
                if (state != 0) {
                endOfRow();
                }
            return result;

            }
        });
    }

})(jQuery);
