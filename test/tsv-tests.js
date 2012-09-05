function tsvTests(framework) {
    describe("TSV files", function tsvTestSuite() {
        var testTSVEntry;
        var testTSV;
        var testEntryArray;
        var testArray;
        var testDictionary;
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
        it("and parse an integer", function() {
            expect($.tsvEntry2Array("1")).toEqual(["1"]);
        });
        it("and parse a quoted string", function() {
            expect($.tsvEntry2Array('Evans & Sutherland')).toEqual(["Evans & Sutherland"]);
        });
        it("and parse an empty string", function() {
           expect($.tsvEntry2Array("")).toEqual([""]);
        });
        it("and parse two empty strings", function() {
            expect($.tsvEntry2Array("\t")).toEqual(["", ""]);
         });
        it("and parse a two quoted strings", function tsv2Quoted() {
            expect($.tsvEntry2Array('Evans & Sutherland\t230-132-111AA')).toEqual(["Evans & Sutherland", "230-132-111AA"]);
        });
        it("and parse a two quoted strings", function tsvQuotedAndBlankTest() {
            expect($.tsvEntry2Array('Evans & Sutherland\t')).toEqual(["Evans & Sutherland", ""]);
        });
        it("and parse a blank and a quoted string", function tsvQuotedAndBlankTest() {
            expect($.tsvEntry2Array('\tVisual')).toEqual(["", "Visual"]);
        });
        it("and parse a blank and a quoted string", function tsvBlankAndQuotedTest() {
            expect($.tsvEntry2Array('Visual\t')).toEqual(["Visual", ""]);
        });
        it("and parse a TSV line to an array", function tsvLineTest() {
            expect($.tsvEntry2Array(testTSVEntry)).toEqual(testEntryArray);
        });

        it("and parse a set of TSV lines to an array of line arrays", function tsvArrayTest() {
            expect($.tsv2Array(testTSV)).toEqual(testArray);
        });

        it("and parse a set of TSV lines to an array of line dictionaries", function tsvDictionaryTest() {
            expect($.tsv2Dictionary(testTSV)).toEqual(testDictionary);
        });
    });
}