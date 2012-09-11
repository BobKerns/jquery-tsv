/**
 *  @fileOverview jQuery-tsv (jQuery Plugin)
 *  @author Bob Kerns
 *  @version 0.9+
 *
 *  Inspired by jQuery-csv by Evan Plaice.
 *
 *  Copyright 2012 by Bob Kerns
 *
 *  This software is licensed as free software under the terms of the MIT License:
 *  http://www.opensource.org/licenses/mit-license.php
 */

(function ($) {
    /**
     * jQuery definition to anchor JsDoc comments.
     *
     * @see http://jquery.com/
     * @name jQuery
     * @class jQuery Library
     */
    /**
     * TSV library plugin to jQuery
     * @see http://jquery-tsv.googlecode.com/
     * @name tsv
     * @namespace tsv
     * @memberOf jQuery
     */
    $.tsv = {
            /**
             * This version of the jQuery.tsv plugin.
             * @name version
             * @constant
             * @memberOf jQuery.tsv
             */
	version: "0.957-git",
            /**
             * The default set of options. It is not recommended to change these, as the impact will be global.
             * Instead, use a copy via $.tsv.extend(true, {}, { options: { settings } });
             * Or supply any overridden options to each call.
             * @name options
             * @namespace jQuery.tsv.options
             * @memberOf jQuery.tsv
             */
        options: {
            /**
             * If supplied, a function to format a value on output.
             * The returned value is used in the output instead of the supplied value.
             * If not supplied, it is simply converted to a string.
             *
             * In most cases, only the first argument, or possibly the second, are used. The row/column information
             * is supplied only for special cases where formatting needs to be aware of the position.
             *
             * @memberOf jQuery.tsv.options
             * @function
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
             * @memberOf jQuery.tsv.options
             * @function
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
             * If supplied, a function of one argument to convert a row to an object.
             *
             * @name arrayToObject
             * @memberOf jQuery.tsv.options
             * @function
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
             * @name objectToArray
             * @memberOf jQuery.tsv.options
             * @function
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
             * @field
             * @memberOf jQuery.tsv.options
             */
            includeHeader: true,

            /**
             * If true, when reading to arrays, if you believe the input has a header line, you can have it removed.
             * If removed, it will be returned as the -1 element of the array. This will not show up in many Javascript
             * debugging environments when you print out the array, nor in the toString() method for the array, but it
             * is still accessible to code wishing to process the header array.
             *
             * Only enable this if you are sure the data has a header. If you set this, and it does not, the first row of
             * data will be removed instead.
             * @field
             * @memberOf jQuery.tsv.options
             */
            stripHeader: false,

            /**
             * The starting row number, not counting the header, if any (which is always numbered -1).
             * This can be useful for computing subranges of a table, or appending to a table.
             * @field
             * @memberOf jQuery.tsv.options
             */
            startRownum: 0,
            // An internal flag, to avoid multiple defaulting steps.
            // values are true, if it is this default, or 'copy'.
            ___defaults_applied: true,
            /**
             * The jQuery.extend operation, applied to $.tsv.options.
             *
             * You generally do not need to call this, as you can simply supply the options you wish to override
             * to the individual calls. If you are extending $.tsv, you can do so recursively to override specific
             * options.
             * @function
             * @memberOf jQuery.tsv.options
             */
            extend: $.extend,
            /**
             * A syntax consists of, at a minimum, a lexer and a parser kernel, for the parsing,
             * and a valueSeparator and rowSeparator for the standard formatting kernel.
             *
             * More complex formats may require additional features. For example, CSV will require its own
             * formatting kernel, to handle quotation.
             * @namespace
             * @memberOf jQuery.tsv.options
             */
            syntax: {
                // PARSER SIDE --- see below for formatter-side definitions.
                /**
                 * @Type {Function}
                 * @See jQuery.tsv.tsvParserKernel
                 * @memberOf jQuery.tsv.options.syntax
                 */
                parserKernel: tsvParserKernel,
                /**
                 * A regular expression that matches each syntactically-relevant piece of the input.
                 * The parser is then responsible for examining the sequence of these pieces to construct
                 * the final result.
                 * @field
                 * @Type {RegExp}
                 * @memberOf jQuery.tsv.options.syntax
                 */
                lexer: /[\t\r\n]|[^\t\r\n]+/g,

                // FORMATTER SIDE -- See above for parser-side definitions
                /**
                 * @field
                 * @Type {String}
                 * @memberOf jQuery.tsv.options.syntax
                 */
                valueSeparator: "\t",
                /**
                 * @field
                 * @Type {String}
                 * @memberOf jQuery.tsv.options.syntax
                 */
                rowSeparator: "\n",
                /**
                 * @Type {Function}
                 * @See jQuery.tsv.simpleFormatterKernel
                 * @memberOf jQuery.tsv.options.syntax
                 */
                formatterKernel: simpleFormatterKernel
            }
        },

        /**
         * $.tsv.toArray(line, options) parses one line of TSV input into an array of values.
         * @param {String} line A line with values separated by single tab characters, e.g. "11\t12\t13"
         * @param {jQuery.tsv.options} options optional: { valueSplitter: /\t/, parseValue: <a function to parse each value>}
         * @param {Number} rownum optional: the row number (defaults to 0);
         * @returns {String[]} an array of values, e.g. ["11" "12", "13"]
         * @function
         * @memberOf jQuery.tsv
         */
        toArray: function toArray(line, options, rownum) {
            var opts = tsvOptions(options);
            var result = parser(line, true, opts, rownum);
            switch (result.length) {
            case 0: return [];
            case 1: return result[0];
            default:
                throw new Error("Parser returned too many values.");
            }
        },

        /**
        * $.tsv.fromArray(row, options) returns one line of TSV input from an array of values.
        * @param {Any[][]} array an array of values, e.g. ["11" "12", "13"]
        * @param {jQuery.tsv.options} options optional: { valueSeparator: "\t", formatValue: <a function to format each value>}
        * @param {Number} rownum optional: the row number (defaults to 0);
        * @returns {String} A line with values separated by single tab characters, e.g. "11\t12\t13"
        * @function
        * @memberOf jQuery.tsv
        */
        fromArray: function fromArray(array, options, rownum) {
            var opts = tsvOptions(options);
            opts.includeHeader = (!options || options.includesHeader === undefined) ? false : options.includesHeader;
            return $.tsv.fromArrays([array], opts, rownum);
        },

        /**
         * $.tsv.toArrays(tsv, options) returns an array of arrays, one per line, each containing values from one row.
         *
         * If the stripHeader: option is set to true, the header will be stripped from the array, and re-added as element -1.
         * This does not add to the length of the array, and indexing from 0 to result.length will still access the data, but
         * not the header.
         *
         * @param {String} tsv a tab-separated-values input, e.g. "11\t\12\t13\n21\t22\t23"
         * @param {jQuery.tsv.options} options optional: { valueSplitter: /\t/, lineSplitter: /\r?\n/, parseValue: <a function to parse each value>, stripHeader: <boolean> }
         * @returns {String[][]} an array of arrays, e.g. [["11", "12", "13"], ["21", "22", "23"]]
         * @function
         * @memberOf jQuery.tsv
         */
        toArrays: function toArrays(tsv, options) {
            var opts = tsvOptions(options);
            var array = parser(tsv, false, opts);
            if (opts.stripHeader) {
                array[-1] = array.shift();
            }
            return array;
        },

        /**
         * $.tsv.fromArrays(array, options) returns a TSV string representing the array of row arrays.
         * @param {Any[][]} array an array of arrays of values. To produce valid TSV, all the arrays should be of the same length.
         * @param {jQuery.tsv.options} options optional: { valueSeparator: "\t", lineSeparator: "\n", columns: ["c1", "c2", "c3"], formatValue: <a function to format each value> }
         * @returns {String} An tsv string, e.g. "c1\tc2\tc3\n11\t\12\t13\n21\t22\t23"
         * @function
         * @memberOf jQuery.tsv
         */
        fromArrays: function fromArrays(array, options, startRownum) {
            var opts = tsvOptions(options);
            var rownum = startRownum || opts.startRownum || 0;
            var syntax = opts.syntax;
            var cols = tsvColumns(opts, array[0]);
            syntax.formatterKernel("begin");
            function doHeaderValue(value, col) {
                syntax.formatterKernel("value", value, col, tsvColumn(syntax, col), -1);
            }
            if (cols && opts.includeHeader) {
                syntax.formatterKernel("beginHeader");
                cols.forEach(doHeaderValue);
                syntax.formatterKernel("endHeader");
            }
            var header_offset = 0;
            function doRow(rowData, rowIndex) {
                if (rowData === cols) {
                    header_offset = -1;
                } else {
                    var row = rownum + rowIndex + header_offset;
                    function doValue(value, col) {
                        syntax.formatterKernel("value", value, col, tsvColumn(opts, col), row);
                    }
                    syntax.formatterKernel("beginRow");
                    rowData.forEach(doValue);
                    syntax.formatterKernel("endRow");
                }
            }
            array.forEach(doRow);
            return syntax.formatterKernel("end");
        },

        /**
         * $.tsv.arrayToObject(row, options) returns an object whose fields are named in options.columns, and
         * whose values come from the corresponding position in row (an array of values in the same order).
         *
         * If the columns are not supplied, "0", "1", etc. will be used.
         * @param {Any[]} row the values, e.g. ["v1", "v2"]
         * @param {jQuery.tsv.options} options optional: { columns: ["name1", "name2"], rowToObject: <optional conversion function to call instead> }
         * @param {Number} rownum optional: the row number
         * @returns {Object} an object derived from the elements of the row.
         * @function
         * @memberOf jQuery.tsv
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
         * @param {Any[][]} array an array of arrays of values. [ ["name1", "name2" ...],? ["val1", "val2" ...] ...]
         * @param {jQuery.tsv.options} options optional: { columns: ["name1", "name2", ...] }
         * @returns {Object[]} An array of objects, [ { name1: val1, name2: val2 ... } ... ]
         * @function
         * @memberOf jQuery.tsv
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
         * @param {String} A TSV string, e.g. "val1\tval2..." or "name1\tname2...\n\val1\val2..."
         * @param {jQuery.tsv.options} options optional: { columns ["name1", "name2" ...] }
         * @returns {Object[]} an array of objects, e.g. [ {name1: val1, name2: val2 ...} ...]
         * @function
         * @memberOf jQuery.tsv
         */
        toObjects: function toObjects(tsv, options) {
            var opts = tsvOptions(options);
            return $.tsv.arraysToObjects($.tsv.toArrays(tsv, opts), opts);
        },

        /**
         * $.tsv.objectToArray(obj, options) Convert one object to an array representation for storing as a TSV line.
         *
         * @param {Object} obj an object to convert to an array representations, e.g. { name1: "val1", name2: "val2" ... }
         * @param {jQuery.tsv.options} options optional: { columns: ["name1", "name2"], objectToArray: <a function to use instead> }
         * @param {Number} rownum optional: the row number
         * @result {Any[]} an array, e.g. ["val1", "val2"]. This will usually be an array of strings.
         * @function
         * @memberOf jQuery.tsv
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
         * @param {Object[]} array An array of objects, e.g. [ { name1: "val1", name2: "val2", ...} ...]
         * @param {jQuery.tsv.options} options { columns: ["name1", "name2"...], includeHeaders: true, objectToArray: <optional function to convert each object> }
         * @function
         * @memberOf jQuery.tsv
         */
        objectsToArrays: function objectsToArrays(array, options) {
            var opts = tsvOptions(options);
            var rownum = options.startRownum;
            var result = array.map(function convert(obj) {
                return $.tsv.objectToArray(obj, opts, rownum++);
            });
            return result;
        },

        /**
         * $.tsv.fromObject(object, options);
         * @param {Object} object the object to be converted
         * @param {jQuery.tsv.options} options [optional] arguments controlling formamtting, etc.
         * @returns {tsv String}
         * @function
         * @memberOf jQuery.tsv
         */

        fromObject: function fromObject(object, options) {
            var opts = tsvOptions(options);
            return $.tsv.fromArray($.tsv.objectToArray(object, opts), opts);
        },

        /**
         * $.tsv.fromObjects(array, options) converts an array of objects into a tsv string.
         *
         * @param {Object[]} array An array of objects, e.g. [ { name1: "val1", name2: "val2", ...} ...]
         * @param {jQuery.tsv.options} options { columns: ["name1", "name2"...], includeHeaders: true, objectToArray: <optional function to convert each object> }
         * @function
         * @memberOf jQuery.tsv
         */
        fromObjects: function fromObjects(array, options) {
            var opts = tsvOptions(options);
            var first = array.length ? array[0] : {};
            // Calculate the columns while we still have the original objects.  This is being called for side-effect!
            tsvColumns(opts, first);
            return $.tsv.fromArrays($.tsv.objectsToArrays(array, opts), opts);
        },

        /**
         * The jQuery.extend operation, applied to $.tsv.
         * @function
         * @memberOf jQuery.tsv
         */
        extend: $.extend,
        // Access to private functions for unit testing.
        test: {
            formatValue: formatValue,
            parseValue: parseValue
        }
    };


    /**
     * These are private functions but some illustrate the protocols that user-supplied overrides must follow.
     * @Namespace jQuery.tsv.internal
     */

    /**
     * <p>Parse one value. This can be overridden in the options as the {@link jQuery.tsv.options.parseValue}: field.
     * </p><p>
     * This is not intended to be called by end users. This documentation describes how the function is called by the
     * the system; the user can supply a function to be called in its place.
     * </p>
     * @param {String} value the TSV string to parse
     * @param {jQuery.tsv.options} options optional: { parseValue: <substitute function> }
     * @param {Number} colnum the column number
     * @param {String} colname the column name, if known, or the column number as a string.
     * @param {Number} rownum the row number
     * @returns {any} string
     * @memberOf jQuery.tsv.internal
     */
    function parseValue(value, options, colnum, colname, rownum) {
        var opts = tsvOptions(options);
        if (opts.parseValue) {
            // We have an override; use that instead.
            return opts.parseValue(value, opts, colnum, colname, rownum);
        }
        return value;
    }

    /**
     * <p>Format one value. This can be overridden in the options as the @{link jQuery.tsv.options.formatValue}: field.
     * </p><p>
     * This is not intended to be called by end users. This documentation describes how the function is called by the
     * the system; the user can supply a function to be called in its place.
     * </p>
     * @param {Any} value the value to format
     * @param {jQuery.tsv.options} options optional: { formatValue: <substitute function> }
     * @param {Number} colnum the column number
     * @param {String} colname the column name, if known, or the column number as a string.
     * @param {Number} rownum the row number
     * @returns {Object|String|Any} object, string or other value.
     * @memberOf jQuery.tsv.internal
     * @function
     */
    function formatValue(value, options, rownum, colnum, colname, rownum) {
        var opts = tsvOptions(options);
        if (opts.formatValue) {
            // We have an override; use that instead.
            return opts.formatValue(value, opts, colnum, colname, rownum);
        }
        return String(value);
    }

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

    function parser(str, single, options, startRow) {
        var opts = tsvOptions(options);
        var colIdx = 0;
        var rowIdx = startRow || 0;
        /**
         * This is called by a parser kernel to inform the parser of one field value seen.
         * @param {String} value the value of one field. If this argument is omitted, {@link jQuery.tsv.internal.parserState.value} will be used.
         * @memberOf jQuery.tsv.internal.parserState
         */
        function endOfValue(value) {
            value = (value !== undefined) ? value : this.value;
            value = parseValue(value, opts, colIdx, tsvColumn(opts, colIdx), rowIdx);
            this.row.push(value);
            this.value = "";
            colIdx++;
        }
        /**
         * This is called by a parser kernel to inform the parser of one row seen.
         * @param {String[]} row the row just parsed. If this argument is omitted, {@link jQuery.tsv.internal.parserState.row} will be used.
         * @memberOf jQuery.tsv.internal.parserState
         */
        function endOfRow(row) {
            row = (row !== undefined) ? row : this.row;
            this.array.push(row);
            this.row = [];
            if (this.single) {
                this.array = this.endOfTable();
            }
            rowIdx++;
            colIdx = 0;
        }
        /**
         * This is called by a parser kernel to inform the parser that the last header has been seen, and provide the list of headers.
         * @param {String[]} headers
         * @returns {undefined}
         * @memberOf jQuery.tsv.internal.parserState
         */
        function endOfHeader(headers) {
            this.headers = (headers || this.headers);
        }
        /**
         * This is called by a parser kernel to inform the parser that the end of table has been reached. No further processing will be done.
         * @param {String[][]} the final resulting table. If this argument is omitted, {@link jQuery.tsv.internal.parserState.array} will be used.
         * @returns {String[][]} the final result.
         * @memberOf jQuery.tsv.internal.parserState
         */
        function endOfTable(result) {
            result = (result !== undefined) ? result : this.array;
            if (! this.done) {
                this.done = true;
                if (opts.finalize) {
                    return opts.finalize.call(this, result);
                }
            }
            return result;
        }
        /**
         * This documents some of the parser state available to parser kernel functions, such as tsvParserKernel. The parserState will be passed
         * to the kernel as the 'this' paramter.
         * @see jQuery.tsv.internal.tsvParserKernel
         * @name parserState
         * @memberOf jQuery.tsv.internal
         * @namespace
         */
        var state = {
                /**
                 * @name options
                 * @field
                 * @type {jQuery.tsv.options} The options used to invoke this parser
                 * @memberOf jQuery.tsv.internal.parserState
                 */
                options: opts,
                /**
                 * @name single
                 * @field
                 * @type {Boolean} true if only a single row is expected.
                 * @memberOf jQuery.tsv.internal.parserState
                 */
                single: single,
                /**
                 * The parser state ID. The only system-defined value is -1, indicating initialization. After that, the parser
                 * uses this to track its state, typically dispatching to an appropriate clause in a switch statement.
                 * @name state
                 * @field
                 * @memberOf jQuery.tsv.internal.parserState
                 */
                state: -1,
                /**
                 * The value being parsed, if not yet complete.
                 * @field
                 * @memberOf jQuery.tsv.internal.parserState
                 * @type {String}
                 */
                value: "",
                /**
                 * The row parsed so far, as an array of values.
                 * @field
                 * @memberOf jQuery.tsv.internal.parserState
                 * @type {Any[]}
                 */
                row: [],
                /**
                 * The table parsed so far.
                 * @field
                 * @memberOf jQuery.tsv.internal.parserState
                 * @type {Any[][]}
                 */
                array: [],
                headers: [],
                done: false,
                error: false,
                endOfValue: endOfValue,
                endOfRow: endOfRow,
                endOfTable: endOfTable,
                endOfHeader: endOfHeader
        };
        if (opts.syntax.initializeParser) {
            opts.syntax.initializeParser.call(state, state); // Initialize
        }
        opts.syntax.lexer.lastIndex = 0; // Start at the beginning
        str.replace(opts.syntax.lexer, function transition(m0, m1) {
            if (! state.done) {
                opts.syntax.parserKernel.apply(state, arguments);
            }
            if (state.error) {
                throw new Error((typeof error === "string") ? state.error : "parsing error");
            }
            return "";
        });
        if (! state.done) {
            // Special case, that kernels must handle. If no arguments are suplied, it indicates the end of input.
            opts.syntax.parserKernel.apply(state, []);
        }
        return state.endOfTable();
    }

    /**
     * <p>
     * The parser kernel. It is called with the arguments that String.replace supplies on each match.
     * The matches it is called on is determined by the lexer -- a regex that identifies the sequence
     * of pieces that the parser kernel should operate on.
     * </p><p>
     * The context of the kernel will be the parser state object, which provides various parts of the
     * parsing process:
     *
     * </p><p>
     * state: This is initially 0 to denote the initial state; the kernel should use this to identify
     *        the current state of scanning the line. The additional states and their interpretation
     *        are up to the kernel.
     * </p><p>
     * The kernel must call this.endOfValue([value]) on each complete value.
     * If no value is supplied, the value of this.value is used.
     * </p><p>
     * The kernel must call this.endOfRow([row]) on each complete row
     * If no value is supplied, the value of this.row is used. This is maintained automatically by
     * this.endOfValue()
     * </p><p>
     * The kernel should call this.endOfTable([result]) if it detects the end of the table. If this
     * is not called (as will often be the case when end-of-table is marked by simply no more input
     * string) it will be called automatically as this.endOfTable(), taking the result from this.result.
     * </p><p>
     * The kernel is free to maintain any stack or history it needs to perform backtracking and other
     * more advanced parser behavior. If the parser can only perform its work when the complete input has been
     * seen, it may set this.finalize to a function to be called when this.endOfTable() is called. It will
     * be called with the result-as-supplied, and should return the result-to-be-used.
     * </p>
     * @function
     * @memberOf jQuery.tsv.internal
     */
    function tsvParserKernel(m) {
        switch (m) {
        case "\n":
        case undefined:
            if (! this.valueSeen) {
                this.endOfValue("");
            }
            this.endOfRow();
            this.valueSeen = false;
            break;
        case "\r":
            // Do nothing at all; we let the newline do the work.
            break;
        case "\t":
            if (! this.valueSeen) {
                this.endOfValue("");
            }
            this.valueSeen = false;
            break;
        default:
            this.endOfValue(m);
            this.valueSeen = true;
        }
    }

    /**
     * @function
     * @memberOf jQuery.tsv.internal
     * @param {String} event the formatting event
     * @param {String} param the parameter, for "value" events only.
     * @returns {undefined|String}, except for an "end" event, which returns the final string.
     */
    function simpleFormatterKernel(event, param) {
        switch (event) {
        case "begin":
            this.valueSeen = false;
            this.rowSeen = false;
            this.output = [];
            break;
        case "beginRow":
        case "beginHeader":
            if (this.rowSeen) {
                this.output.push(this.rowSeparator);
            }
            this.valueSeen = false;
            break;
        case "value":
            if (this.valueSeen) {
                this.output.push(this.valueSeparator);
            }
            this.output.push(param);
            this.valueSeen = true;
            break;
        case "endRow":
        case "endHeader":
            this.rowSeen = true;
            break;
        case "end":
            var result = this.output.join("");
            delete this.output;
            return result;
        default:
            throw new Error("Unknown formatter event: " + event);
        }

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
        $.csv = $.tsv.extend({},
          {
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
