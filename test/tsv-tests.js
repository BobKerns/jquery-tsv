function tsvTests(framework) {
    describe("TSV files", function tsvTestSuite() {
        var testTSVEntry = undefined;
        var testTSV = undefined;
        var testEntryArray = undefined;
        var testArray = undefined;
        var testDictionary = undefined;
        beforeEach(function setupTSV() {
            testTSVEntry = '1\tEvans & Sutherland\t230-132-111AA\t\tVisual\tPCB\t\t1\tOffsite\t';
            //console.log(testTSVEntry);

            testTSV = '';
            testTSV += 'ID\tiManufacturer\tiMPartNumber\tiSerialNumber\tiSimCategory\tiPartType\tiDescription\tiGroup\tiLocation\tiSold\r\n';
            testTSV += '1\tEvans & Sutherland\t230-132-111AA\t\tVisual\tPCB\t\t1\tOffsite\t\r\n';
            testTSV += '2\tEvans & Sutherland\t230-132-111AA\t\tVisual\tPCB\t\t1\tOffsite\t\r\n';
            testTSV += '3\tEvans & Sutherland\t230-120-112AC\t\tVisual\tPCB\t\t1\tOffsite\t\r\n';
            testTSV += '4\tEvans & Sutherland\t230-120-112AC\t\tVisual\tPCB\t\t1\tOffsite\t\r\n';
            testTSV += '5\tEvans & Sutherland\t230-120-112AC\t\tVisual\tPCB\t\t1\tOffsite\t\r\n';
            testTSV += '6\tEvans & Sutherland\t230-120-112AC\t\tVisual\tPCB\t\t1\tOffsite\t\r\n';
            testTSV += '7\tEvans & Sutherland\t230-120-112AC\t\tVisual\tPCB\t\t1\tOffsite\t\r\n';
            testTSV += '8\tEvans & Sutherland\t230-120-112AC\t\tVisual\tPCB\t\t1\tOffsite\t\r\n';
            testTSV += '9\tEvans & Sutherland\t230-120-112AC\t\tVisual\tPCB\t\t1\tOffsite\t\r\n';
            testTSV += '10\tEvans & Sutherland\t230-121-150AC\t\tVisual\tPCB\t\t1\tOffsite\t';
            //console.log(testTSV);

            testEntryArray = ["1", "Evans & Sutherland", "230-132-111AA", "", "Visual", "PCB", "", "1", "Offsite", ""];
            //console.log(testEntryArray);

            testArray = [];
            testArray.push(["ID", "iManufacturer", "iMPartNumber", "iSerialNumber", "iSimCategory", "iPartType", "iDescription", "iGroup", "iLocation", "iSold"]);
            testArray.push(["1", "Evans & Sutherland", "230-132-111AA", "", "Visual", "PCB", "", "1", "Offsite", ""]);
            testArray.push(["2", "Evans & Sutherland", "230-132-111AA", "", "Visual", "PCB", "", "1", "Offsite", ""]);
            testArray.push(["3", "Evans & Sutherland", "230-120-112AC", "", "Visual", "PCB", "", "1", "Offsite", ""]);
            testArray.push(["4", "Evans & Sutherland", "230-120-112AC", "", "Visual", "PCB", "", "1", "Offsite", ""]);
            testArray.push(["5", "Evans & Sutherland", "230-120-112AC", "", "Visual", "PCB", "", "1", "Offsite", ""]);
            testArray.push(["6", "Evans & Sutherland", "230-120-112AC", "", "Visual", "PCB", "", "1", "Offsite", ""]);
            testArray.push(["7", "Evans & Sutherland", "230-120-112AC", "", "Visual", "PCB", "", "1", "Offsite", ""]);
            testArray.push(["8", "Evans & Sutherland", "230-120-112AC", "", "Visual", "PCB", "", "1", "Offsite", ""]);
            testArray.push(["9", "Evans & Sutherland", "230-120-112AC", "", "Visual", "PCB", "", "1", "Offsite", ""]);
            testArray.push(["10", "Evans & Sutherland", "230-121-150AC", "", "Visual", "PCB", "", "1", "Offsite", ""]);
            //for(i in testArray) {
            //  console.log(testArray[i]);
            //}

            testDictionary = [];
            testDictionary.push({ ID:"1",   iManufacturer:"Evans & Sutherland", iMPartNumber:"230-132-111AA", iSerialNumber:"", iSimCategory:"Visual",  iPartType:"PCB",  iDescription:"",  iGroup:"1", iLocation:"Offsite",  iSold:"" });
            testDictionary.push({ ID:"2",   iManufacturer:"Evans & Sutherland", iMPartNumber:"230-132-111AA", iSerialNumber:"", iSimCategory:"Visual",  iPartType:"PCB",  iDescription:"",  iGroup:"1", iLocation:"Offsite",  iSold:"" });
            testDictionary.push({ ID:"3",   iManufacturer:"Evans & Sutherland", iMPartNumber:"230-120-112AC", iSerialNumber:"", iSimCategory:"Visual",  iPartType:"PCB",  iDescription:"",  iGroup:"1", iLocation:"Offsite",  iSold:"" });
            testDictionary.push({ ID:"4",   iManufacturer:"Evans & Sutherland", iMPartNumber:"230-120-112AC", iSerialNumber:"", iSimCategory:"Visual",  iPartType:"PCB",  iDescription:"",  iGroup:"1", iLocation:"Offsite",  iSold:"" });
            testDictionary.push({ ID:"5",   iManufacturer:"Evans & Sutherland", iMPartNumber:"230-120-112AC", iSerialNumber:"", iSimCategory:"Visual",  iPartType:"PCB",  iDescription:"",  iGroup:"1", iLocation:"Offsite",  iSold:"" });
            testDictionary.push({ ID:"6",   iManufacturer:"Evans & Sutherland", iMPartNumber:"230-120-112AC", iSerialNumber:"", iSimCategory:"Visual",  iPartType:"PCB",  iDescription:"",  iGroup:"1", iLocation:"Offsite",  iSold:"" });
            testDictionary.push({ ID:"7",   iManufacturer:"Evans & Sutherland", iMPartNumber:"230-120-112AC", iSerialNumber:"", iSimCategory:"Visual",  iPartType:"PCB",  iDescription:"",  iGroup:"1", iLocation:"Offsite",  iSold:"" });
            testDictionary.push({ ID:"8",   iManufacturer:"Evans & Sutherland", iMPartNumber:"230-120-112AC", iSerialNumber:"", iSimCategory:"Visual",  iPartType:"PCB",  iDescription:"",  iGroup:"1", iLocation:"Offsite",  iSold:"" });
            testDictionary.push({ ID:"9",   iManufacturer:"Evans & Sutherland", iMPartNumber:"230-120-112AC", iSerialNumber:"", iSimCategory:"Visual",  iPartType:"PCB",  iDescription:"",  iGroup:"1", iLocation:"Offsite",  iSold:"" });
            testDictionary.push({ ID:"10",  iManufacturer:"Evans & Sutherland", iMPartNumber:"230-121-150AC", iSerialNumber:"", iSimCategory:"Visual",  iPartType:"PCB",  iDescription:"",  iGroup:"1", iLocation:"Offsite",  iSold:"" });
            //for(i in testDictionary) {
            //  console.log(testDictionary[i]);
            //}
        });
        it("and parse an integer", function tsvInteger() {
            expect($.tsv.toArray("1")).toEqual(["1"]);
        });
        it("and parse an integer as an integer with a parser", function tsvIntegerParsed() {
            var c = 0;
            expect($.tsv.toArray("1\t2", {
                parseValue: function parseValue(val, options, colnum, colname, rownum) {
                    // Make sure we got passed the right options.
                    expect(options.parseValue).toBe(parseValue);
                    // Make sure we get passed the right column/row information.
                    expect(colnum).toBe(c++);
                    expect(colname).toBe(String(colnum));
                    expect(rownum).toBe(0);
                    return Number(val);
                }
            })).toEqual([1, 2]);
        });
        it("and parse an integer as an integer with a parser and column names", function tsvIntegerParsed() {
            var c = 0;
            var cols = ["first", "second"];
            expect($.tsv.toArray("1\t2", {
                columns: cols,
                parseValue: function parseValue(val, options, colnum, colname, rownum) {
                    // Make sure we got passed the right options.
                    expect(options.parseValue).toBe(parseValue);
                    // Make sure we get passed the right column/row information.
                    expect(colnum).toBe(c++);
                    expect(colname).toBe(cols[colnum]);
                    expect(rownum).toBe(0);
                    return Number(val);
                }
            })).toEqual([1, 2]);
        });
        it("and parse an empty string", function tsvStringEmpty() {
           expect($.tsv.toArray("")).toEqual([""]);
        });
        it("and parse two empty strings", function tsvString2Empty() {
            expect($.tsv.toArray("\t")).toEqual(["", ""]);
         });
        it("and parse a two strings", function tsv2Strings() {
            expect($.tsv.toArray('Evans & Sutherland\t230-132-111AA')).toEqual(["Evans & Sutherland", "230-132-111AA"]);
        });
        it("and parse a string and empty string", function tsvStringAndBlankTest() {
            expect($.tsv.toArray('Evans & Sutherland\t')).toEqual(["Evans & Sutherland", ""]);
        });

        it("and parse a TSV line to an array", function tsvLineTest() {
            expect($.tsv.toArray(testTSVEntry)).toEqual(testEntryArray);
        });

        it("and parse a set of TSV lines to an array of line arrays", function tsvArrayTest() {
            expect($.tsv.toArrays(testTSV)).toEqual(testArray);
        });

        it("and parse a set of TSV lines to an array of line objects", function tsvDictionaryTest() {
            expect($.tsv.toObjects(testTSV)).toEqual(testDictionary);
        });

        it("and format an integer as a value", function formatInteger() {
            expect($.tsv.formatValue(1)).toBe("1");
        });

        it("and format a string as a value", function formatInteger() {
            expect($.tsv.formatValue("1")).toBe("1");
        });
        it("and format true as a value", function formatInteger() {
            expect($.tsv.formatValue(true)).toBe("true");
        });

        it("and format false as a value", function formatFalse() {
            expect($.tsv.formatValue(false)).toBe("false");
        });

        it("and format an array as a value", function fromArrayValue() {
            expect($.tsv.formatValue([1, "foo", false])).toBe("1,foo,false");
        });

        it("and format an array as a row", function fromArray() {
            expect($.tsv.fromArray([1, "foo", false])).toBe("1\tfoo\tfalse");
        });

        it("and convert an object to an array", function convertObjectArray() {
           expect($.tsv.objectToArray({male: "Fred", female: "Ginger"}, {columns: ["female", "male"]}))
           .toEqual(["Ginger", "Fred"]);
        });

        it("and convert an array to an object", function convertArrayObject() {
            expect($.tsv.arrayToObject(["Ginger", "Fred"], {columns: ["female", "male"]}))
            .toEqual({male: "Fred", female: "Ginger"});
         });

        it("and format an array of rows as tsv", function fromArrays() {
            expect($.tsv.fromArrays([["Ginger", "Fred"], ["Cleopatra", "Antony"]], {columns: ["female", "male"]}))
            .toEqual("female\tmale\nGinger\tFred\nCleopatra\tAntony");
        });

        it("and format an array of objects as tsv", function fromArray() {
            expect($.tsv.fromObjects([{female: "Ginger", male: "Fred"},
                                        {female: "Cleopatra", male: "Antony"}],
                                        {columns: ["male", "female"]}))
            .toEqual("male\tfemale\nFred\tGinger\nAntony\tCleopatra");
        });

        it("and format an array of objects as tsv with default columns", function fromArrayDefaultCols() {
            expect($.tsv.fromObjects([{female: "Ginger", male: "Fred"},
                                        {female: "Cleopatra", male: "Antony"}]))
            .toEqual("female\tmale\nGinger\tFred\nCleopatra\tAntony");
        });
    });
}
