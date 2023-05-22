//=======================================================================//
// Function Getting Carrier Fields & Appending Fields to Carrier Select //
async function getCarrierFields() {
    var fields = (
        await ZOHO.CRM.META.getFields({ "Entity": "Member_Data_Consolidated" })
    ).fields;
    fields.forEach((field) => {
        if (field.api_name == "Carrier") {
            CarrierOptions = field.pick_list_values;
        }
    })
    for (var i = 0; i < CarrierOptions.length; i++) {
        $(".carrier_select").append(
            new Option(CarrierOptions[i].display_value, CarrierOptions[i].actual_value)
        );
    }
    let carrierArray = []
    for (var i = 0; i < CarrierOptions.length; i++) {
        // Skip '-None-' Value
        if (CarrierOptions[i].actual_value == '-None-') {
            continue;
        }
        // Else Append Carrier Options
        else {
            let value = CarrierOptions[i].display_value
            let ID = value.replaceAll(/\s/g, '_')
            $(".grid-container").append(`<div class="grid-item" id="${ID}"><div class="Carrier_Text">${value}</div></div>`)
        }
        // Push Carriers into to Carrier Array
        carrierArray.push(CarrierOptions[i].actual_value)
    }
    return carrierArray
}

//====================================================//
// Function Getting Member Data Consolidated Records //
async function getMemberDataConsolidatedRecords() {
    // Response Variable
    var response;
    // Start on Page 1 
    var Page = 1;
    // Account Data Array
    var Member_Data_Consolidated = [];
    // Do the following...
    do {
        // Try
        try {
            // Getting Records
            var response = await ZOHO.CRM.API.getAllRecords({ Entity: "Member_Data_Consolidated", per_page: 200, page: Page })
            // Add 1 to Page Value
            Page += 1
            // Push Values into Account Data Array
            response.data.forEach(obj => { Member_Data_Consolidated.push(obj) })
            // Catch Errors
        } catch (e) {
            // Return error status
            response = JSON.stringify(e)
            return response;
        }
        // While More Records is True
    } while (response.info.more_records) {
        // Response = Member_Data_Consolidated
        response = Member_Data_Consolidated
        // Return Response
        return response;
    }
}


// //===================================//
// // Function Getting Carrier Reports //
// async function getCarrierReports() {
//     // Response Variable
//     var response;
//     // Start on Page 1 
//     var Page = 1;
//     // Account Data Array
//     var Carrier_Reports = [];
//     // Do the following...
//     do {
//         // Try
//         try {
//             // Getting Records
//             var response = await ZOHO.CRM.API.getAllRecords({ Entity: "Carrier_Reports", per_page: 200, page: Page })
//             // Add 1 to Page Value
//             Page += 1
//             // Push Values into Carrier_Reports Array
//             response.data.forEach(obj => { Carrier_Reports.push(obj) })
//             // Catch Errors
//         } catch (e) {
//             // Return error status
//             response = JSON.stringify(e)
//             return response;
//         }
//         // While More Records is True
//     } while (response.info.more_records) {
//         // Response = Carrier_Reports
//         response = Carrier_Reports
//         // Return Response
//         return response;
//     }
// }

async function createMemberConsolidatedObject(memberDataConsolidatedResponse) {
    //=================================================//
    // Loop Through Member Data Consolidated Response //
    //===============================================//
    // Declare Object to Push Data into // 
    let memberConsolidatedObject = {
        "Data": []
    }
    for (let i = 0; i < memberDataConsolidatedResponse.length; i++) {
        // Carrier //
        let carrier = memberDataConsolidatedResponse[i].Carrier
        // Report Name //
        let reportName = memberDataConsolidatedResponse[i].Name
        // Account Name //
        let accountName = memberDataConsolidatedResponse[i].Account.name
        // Account Name //
        let accountID = memberDataConsolidatedResponse[i].Account.id
        // Report Date //
        let reportDate = memberDataConsolidatedResponse[i].Report_Date
        // Get Month of Report from Report Date //
        let reportMonth = reportDate.split("-")[1]
        // Get Year of Report from Report Date //
        let reportYear = reportDate.split("-")[0]
        // Report Type //
        let reportType = memberDataConsolidatedResponse[i].Report_Type
        // Year to Date Direct Written Premium //
        let YTD_DWP = memberDataConsolidatedResponse[i].YTD_DWP
        // Year to Date New Business Direct Written Premium //
        let YTD_NB_DWP = memberDataConsolidatedResponse[i].YTD_NB_DWP
        // Prior Year to Date Direct Written Premium //
        let Prior_YTD_DWP = memberDataConsolidatedResponse[i].Prior_YTD_DWP
        // Rolling 12 Direct Written Premium //
        let DWP_12MM = memberDataConsolidatedResponse[i].DWP_12MM
        // New Business Direct Written Premium Rolling 12 //
        let NB_DWP_12MM = memberDataConsolidatedResponse[i].NB_DWP_12MM
        // Prior Rolling 12 Direct Written Premium // 
        let Prior_12MM_DWP = memberDataConsolidatedResponse[i].Prior_12MM_DWP
        // Incurred Loss Year to Date //
        let Incurred_Loss_YTD = memberDataConsolidatedResponse[i].Incurred_Loss_YTD
        // Incurred Loss Rolling 12 //
        let Incurred_Loss_12MM = memberDataConsolidatedResponse[i].Incurred_Loss_12MM
        // Year to Date Policies in Force
        let YTD_PIF = memberDataConsolidatedResponse[i].YTD_PIF
        // Year to Date New Business Policies in Force 
        let YTD_NB_PIF = memberDataConsolidatedResponse[i].YTD_NB_PIF
        // Rolling 12 Policies in Force //
        let PIF_12MM = memberDataConsolidatedResponse[i].PIF_12MM
        // New Business Rolling 12 Policies in Force //
        let PIF_NB_12MM = memberDataConsolidatedResponse[i].PIF_NB_12MM
        // Year to Date Quotes //
        let YTD_Quotes = memberDataConsolidatedResponse[i].YTD_Quotes
        // Most Recent Bool //
        let Most_Recent = memberDataConsolidatedResponse[i].Most_Recent

        // Change Months from Numeric value to Text Value //s
        if (reportMonth == 01) {
            reportMonth = "January"
        }
        else if (reportMonth == 02) {
            reportMonth = "February"
        }
        else if (reportMonth == 03) {
            reportMonth = "March"
        }
        else if (reportMonth == 04) {
            reportMonth = "April"
        }
        else if (reportMonth == 05) {
            reportMonth = "May"
        }
        else if (reportMonth == 06) {
            reportMonth = "June"
        }
        else if (reportMonth == 07) {
            reportMonth = "July"
        }
        else if (reportMonth == 08) {
            reportMonth = "August"
        }
        else if (reportMonth == 09) {
            reportMonth = "September"
        }
        else if (reportMonth == 10) {
            reportMonth = "October"
        }
        else if (reportMonth == 11) {
            reportMonth = "November"
        }
        else if (reportMonth == 12) {
            reportMonth = "December"
        }
        // Store Values in Data_Object
        let dataObjects = {
            "Account_Name": accountName,
            "Account_ID": accountID,
            "Report_Name": reportName,
            "Most_Recent": Most_Recent,
            "Carrier": carrier,
            "Report_Month": reportMonth,
            "Report_Year": reportYear,
            "Report_Type": reportType,
            "YTD_DWP": YTD_DWP,
            "YTD_NB_DWP": YTD_NB_DWP,
            "DWP_12MM": DWP_12MM,
            "NB_DWP_12MM": NB_DWP_12MM,
            "Prior_YTD_DWP": Prior_YTD_DWP,
            "Prior_12MM_DWP": Prior_12MM_DWP,
            "Incurred_Loss_YTD": Incurred_Loss_YTD,
            "Incurred_Loss_12MM": Incurred_Loss_12MM,
            "YTD_PIF": YTD_PIF,
            "YTD_NB_PIF": YTD_NB_PIF,
            "PIF_12MM": PIF_12MM,
            "PIF_NB_12MM": PIF_NB_12MM,
            "YTD_Quotes": YTD_Quotes
        }
        // Push Object Containing Information into the memberConsolidatedObject //
        memberConsolidatedObject["Data"].push(dataObjects)
    }//==========================================//
    // End of Member Consolidated Response Loop //
    //=========================================//
    return memberConsolidatedObject
}

//==================================//
// Get Sums of Data For Each Month //
async function aggregate(group, array) {
    groupedObject = {
        "Years": [],
        "Months": [],
        "YTD_DWP": [],
        "YTD_NB_DWP": [],
        "DWP_12MM": [],
        "NB_DWP_12MM": [],
        "YTD_PIF": [],
        "YTD_NB_PIF": [],
        "PIF_12MM": [],
        "PIF_NB_12MM": [],
        "Incurred_Loss_YTD": [],
        "Incurred_Loss_12MM": [],
        "GroupByCarrier": [],
        "GroupByYear": [],
        "GroupByMonth": []
    }
    array.forEach(element => {
        // console.log(element)
        let Report = group[element]
        let GroupbyCarrier = _.groupBy(Report, "Carrier")
        groupedObject["GroupByCarrier"].push(GroupbyCarrier)
        let GroupbyYear = _.groupBy(Report, "Report_Year")
        groupedObject["GroupByYear"].push(GroupbyYear)
        let GroupbyMonth = _.groupBy(Report, "Report_Month")
        groupedObject["GroupByMonth"].push(GroupbyMonth)
        let YtdDwpArray = _.map(Report, "YTD_DWP")
        let sumOfYtdDwpArray = YtdDwpArray.reduce((a, b) => a + b, 0)
        groupedObject["YTD_DWP"].push(sumOfYtdDwpArray)
        let YtdNbDwpArray = _.map(Report, "YTD_NB_DWP")
        let sumOfYtdNbDwpArray = YtdNbDwpArray.reduce((a, b) => a + b, 0)
        groupedObject["YTD_NB_DWP"].push(sumOfYtdNbDwpArray)
        let Dwp12mmArray = _.map(Report, "DWP_12MM")
        let sumOfDwp12mmArray = Dwp12mmArray.reduce((a, b) => a + b, 0)
        groupedObject["DWP_12MM"].push(sumOfDwp12mmArray)
        let NbDwp12mmArray = _.map(Report, "NB_DWP_12MM")
        let sumOfNbDwp12mmArray = NbDwp12mmArray.reduce((a, b) => a + b, 0)
        groupedObject["NB_DWP_12MM"].push(sumOfNbDwp12mmArray)
        let YtdPifArray = _.map(Report, "YTD_PIF")
        let sumOfYtdPifArray = YtdPifArray.reduce((a, b) => a + b, 0)
        groupedObject["YTD_PIF"].push(sumOfYtdPifArray)
        let YtdNbPifArray = _.map(Report, "YTD_NB_PIF")
        let sumOfYtdNbPifArray = YtdNbPifArray.reduce((a, b) => a + b, 0)
        groupedObject["YTD_NB_PIF"].push(sumOfYtdNbPifArray)
        let Pif12mmArray = _.map(Report, "PIF_12MM")
        let sumOfPif12mmArray = Pif12mmArray.reduce((a, b) => a + b, 0)
        groupedObject["PIF_12MM"].push(sumOfPif12mmArray)
        let PifNb12mmArray = _.map(Report, "PIF_NB_12MM")
        let sumOfPifNb12mmArray = PifNb12mmArray.reduce((a, b) => a + b, 0)
        groupedObject["PIF_NB_12MM"].push(sumOfPifNb12mmArray)
        let IncurredLossYtdArray = _.map(Report, "Incurred_Loss_YTD")
        let sumOfIncurredLossYtdArray = IncurredLossYtdArray.reduce((a, b) => a + b, 0)
        groupedObject["Incurred_Loss_YTD"].push(sumOfIncurredLossYtdArray)
        let IncurredLoss12mmArray = _.map(Report, "Incurred_Loss_12MM")
        let sumOfIncurredLoss12mmArray = IncurredLoss12mmArray.reduce((a, b) => a + b, 0)
        groupedObject["Incurred_Loss_12MM"].push(sumOfIncurredLoss12mmArray)
        let isStringNumeric0 = element.includes('0')
        let isStringNumeric1 = element.includes('1')
        let isStringNumeric2 = element.includes('2')
        if (isStringNumeric0 == true || isStringNumeric1 == true || isStringNumeric2 == true) {
            groupedObject["Years"].push(element)
        }
        else {
            groupedObject["Months"].push(element)
        }
    });
    return groupedObject
}

async function getAndAppendAgencies(globalObject) {
    accountIDs = _.map(globalObject, 'Account_ID')
    accountNames = _.map(globalObject, 'Account_Name');

    const obj = {};
    accountIDs.forEach((element, index) => {
        obj[element] = accountNames[index];
    });
    uniqueAccountIDsArray = Object.keys(obj)
    uniqueAccountNamesArray = Object.values(obj)
    if (uniqueAccountIDsArray.length >= 2) {
        uniqueAccountNamesArray.sort()
        uniqueAccountNamesArray.splice(0, 0, 'All Agencies');
        for (var i = 0; i < uniqueAccountNamesArray.length; i++) {
            $(".agency_select").append(
                new Option(uniqueAccountNamesArray[i])
            );
        }
    }
    else {
        uniqueAccountNamesArray.splice(0, 0, 'All Agencies');
        $(".input-container-5").hide()
    }
    return uniqueAccountNamesArray
}


async function getAndAppendYears(objectData) {
    let years = []
    for (let i = 0; i < objectData.length; i++) {
        const element = objectData[i];
        let year = element.Report_Year
        years.push(year)
    }
    // Filter Years Array to only Unique Values
    const uniqueYearsArray = years.filter(unique)
    // Sort
    uniqueYearsArray.sort((a, b) => b - a)
    if (uniqueYearsArray.length >= 2) {
        // Loop through the Unique Years Array and append values as options to the year select
        for (var i = 0; i < uniqueYearsArray.length; i++) {
            $(".year_select").append(
                new Option(uniqueYearsArray[i])
            );
        }
    }
    else {
        $(".input-container-3").hide()
    }
    uniqueYearsArray.sort((a, b) => a - b)
    return uniqueYearsArray
}

async function getMostRecentData() {
    // let key = "ZdHcdG9w7B7yrGzBVlG168C8zIDRCDpq5hfzfh1Z"
    // Universal Object //
    let Object_to_Send = JSON.stringify({
        "key":"value"
    })
    var settings = {
        "url": "https://88jnym1z33.execute-api.us-east-1.amazonaws.com/default/AC-Member-Portal-Most-Recent",
        "method": "post",
        "data": Object_to_Send
    }
    let resp = await $.ajax(settings)
    return resp
}

async function getMostRecentAppendReportMonths(gridItems, object) {

    let mostRecentDataObject = {
        "Data": []
    }
    for (let i = 0; i < object.length; i++) {
        let Carrier = object[i].Carrier
        let Report_Name = object[i].Name

        // Report Date //
        let reportDate = object[i].Report_Date
        // Get Month of Report from Report Date //
        let reportMonth = reportDate.split("-")[1]
        // Get Year of Report from Report Date //
        let reportYear = reportDate.split("-")[0]
        
        if (reportMonth == 01) {
            reportMonth = "January"
        }
        else if (reportMonth == 02) {
            reportMonth = "February"
        }
        else if (reportMonth == 03) {
            reportMonth = "March"
        }
        else if (reportMonth == 04) {
            reportMonth = "April"
        }
        else if (reportMonth == 05) {
            reportMonth = "May"
        }
        else if (reportMonth == 06) {
            reportMonth = "June"
        }
        else if (reportMonth == 07) {
            reportMonth = "July"
        }
        else if (reportMonth == 08) {
            reportMonth = "August"
        }
        else if (reportMonth == 09) {
            reportMonth = "September"
        }
        else if (reportMonth == 10) {
            reportMonth = "October"
        }
        else if (reportMonth == 11) {
            reportMonth = "November"
        }
        else if (reportMonth == 12) {
            reportMonth = "December"
        }
        let data = {
            "Report_Name": Report_Name,
            "Carrier": Carrier,
            "Report_Month": reportMonth
        }
        mostRecentDataObject["Data"].push(data)
    }
    let array = mostRecentDataObject["Data"]
    for (let i = 0; i < gridItems.length; i++) {
        let id = gridItems[i].id
        for (let i = 0; i < array.length; i++) {
            if (array[i].Carrier == undefined || array[i].Carrier == null) {
                notification("warning", `Agency Report Missing Carrier`)
                break;
            }
            let Carrier = array[i].Carrier.replaceAll(/\s/g, '_');
            if (id == Carrier) {
                $(`#${id}`).append(`<div class="Month" id="${array[i].Report_Month}">${array[i].Report_Month}</div>`)
            }
            else {
                continue;
            }
        }
    }
}

async function noReportMonth(gridItems) {
    for (let i = 0; i < gridItems.length; i++) {
        let id = gridItems[i].id
        let childElementCount = gridItems[i].childElementCount
        if (childElementCount == 1) {
            $(`#${id}`).append(`<div class="Month" id="No_Report">No Most Recent Report Month</div>`)
        }
        while (gridItems[i].childElementCount > 2) {
            gridItems[i].removeChild(gridItems[i].lastChild);
        }
    }
}

//========================================//
// Abstract Function for Updating Charts //
// (chart html collection, array of labels for data, title for the chart, the data that will be used, title of x axis, title of y axis)
async function abstractChangeChart(chartCollection, chartTitle, data, dataLabelArray, xAxisTitle, yAxisTitle, callbackFunction) {
    // If the type of data is Object
    if (typeof (data) == "object") {
        data = data
    }
    // Else turn type of data to object
    else {
        data = [data]
    }
    // If data object is not null we will check if all the values in the array are null or if all the values in the array are 0
    if (data != null) {
        isArrayNull = await allAreNull(data)
        isArrayZero = await allAreZero(data)
    }
    else {
        data = "none";
        // Notification
        notification("warning", "No Match")
        if ($("#YTD_Tab").hasClass('active') == true) {
            $("#YTD").hide()
        }
        if ($("#R12_Tab").hasClass('active') == true) {
            $("#R12").hide()
        }
    }
    if (isArrayNull == true || isArrayZero == true || data == "none") {
        for (let i = 0; i < chartCollection.length; i++) {
            chartInLoopThroughCollection = $(chartCollection[i])
            parentElementClassName = chartInLoopThroughCollection[0].canvas.parentElement.className
            // Hide Parent Element of Chart
            $(`.${parentElementClassName}`).hide()
        }
    }
    else {
        for (let i = 0; i < chartCollection.length; i++) {
            chartInLoopThroughCollection = $(chartCollection[i])
            parentElementClassName = chartInLoopThroughCollection[0].canvas.parentElement.className
            // Show Parent Element of Chart
            $(`.${parentElementClassName}`).show()
        }
    }
    // Preparing Data Below //
    let obj = {};
    for (var i = 0; i < dataLabelArray.length; i++) {
        // if it doesn't exist assign value 0 to it, otherwise use existing value
        obj[dataLabelArray[i]] = obj[dataLabelArray[i]] || 0;
        // then add the new value
        obj[dataLabelArray[i]] += data[i];
    }
    values = Object.values(obj)
    keys = Object.keys(obj)
    let object = {
        "Keys": keys,
        "Values": values
    }
    dataLabelArray = object["Keys"]
    data = object["Values"]
    // Loop through Chart Collection  for initial Update //
    for (let i = 0; i < chartCollection.length; i++) {
        chartCollection[i].data.datasets.forEach((dataset) => {
            dataset.data = []
        });
        chartCollection[i].options.plugins.title.text = chartTitle
        chartCollection[i].options.scales.x.title.text = xAxisTitle
        chartCollection[i].options.scales.y.title.text = yAxisTitle
        chartCollection[i].options.scales.y.ticks.callback = callbackFunction
        chartCollection[i].update();
    }
    for (let i = 0; i < chartCollection.length; i++) {
        chartCollection[i].data.labels = dataLabelArray
        chartCollection[i].data.datasets.forEach((dataset) => {
            dataset.data = data
        });
        chartCollection[i].update();
    }
    // If YTD Tab is Active
    if ($("#YTD_Tab").hasClass('active') == true) {
        let visibleTabContent = $("#YTD")
        await warningModalFunction(visibleTabContent)
    }
    // If R12 Tab is Active
    if ($("#R12_Tab").hasClass('active') == true) {
        visibleTabContent = $("#R12:visible")
        await warningModalFunction(visibleTabContent)
    }
}
//==============================================================//
// Function for Sorting Arrays within a Multidimensional Array //
async function dynamicSort(property) {
    var sortOrder = 1;
    if (property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a, b) {
        if (sortOrder == -1) {
            return b[property].localeCompare(a[property]);
        } else {
            return a[property].localeCompare(b[property]);
        }
    }
}
//================================//
// Get Selected Carrier Function //
async function getSelectedCarrier() {
    var selected_carrier = $(".carrier_select").find(":selected").text()
    return selected_carrier
}
//==============================//
// Get Selected Month Function //
async function getSelectedMonth() {
    var selected_month = $(".month_select").find(":selected").text()
    return selected_month
}
//=============================//
// Get Selected Data Function //
async function getSelectedData() {
    var selected_data = $(".type_of_data_select").find(":selected").text()
    return selected_data
}

//=============================//
// Get Selected Year Function //
async function getSelectedYear(yearsArray) {
    if (yearsArray.length >= 2) {
        selected_year = $(".year_select").find(":selected").text()
    }
    else {
        selected_year = "All Years"
    }
    return selected_year
}

//===============================//
// Get Selected Agency Function //
async function getSelectedAgency(agencyArray) {
    if (agencyArray.length >= 3) {
        selected_agency = $(".agency_select").find(":selected").text()
    }
    else {
        selected_agency = "All Agencies"
    }
    return selected_agency
}

//=========================================//
// Checks if all values in Array are null //
async function allAreNull(arr) {
    return arr.every(element => element == null);
}
//======================================//
// Checks if all values in Array are 0 //
async function allAreZero(arr) {
    return arr.every(element => element == 0);
}
async function allAreFalse(arr) {
    return arr.every(element => element === false);
}
const unique = (value, index, self) => {
    return self.indexOf(value) === index
}
var currencyCallbackFunction = function (value, index, ticks) {
    return "$" + Chart.Ticks.formatters.numeric.apply(this, [value, index, ticks]);
}
var numericCallbackFunction = function (value, index, ticks) {
    return Chart.Ticks.formatters.numeric.apply(this, [value, index, ticks]);
}
var notification = (type, message) => {
    $(".warning-modal").attr("class", "warning-modal flexed f-ac f-jc animate__animated");
    switch (type) {
        case "warning":
            $(".warning-modal").attr("id", 'Warning_Modal');
            $(".warning-modal").addClass("animate__fadeInRight");
            $(".warning-modal-message").text(message);
            $(".warning-modal").animate({ right: 50, opacity: "show" }, 600);
            $(".warning-modal").css("background-color", "rgba(241, 179, 8, 0.79)")
            break;
    }
};

async function warningModalFunction(visibleTabContent) {
    let visibleTabContentChildren = visibleTabContent[0].children
    let array = []
    for (let i = 0; i < visibleTabContentChildren.length; i++) {
        className = visibleTabContentChildren[i].className
        let isVisibleBool = $(`.${className}`).is(":visible")
        array.push(isVisibleBool)
    }
    // Check if all Values are false
    let arrayBool = await allAreFalse(array)
    // If all Values in array are false
    if (arrayBool == true) {
        // Notification
        notification("warning", "No Match")
        return;
    }
    // If all Values in Array not False
    else if (arrayBool == false) {
        // Check visibility of Warning Modal
        let warningModalBool = $(".warning-modal").is(":visible")
        if (warningModalBool == false) {
            $(".warning-modal").hide(.05)
        }
    }
}

async function organize(Month_Array, otherArray) {
    const monthNames = {
        "January": 1,
        "February": 2,
        "March": 3,
        "April": 4,
        "May": 5,
        "June": 6,
        "July": 7,
        "August": 8,
        "September": 9,
        "October": 10,
        "November": 11,
        "December": 12
    };
    let obj = {};
    for (var i = 0; i < Month_Array.length; i++) {
        // if it doesn't exist assign value 0 to it, otherwise use existing value
        obj[Month_Array[i]] = obj[Month_Array[i]] || 0;
        // then add the new value
        obj[Month_Array[i]] += otherArray[i];
    }
    if (obj["January"] == undefined) {
        obj["January"] = 0
    }
    if (obj["February"] == undefined) {
        obj["February"] = 0
    }
    if (obj["March"] == undefined) {
        obj["March"] = 0
    }
    if (obj["April"] == undefined) {
        obj["April"] = 0
    }
    if (obj["May"] == undefined) {
        obj["May"] = 0
    }
    if (obj["June"] == undefined) {
        obj["June"] = 0
    }
    if (obj["July"] == undefined) {
        obj["July"] = 0
    }
    if (obj["August"] == undefined) {
        obj["August"] = 0
    }
    if (obj["September"] == undefined) {
        obj["September"] = 0
    }
    if (obj["October"] == undefined) {
        obj["October"] = 0
    }
    if (obj["November"] == undefined) {
        obj["November"] = 0
    }
    if (obj["December"] == undefined) {
        obj["December"] = 0
    }
    // Object to Array of Key Value Pairs
    const arr = Array.from(Object.keys(obj), k => [`${k}`, obj[k]]);
    // Sort the Data array
    arr.sort(function (a, b) {
        // sort based on the value in the monthNames object
        return monthNames[a[0]] - monthNames[b[0]];
    });
    let months = []
    let values = []
    arr.forEach(element => {
        months.push(element[0])
        values.push(element[1])
    })
    let returnObject = {
        "Months": months,
        "Values": values
    }
    return returnObject
}

async function generalFunction(DWP_YTD_Bar_Chart_Collection, NB_YTD_Bar_Chart_Collection, NB_R12_Bar_Chart_Collection, DWP_R12_Bar_Chart_Collection, reportObject, monthArray, selected_data, selected_carrier, selected_year, selected_month, selected_agency, currencyCallbackFunction, numericCallbackFunction) {
    // If the Selected Month Report is not null
    if (reportObject == null || reportObject == undefined) {
        if ($("#YTD_Tab").hasClass('active') == true) {
            $("#YTD").hide()
            notification("warning", "No Match")
        }
        if ($("#R12_Tab").hasClass('active') == true) {
            $("#R12").hide()
            notification("warning", "No Match")
        }
        return;
    }
    //=======================================================//
    // All Carriers & All Months & All Years & All Agencies //
    //=====================================================//
    if (selected_carrier == 'All Carriers' && selected_month == 'All Months' && selected_year == 'All Years' && selected_agency == "All Agencies") {
        let All_Carriers_YTD_DWP_Array = reportObject["YTD_DWP"]
        let All_Carriers_YTD_NB_DWP_Array = reportObject["YTD_NB_DWP"]
        let All_Carriers_DWP_12MM_Array = reportObject["DWP_12MM"]
        let All_Carriers_NB_DWP_12MM_Array = reportObject["NB_DWP_12MM"]
        let All_Carriers_YTD_PIF_Array = reportObject["YTD_PIF"]
        let All_Carriers_YTD_NB_PIF_Array = reportObject["YTD_NB_PIF"]
        let All_Carriers_PIF_12MM_Array = reportObject["PIF_12MM"]
        let All_Carriers_PIF_NB_12MM_Array = reportObject["PIF_NB_12MM"]
        let All_Carriers_Incurred_Loss_YTD_Array = reportObject["Incurred_Loss_YTD"]
        let All_Carriers_Incurred_Loss_12MM_Array = reportObject["Incurred_Loss_12MM"]
        let xLabel = 'Month'
        switch (selected_data) {
            case "Direct Written Premium":
                var yLabel = 'Direct Written Premium'
                //===================================================//
                // Reset Year to Date Direct Written Premium Charts //
                chartTitle = `Year to Date Direct Written Premium (${selected_carrier})`
                await abstractChangeChart(DWP_YTD_Bar_Chart_Collection, chartTitle, All_Carriers_YTD_DWP_Array, monthArray, xLabel, yLabel, currencyCallbackFunction)
                //====================================================================//
                // Reset Year to Date New Business Direct Written Premium Bar Charts //
                chartTitle = `Year to Date New Business Direct Written Premium (${selected_carrier})`
                await abstractChangeChart(NB_YTD_Bar_Chart_Collection, chartTitle, All_Carriers_YTD_NB_DWP_Array, monthArray, xLabel, yLabel, currencyCallbackFunction)
                //==============================================================//
                // Reset Rolling 12 New Business Direct Written Premium Charts //
                chartTitle = `Rolling 12 Month New Business Direct Written Premium (${selected_carrier})`
                await abstractChangeChart(NB_R12_Bar_Chart_Collection, chartTitle, All_Carriers_NB_DWP_12MM_Array, monthArray, xLabel, yLabel, currencyCallbackFunction)
                //=====================================================//
                // Reset Rolling 12 Direct Written Premium Bar Charts //
                chartTitle = `Rolling 12 Month Direct Written Premium (${selected_carrier})`
                await abstractChangeChart(DWP_R12_Bar_Chart_Collection, chartTitle, All_Carriers_DWP_12MM_Array, monthArray, xLabel, yLabel, currencyCallbackFunction)
                break;
            case "Policies In Force":
                var yLabel = 'Policies In Force'
                //==============================================//
                // Reset Year to Date Policies In Force Charts //
                chartTitle = `Year to Date Policies In Force (${selected_carrier})`
                await abstractChangeChart(DWP_YTD_Bar_Chart_Collection, chartTitle, All_Carriers_YTD_PIF_Array, monthArray, xLabel, yLabel, numericCallbackFunction)
                //===========================================================//
                // Reset Year to Date New Business Policies In Force Charts //
                chartTitle = `Year to Date New Business Policies In Force (${selected_carrier})`
                await abstractChangeChart(NB_YTD_Bar_Chart_Collection, chartTitle, All_Carriers_YTD_NB_PIF_Array, monthArray, xLabel, yLabel, numericCallbackFunction)
                //=========================================================//
                // Reset Rolling 12 New Business Policies In Force Charts //
                chartTitle = `Rolling 12 Month New Business Policies In Force (${selected_carrier})`
                await abstractChangeChart(NB_R12_Bar_Chart_Collection, chartTitle, All_Carriers_PIF_NB_12MM_Array, monthArray, xLabel, yLabel, numericCallbackFunction)
                //=====================================================//
                // Reset Rolling 12 Direct Written Premium Bar Charts //
                chartTitle = `Rolling 12 Month Policies In Force (${selected_carrier})`
                await abstractChangeChart(DWP_R12_Bar_Chart_Collection, chartTitle, All_Carriers_PIF_12MM_Array, monthArray, xLabel, yLabel, numericCallbackFunction)
                break;
            case "Incurred Loss":
                var yLabel = 'Incurred Loss'
                //===========================================================//
                // Reset Year to Date New Business Policies In Force Charts //
                chartTitle = `Year to Date New Business Incurred Loss (${selected_carrier})`
                await abstractChangeChart(NB_YTD_Bar_Chart_Collection, chartTitle, All_Carriers_Incurred_Loss_YTD_Array, monthArray, xLabel, yLabel, currencyCallbackFunction)
                //=========================================================//
                // Reset Rolling 12 New Business Policies In Force Charts //
                chartTitle = `Rolling 12 Month New Business Incurred Loss (${selected_carrier})`
                await abstractChangeChart(NB_R12_Bar_Chart_Collection, chartTitle, All_Carriers_Incurred_Loss_12MM_Array, monthArray, xLabel, yLabel, currencyCallbackFunction)
                $(".DWP_YTD").hide()
                $(".DWP_R12").hide()
                break;
        }
    }
    if ((selected_carrier != 'All Carriers' && selected_month != 'All Months' && selected_year != 'All Years' && selected_agency == "All Agencies") ||
        (selected_carrier != 'All Carriers' && selected_month != 'All Months' && selected_year != 'All Years' && selected_agency != "All Agencies") ||
        (selected_carrier != 'All Carriers' && selected_month != 'All Months' && selected_year == 'All Years' && selected_agency == "All Agencies") ||
        (selected_carrier != 'All Carriers' && selected_month != 'All Months' && selected_year == 'All Years' && selected_agency != "All Agencies") ||
        (selected_carrier != 'All Carriers' && selected_month == 'All Months' && selected_year != 'All Years' && selected_agency == "All Agencies")) {
        let YTD_DWP = _.map(reportObject, 'YTD_DWP');
        let YTD_DWP_Array = YTD_DWP.reduce((a, b) => a + b, 0)
        let YTD_NB_DWP = _.map(reportObject, 'YTD_NB_DWP');
        let YTD_NB_DWP_Array = YTD_NB_DWP.reduce((a, b) => a + b, 0)
        let DWP_12MM = _.map(reportObject, "DWP_12MM");
        let DWP_12MM_Array = DWP_12MM.reduce((a, b) => a + b, 0)
        let NB_DWP_12MM = _.map(reportObject, "NB_DWP_12MM")
        let NB_DWP_12MM_Array = NB_DWP_12MM.reduce((a, b) => a + b, 0)
        let YTD_PIF = _.map(reportObject, 'YTD_PIF')
        let YTD_PIF_Array = YTD_PIF.reduce((a, b) => a + b, 0)
        let YTD_NB_PIF = _.map(reportObject, 'YTD_NB_PIF')
        let YTD_NB_PIF_Array = YTD_NB_PIF.reduce((a, b) => a + b, 0)
        let PIF_12MM = _.map(reportObject, 'PIF_12MM')
        let PIF_12MM_Array = PIF_12MM.reduce((a, b) => a + b, 0)
        let PIF_NB_12MM = _.map(reportObject, 'PIF_NB_12MM')
        let PIF_NB_12MM_Array = PIF_NB_12MM.reduce((a, b) => a + b, 0)
        let Incurred_Loss_YTD = _.map(reportObject, 'Incurred_Loss_YTD')
        let Incurred_Loss_YTD_Array = Incurred_Loss_YTD.reduce((a, b) => a + b, 0)
        let Incurred_Loss_12MM = _.map(reportObject, 'Incurred_Loss_12MM')
        let Incurred_Loss_12MM_Array = Incurred_Loss_12MM.reduce((a, b) => a + b, 0)
        let month = reportObject[0].Report_Month
        let monthArray = Array(month)
        let xLabel = reportObject[0].Carrier
        switch (selected_data) {
            case "Direct Written Premium":
                var yLabel = 'Direct Written Premium'
                //===================================================//
                // Reset Year to Date Direct Written Premium Charts //
                chartTitle = `Year to Date Direct Written Premium (${selected_carrier})`
                await abstractChangeChart(DWP_YTD_Bar_Chart_Collection, chartTitle, YTD_DWP_Array, monthArray, xLabel, yLabel, currencyCallbackFunction)
                //====================================================================//
                // Reset Year to Date New Business Direct Written Premium Bar Charts //
                chartTitle = `Year to Date New Business Direct Written Premium (${selected_carrier})`
                await abstractChangeChart(NB_YTD_Bar_Chart_Collection, chartTitle, YTD_NB_DWP_Array, monthArray, xLabel, yLabel, currencyCallbackFunction)
                //==============================================================//
                // Reset Rolling 12 New Business Direct Written Premium Charts //
                chartTitle = `Rolling 12 Month New Business Direct Written Premium (${selected_carrier})`
                await abstractChangeChart(NB_R12_Bar_Chart_Collection, chartTitle, DWP_12MM_Array, monthArray, xLabel, yLabel, currencyCallbackFunction)
                //=====================================================//
                // Reset Rolling 12 Direct Written Premium Bar Charts //
                chartTitle = `Rolling 12 Month Direct Written Premium (${selected_carrier})`
                await abstractChangeChart(DWP_R12_Bar_Chart_Collection, chartTitle, NB_DWP_12MM_Array, monthArray, xLabel, yLabel, currencyCallbackFunction)
                break;
            case "Policies In Force":
                var yLabel = 'Policies In Force'
                //==============================================//
                // Reset Year to Date Policies In Force Charts //
                chartTitle = `Year to Date Policies In Force (${selected_carrier})`
                await abstractChangeChart(DWP_YTD_Bar_Chart_Collection, chartTitle, YTD_PIF_Array, monthArray, xLabel, yLabel, numericCallbackFunction)
                //===========================================================//
                // Reset Year to Date New Business Policies In Force Charts //
                chartTitle = `Year to Date New Business Policies In Force (${selected_carrier})`
                await abstractChangeChart(NB_YTD_Bar_Chart_Collection, chartTitle, YTD_NB_PIF_Array, monthArray, xLabel, yLabel, numericCallbackFunction)
                //=========================================================//
                // Reset Rolling 12 New Business Policies In Force Charts //
                chartTitle = `Rolling 12 Month New Business Policies In Force (${selected_carrier})`
                await abstractChangeChart(NB_R12_Bar_Chart_Collection, chartTitle, PIF_12MM_Array, monthArray, xLabel, yLabel, numericCallbackFunction)
                //=====================================================//
                // Reset Rolling 12 Direct Written Premium Bar Charts //
                chartTitle = `Rolling 12 Month Policies In Force (${selected_carrier})`
                await abstractChangeChart(DWP_R12_Bar_Chart_Collection, chartTitle, PIF_NB_12MM_Array, monthArray, xLabel, yLabel, numericCallbackFunction)
                break;
            case "Incurred Loss":
                var yLabel = 'Incurred Loss'
                //===========================================================//
                // Reset Year to Date New Business Policies In Force Charts //
                chartTitle = `Year to Date New Business Incurred Loss (${selected_carrier})`
                await abstractChangeChart(NB_YTD_Bar_Chart_Collection, chartTitle, Incurred_Loss_YTD_Array, monthArray, xLabel, yLabel, currencyCallbackFunction)
                //=========================================================//
                // Reset Rolling 12 New Business Policies In Force Charts //
                chartTitle = `Rolling 12 Month New Business Incurred Loss (${selected_carrier})`
                await abstractChangeChart(NB_R12_Bar_Chart_Collection, chartTitle, Incurred_Loss_12MM_Array, monthArray, xLabel, yLabel, currencyCallbackFunction)
                $(".DWP_YTD").hide()
                $(".DWP_R12").hide()
                break;
        }
    }
    //=====================================================//
    // All Carriers & All Months & All Years & One Agency //
    //===================================================//
    if ((selected_carrier == 'All Carriers' && selected_month == 'All Months' && selected_year == 'All Years' && selected_agency != "All Agencies") ||
        (selected_carrier == 'All Carriers' && selected_month == 'All Months' && selected_year != 'All Years' && selected_agency == "All Agencies") ||
        (selected_carrier == 'All Carriers' && selected_month == 'All Months' && selected_year != 'All Years' && selected_agency != "All Agencies") ||
        (selected_carrier != 'All Carriers' && selected_month == 'All Months' && selected_year == 'All Years' && selected_agency != "All Agencies") ||
        (selected_carrier != 'All Carriers' && selected_month == 'All Months' && selected_year != 'All Years' && selected_agency != "All Agencies") ||
        (selected_carrier != 'All Carriers' && selected_month == 'All Months' && selected_year == 'All Years' && selected_agency == "All Agencies")) {
        reportObject.sort(await dynamicSort("Carrier"));
        Carrier_Array = _.map(reportObject, 'Carrier');
        Month_Array = _.map(reportObject, "Report_Month");
        YTD_DWP_Array = _.map(reportObject, 'YTD_DWP');
        YTD_NB_DWP_Array = _.map(reportObject, 'YTD_NB_DWP');
        DWP_12MM_Array = _.map(reportObject, "DWP_12MM");
        NB_DWP_12MM_Array = _.map(reportObject, "NB_DWP_12MM");
        YTD_PIF_Array = _.map(reportObject, 'YTD_PIF')
        YTD_NB_PIF_Array = _.map(reportObject, 'YTD_NB_PIF')
        PIF_12MM_Array = _.map(reportObject, 'PIF_12MM')
        PIF_NB_12MM_Array = _.map(reportObject, 'PIF_NB_12MM')
        Incurred_Loss_YTD = _.map(reportObject, 'Incurred_Loss_YTD')
        Incurred_Loss_12MM = _.map(reportObject, 'Incurred_Loss_12MM')
        let YTD_DWP_Object = await organize(Month_Array, YTD_DWP_Array)
        YTD_DWP_Array = YTD_DWP_Object["Values"]
        YTD_DWP_Months_Array = YTD_DWP_Object["Months"]
        let YTD_NB_DWP_Object = await organize(Month_Array, YTD_NB_DWP_Array)
        YTD_NB_DWP_Array = YTD_NB_DWP_Object["Values"]
        YTD_NB_DWP_Months_Array = YTD_NB_DWP_Object["Months"]
        let DWP_12MM_Object = await organize(Month_Array, DWP_12MM_Array)
        DWP_12MM_Array = DWP_12MM_Object["Values"]
        DWP_12MM_Months_Array = DWP_12MM_Object["Months"]
        let NB_DWP_12MM_Object = await organize(Month_Array, NB_DWP_12MM_Array)
        NB_DWP_12MM_Array = NB_DWP_12MM_Object["Values"]
        NB_DWP_12MM_Months_Array = NB_DWP_12MM_Object["Months"]
        let YTD_PIF_Object = await organize(Month_Array, YTD_PIF_Array)
        YTD_PIF_Array = YTD_PIF_Object["Values"]
        YTD_PIF_Months_Array = YTD_PIF_Object["Months"]
        let YTD_NB_PIF_Object = await organize(Month_Array, YTD_NB_PIF_Array)
        YTD_NB_PIF_Array = YTD_NB_PIF_Object["Values"]
        YTD_NB_PIF_Months_Array = YTD_NB_PIF_Object["Months"]
        let PIF_12MM_Object = await organize(Month_Array, PIF_12MM_Array)
        PIF_12MM_Array = PIF_12MM_Object["Values"]
        PIF_12MM_Months_Array = PIF_12MM_Object["Months"]
        let PIF_NB_12MM_Object = await organize(Month_Array, PIF_NB_12MM_Array)
        PIF_NB_12MM_Array = PIF_NB_12MM_Object["Values"]
        PIF_NB_12MM_Months_Array = PIF_NB_12MM_Object["Months"]
        let Incurred_Loss_YTD_Object = await organize(Month_Array, Incurred_Loss_YTD)
        Incurred_Loss_YTD = Incurred_Loss_YTD_Object["Values"]
        Incurred_Loss_YTD_Months = Incurred_Loss_YTD_Object["Months"]
        let Incurred_Loss_12MM_Object = await organize(Month_Array, Incurred_Loss_12MM)
        Incurred_Loss_12MM = Incurred_Loss_12MM_Object["Values"]
        Incurred_Loss_12MM_Months = Incurred_Loss_12MM_Object["Months"]
        let xLabel = 'Month'
        switch (selected_data) {
            case "Direct Written Premium":
                var yLabel = 'Direct Written Premium'
                //===================================================//
                // Reset Year to Date Direct Written Premium Charts //
                chartTitle = `Year to Date Direct Written Premium (${selected_carrier})`
                await abstractChangeChart(DWP_YTD_Bar_Chart_Collection, chartTitle, YTD_DWP_Array, YTD_DWP_Months_Array, xLabel, yLabel, currencyCallbackFunction)
                //====================================================================//
                // Reset Year to Date New Business Direct Written Premium Bar Charts //
                chartTitle = `Year to Date New Business Direct Written Premium (${selected_carrier})`
                await abstractChangeChart(NB_YTD_Bar_Chart_Collection, chartTitle, YTD_NB_DWP_Array, YTD_NB_DWP_Months_Array, xLabel, yLabel, currencyCallbackFunction)
                //==============================================================//
                // Reset Rolling 12 New Business Direct Written Premium Charts //
                chartTitle = `Rolling 12 Month New Business Direct Written Premium (${selected_carrier})`
                await abstractChangeChart(NB_R12_Bar_Chart_Collection, chartTitle, NB_DWP_12MM_Array, NB_DWP_12MM_Months_Array, xLabel, yLabel, currencyCallbackFunction)
                //=====================================================//
                // Reset Rolling 12 Direct Written Premium Bar Charts //
                chartTitle = `Rolling 12 Month Direct Written Premium (${selected_carrier})`
                await abstractChangeChart(DWP_R12_Bar_Chart_Collection, chartTitle, DWP_12MM_Array, DWP_12MM_Months_Array, xLabel, yLabel, currencyCallbackFunction)
                break;
            case "Policies In Force":
                var yLabel = 'Policies In Force'
                //==============================================//
                // Reset Year to Date Policies In Force Charts //
                chartTitle = `Year to Date Policies In Force (${selected_carrier})`
                await abstractChangeChart(DWP_YTD_Bar_Chart_Collection, chartTitle, YTD_PIF_Array, YTD_PIF_Months_Array, xLabel, yLabel, numericCallbackFunction)
                //===========================================================//
                // Reset Year to Date New Business Policies In Force Charts //
                chartTitle = `Year to Date New Business Policies In Force (${selected_carrier})`
                await abstractChangeChart(NB_YTD_Bar_Chart_Collection, chartTitle, YTD_NB_PIF_Array, YTD_NB_PIF_Months_Array, xLabel, yLabel, numericCallbackFunction)
                //=========================================================//
                // Reset Rolling 12 New Business Policies In Force Charts //
                chartTitle = `Rolling 12 Month New Business Policies In Force (${selected_carrier})`
                await abstractChangeChart(NB_R12_Bar_Chart_Collection, chartTitle, PIF_NB_12MM_Array, PIF_NB_12MM_Months_Array, xLabel, yLabel, numericCallbackFunction)
                //=====================================================//
                // Reset Rolling 12 Direct Written Premium Bar Charts //
                chartTitle = `Rolling 12 Month Policies In Force (${selected_carrier})`
                await abstractChangeChart(DWP_R12_Bar_Chart_Collection, chartTitle, PIF_12MM_Array, PIF_12MM_Months_Array, xLabel, yLabel, numericCallbackFunction)
                break;
            case "Incurred Loss":
                var yLabel = 'Incurred Loss'
                //===========================================================//
                // Reset Year to Date New Business Policies In Force Charts //
                chartTitle = `Year to Date New Business Incurred Loss (${selected_carrier})`
                await abstractChangeChart(NB_YTD_Bar_Chart_Collection, chartTitle, Incurred_Loss_YTD_Array, Month_Array, xLabel, yLabel, currencyCallbackFunction)
                //=========================================================//
                // Reset Rolling 12 New Business Policies In Force Charts //
                chartTitle = `Rolling 12 Month New Business Incurred Loss (${selected_carrier})`
                await abstractChangeChart(NB_R12_Bar_Chart_Collection, chartTitle, Incurred_Loss_12MM_Array, Month_Array, xLabel, yLabel, currencyCallbackFunction)
                $(".DWP_YTD").hide()
                $(".DWP_R12").hide()
                break;
        }
    }
    //======================================================//
    // All Carriers & One Month & All Years & All Agencies //
    //====================================================//
    if ((selected_carrier == 'All Carriers' && selected_month != 'All Months' && selected_year == 'All Years' && selected_agency == "All Agencies") ||
        (selected_carrier == 'All Carriers' && selected_month != 'All Months' && selected_year != 'All Years' && selected_agency == "All Agencies") ||
        (selected_carrier == 'All Carriers' && selected_month != 'All Months' && selected_year != 'All Years' && selected_agency != "All Agencies") ||
        (selected_carrier == 'All Carriers' && selected_month != 'All Months' && selected_year == 'All Years' && selected_agency != "All Agencies")) {
        try {
            reportObject.sort(await dynamicSort("Carrier"));
        } catch (e) {
            console.log(e)
            notification("warning", "Error: Contact Admin")
            return;
        }
        let Carrier_Array = _.map(reportObject, 'Carrier');
        let YTD_DWP_Array = _.map(reportObject, 'YTD_DWP');
        let YTD_NB_DWP_Array = _.map(reportObject, 'YTD_NB_DWP');
        let DWP_12MM_Array = _.map(reportObject, "DWP_12MM");
        let NB_DWP_12MM_Array = _.map(reportObject, "NB_DWP_12MM")
        let YTD_PIF_Array = _.map(reportObject, 'YTD_PIF')
        let YTD_NB_PIF_Array = _.map(reportObject, 'YTD_NB_PIF')
        let PIF_12MM_Array = _.map(reportObject, 'PIF_12MM')
        let PIF_NB_12MM_Array = _.map(reportObject, 'PIF_NB_12MM')
        let Incurred_Loss_YTD = _.map(reportObject, 'Incurred_Loss_YTD')
        let Incurred_Loss_12MM = _.map(reportObject, 'Incurred_Loss_12MM')
        let xLabel = 'Carrier'
        switch (selected_data) {
            case "Direct Written Premium":
                var yLabel = 'Direct Written Premium'
                //===================================================//
                // Reset Year to Date Direct Written Premium Charts //
                chartTitle = `Year to Date Direct Written Premium (${selected_carrier})`
                await abstractChangeChart(DWP_YTD_Bar_Chart_Collection, chartTitle, YTD_DWP_Array, Carrier_Array, xLabel, yLabel, currencyCallbackFunction)
                //====================================================================//
                // Reset Year to Date New Business Direct Written Premium Bar Charts //
                chartTitle = `Year to Date New Business Direct Written Premium (${selected_carrier})`
                await abstractChangeChart(NB_YTD_Bar_Chart_Collection, chartTitle, YTD_NB_DWP_Array, Carrier_Array, xLabel, yLabel, currencyCallbackFunction)
                //==============================================================//
                // Reset Rolling 12 New Business Direct Written Premium Charts //
                chartTitle = `Rolling 12 Month New Business Direct Written Premium (${selected_carrier})`
                await abstractChangeChart(NB_R12_Bar_Chart_Collection, chartTitle, NB_DWP_12MM_Array, Carrier_Array, xLabel, yLabel, currencyCallbackFunction)
                //=====================================================//
                // Reset Rolling 12 Direct Written Premium Bar Charts //
                chartTitle = `Rolling 12 Month Direct Written Premium (${selected_carrier})`
                await abstractChangeChart(DWP_R12_Bar_Chart_Collection, chartTitle, DWP_12MM_Array, Carrier_Array, xLabel, yLabel, currencyCallbackFunction)
                break;
            case "Policies In Force":
                var yLabel = 'Policies In Force'
                //==============================================//
                // Reset Year to Date Policies In Force Charts //
                chartTitle = `Year to Date Policies In Force (${selected_carrier})`
                await abstractChangeChart(DWP_YTD_Bar_Chart_Collection, chartTitle, YTD_PIF_Array, Carrier_Array, xLabel, yLabel, numericCallbackFunction)
                //===========================================================//
                // Reset Year to Date New Business Policies In Force Charts //
                chartTitle = `Year to Date New Business Policies In Force (${selected_carrier})`
                await abstractChangeChart(NB_YTD_Bar_Chart_Collection, chartTitle, YTD_NB_PIF_Array, Carrier_Array, xLabel, yLabel, numericCallbackFunction)
                //=========================================================//
                // Reset Rolling 12 New Business Policies In Force Charts //
                chartTitle = `Rolling 12 Month New Business Policies In Force (${selected_carrier})`
                await abstractChangeChart(NB_R12_Bar_Chart_Collection, chartTitle, PIF_12MM_Array, Carrier_Array, xLabel, yLabel, numericCallbackFunction)
                //=====================================================//
                // Reset Rolling 12 Direct Written Premium Bar Charts //
                chartTitle = `Rolling 12 Month Policies In Force (${selected_carrier})`
                await abstractChangeChart(DWP_R12_Bar_Chart_Collection, chartTitle, PIF_NB_12MM_Array, Carrier_Array, xLabel, yLabel, numericCallbackFunction)
                break;
            case "Incurred Loss":
                var yLabel = 'Incurred Loss'
                //===========================================================//
                // Reset Year to Date New Business Policies In Force Charts //
                chartTitle = `Year to Date New Business Incurred Loss (${selected_carrier})`
                await abstractChangeChart(NB_YTD_Bar_Chart_Collection, chartTitle, Incurred_Loss_YTD, Carrier_Array, xLabel, yLabel, currencyCallbackFunction)
                //=========================================================//
                // Reset Rolling 12 New Business Policies In Force Charts //
                chartTitle = `Rolling 12 Month New Business Incurred Loss (${selected_carrier})`
                await abstractChangeChart(NB_R12_Bar_Chart_Collection, chartTitle, Incurred_Loss_12MM, Carrier_Array, xLabel, yLabel, currencyCallbackFunction)
                $(".DWP_YTD").hide()
                $(".DWP_R12").hide()
                break;
        }
    }
}