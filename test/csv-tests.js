function csvTests(framework) {
    describe("CSV files", function csvTestSuite() {
        var testCSVEntry = undefined;
        var testCSV = undefined;
        var testEntryArray = undefined;
        var testArray = undefined;
        var testDictionary = undefined;
        beforeEach(function setupCSV() {
            testCSVEntry = '1","Evans & Sutherland","230-132-111AA","","Visual","PCB","","1","Offsite","';
            //console.log(testCSVEntry);

            testCSV = '';
            testCSV += 'ID,"iManufacturer","iMPartNumber","iSerialNumber","iSimCategory","iPartType","iDescription","iGroup","iLocation","iSold"\r\n';
            testCSV += '1,"Evans & Sutherland","230-132-111AA",,"Visual","PCB","","1","Offsite",\r\n';
            testCSV += '2,"Evans & Sutherland","230-132-111AA",,"Visual","PCB","","1","Offsite",\r\n';
            testCSV += '3,"Evans & Sutherland","230-120-112AC",,"Visual","PCB","","1","Offsite",\r\n';
            testCSV += '4,"Evans & Sutherland","230-120-112AC",,"Visual","PCB","","1","Offsite",\r\n';
            testCSV += '5,"Evans & Sutherland","230-120-112AC",,"Visual","PCB","","1","Offsite",\r\n';
            testCSV += '6,"Evans & Sutherland","230-120-112AC",,"Visual","PCB","","1","Offsite",\r\n';
            testCSV += '7,"Evans & Sutherland","230-120-112AC",,"Visual","PCB","","1","Offsite",\r\n';
            testCSV += '8,"Evans & Sutherland","230-120-112AC",,"Visual","PCB","","1","Offsite",\r\n';
            testCSV += '9,"Evans & Sutherland","230-120-112AC",,"Visual","PCB","","1","Offsite",\r\n';
            testCSV += '10,"Evans & Sutherland","230-121-150AC",,"Visual","PCB","","1","Offsite",';
            //console.log(testCSV);

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
        it("and parse an integer", function csvInteger() {
            expect($.csv.parseRow("1")).toEqual(["1"]);
        });
        it("and parse an integer as an integer with a parser", function csvIntegerParsed() {
            var c = 0;
            expect($.csv.parseRow("1","2", {
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
        it("and parse an integer as an integer with a parser and column names", function csvIntegerParsed() {
            var c = 0;
            var cols = ["first", "second"];
            expect($.csv.parseRow("1","2", {
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
        it("and parse an empty string", function csvStringEmpty() {
           expect($.csv.parseRow("")).toEqual([""]);
        });
        it("and parse two empty strings", function csvString2Empty() {
            expect($.csv.parseRow("","")).toEqual(["", ""]);
         });
        it("and parse a two strings", function csv2Strings() {
            expect($.csv.parseRow('Evans & Sutherland","230-132-111AA')).toEqual(["Evans & Sutherland", "230-132-111AA"]);
        });
        it("and parse a string and empty string", function csvStringAndBlankTest() {
            expect($.csv.parseRow('Evans & Sutherland","')).toEqual(["Evans & Sutherland", ""]);
        });

        it("and parse a CSV line to an array", function csvLineTest() {
            expect($.csv.parseRow(testCSVEntry)).toEqual(testEntryArray);
        });

        it("and parse a set of CSV lines to an array of line arrays", function csvArrayTest() {
            expect($.csv.parseRows(testCSV)).toEqual(testArray);
        });

        it("and parse a set of CSV lines to an array of line objects", function csvDictionaryTest() {
            expect($.csv.parseObjects(testCSV)).toEqual(testDictionary);
        });

        it("and format an integer as a value", function formatInteger() {
            expect($.csv.formatValue(1)).toBe("1");
        });

        it("and format a string as a value", function formatInteger() {
            expect($.csv.formatValue("1")).toBe("1");
        });
        it("and format true as a value", function formatInteger() {
            expect($.csv.formatValue(true)).toBe("true");
        });

        it("and format false as a value", function formatFalse() {
            expect($.csv.formatValue(false)).toBe("false");
        });

        it("and format an array as a value", function formatArrayValue() {
            expect($.csv.formatValue([1, "foo", false])).toBe("1,foo,false");
        });

        it("and format an array as a row", function formatRow() {
            expect($.csv.formatRow([1, "foo", false])).toBe("1","foo","false");
        });

        it("and convert an object to an array", function convertObjectArray() {
           expect($.csv.objectToArray({male: "Fred", female: "Ginger"}, {columns: ["female", "male"]}))
           .toEqual(["Ginger", "Fred"]);
        });

        it("and convert an array to an object", function convertArrayObject() {
            expect($.csv.arrayToObject(["Ginger", "Fred"], {columns: ["female", "male"]}))
            .toEqual({male: "Fred", female: "Ginger"});
         });

        it("and format an array of rows as csv", function formatArrays() {
            expect($.csv.formatRows([["Ginger", "Fred"], ["Cleopatra", "Antony"]], {columns: ["female", "male"]}))
            .toEqual("female","male\nGinger","Fred\nCleopatra","Antony");
        });

        it("and format an array of objects as csv", function formatArray() {
            expect($.csv.formatObjects([{female: "Ginger", male: "Fred"},
                                        {female: "Cleopatra", male: "Antony"}],
                                        {columns: ["male", "female"]}))
            .toEqual("male","female\nFred","Ginger\nAntony","Cleopatra");
        });

        it("and format an array of objects as csv with default columns", function formatArrayDefaultCols() {
            expect($.csv.formatObjects([{female: "Ginger", male: "Fred"},
                                        {female: "Cleopatra", male: "Antony"}]))
            .toEqual("female","male\nGinger","Fred\nCleopatra","Antony");
        });
    });
}
