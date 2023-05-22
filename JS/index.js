$(document).ready(async function () {
    ZOHO.embeddedApp.on('PageLoad', async () => {
        $("#Warning_Modal").hide();
        //============================//
        // Pageload Display Settings //
        //==========================//
        // Make Overview the Default Active Tab
        $("#Overview_Tab").addClass('active')
        // Show Overview Content
        $("#Overview").show()
        // Hide Year to Date Content
        $("#YTD").hide()
        // Hide Rolling 12 Content
        $("#R12").hide()
        // Hide Most Recent Content
        $("#Most_Recent").hide()
        // Hide Carrier Selector
        $(".filter-container").hide()
        // Array of Months
        const monthArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        // Run getCarrierFields Function 
        const carrierArray = await getCarrierFields()
        // Change Text & Value //
        $('select option:contains("-None-")').text('All Carriers');
        $('select option:contains("-None-")').val('All Carriers');
        //==============================//
        // Overview Tab Click Function //
        $("#Overview_Tab").on("click", function () {
            // Make Overview the Active Tab
            $("#Overview_Tab").addClass('active')
            // Make Most Recent Tab Non-Active Tab
            $("#Most_Recent_Tab").removeClass('active')
            // Make Rolling 12 Non-Active Tab
            $("#R12_Tab").removeClass('active')
            // Make Year to Date Non-Active Tab
            $("#YTD_Tab").removeClass('active')
            // Show Overview Content
            $("#Overview").slideDown(400)
            // Hide Year to Date Content
            $("#YTD").hide()
            // Hide Rolling 12 Content
            $("#R12").hide()
            // Hide Most Recent Report Months Content
            $("#Most_Recent").hide()
            // Fade Out Carrier Selector
            $(".filter-container").hide(400)
        });
        //=====================================//
        // Close Warning Modal Click Function //
        $(".close-warning-modal").on("click", function () {
            // Hide Warning Modal
            $(".warning-modal").hide()
        })
        //==================================//
        // Year to Date Tab Click Function //
        $("#YTD_Tab").on("click", function () {
            // Make Year to Date Active Tab
            $("#YTD_Tab").addClass('active')
            // Make Most Recent Tab Non-Active Tab
            $("#Most_Recent_Tab").removeClass('active')
            // Make Overview Non-Active Tab
            $("#Overview_Tab").removeClass('active')
            // Make Rolling 12 Non-Active 
            $("#R12_Tab").removeClass('active')
            // Show Year to Date Content
            $("#YTD").slideDown()
            // Hide Overview Content
            $("#Overview").hide()
            // Hide Rolling 12 Content
            $("#R12").hide()
            // Hide Most Recent Report Months Content
            $("#Most_Recent").hide()
            // Fade Out Carrier Selector
            $(".filter-container").slideDown(400)
        });
        //================================//
        // Rolling 12 Tab Click Function //
        $("#R12_Tab").on("click", function () {
            // Make Rolling 12 Active Tab
            $("#R12_Tab").addClass('active')
            // Make Year to Date Non-Active Tab
            $("#YTD_Tab").removeClass('active')
            // Make Most Recent Tab Non-Active Tab
            $("#Most_Recent_Tab").removeClass('active')
            // Make Overview Non-Active Tab
            $("#Overview_Tab").removeClass('active')
            // Show Rolling 12 Content
            $("#R12").slideDown()
            // Hide Overview Content
            $("#Overview").hide()
            // Hide Year to Date Content
            $("#YTD").hide()
            // Hide Most Recent Report Months Content
            $("#Most_Recent").hide()
            // Fade Out Carrier Selector
            $(".filter-container").slideDown(400)
        })
        //================================//
        // Rolling 12 Tab Click Function //
        $("#Most_Recent_Tab").on("click", function () {
            // Make Rolling 12 Active Tab
            $("#Most_Recent_Tab").addClass('active')
            // Make Year to Date Non-Active Tab
            $("#YTD_Tab").removeClass('active')
            // Make Overview Non-Active Tab
            $("#Overview_Tab").removeClass('active')
            // Make Rolling 12 Tab Non-Active Tab
            $("#R12_Tab").removeClass('active')
            // Hide Overview Content
            $("#Overview").hide()
            // Hide Year to Date Content
            $("#YTD").hide()
            // Hide Year to Date Content
            $("#R12").hide()
            // Most Recent
            $("#Most_Recent").slideDown()
            // Fade Out Carrier Selector
            $(".filter-container").hide(400)
        })
        // Run Function & Declare Response from Function as Variable //
        const memberDataConsolidatedResponse = await getMemberDataConsolidatedRecords();
        // console.log("Member Data Consolidated Response")
        // console.log(memberDataConsolidatedResponse)
        // Run Function & Declare Response from Function as Variable //
        const memberConsolidatedObject = await createMemberConsolidatedObject(memberDataConsolidatedResponse);
        const globalObject = memberConsolidatedObject["Data"]
        // console.log("Global Object")
        // console.log(globalObject)
        // Get Picklist of Agencies and Append it to the Filter by Agency //
        const agencyArray = await getAndAppendAgencies(globalObject)
        // Append Report Year to the Filter by Year Selector //
        const yearsArray = await getAndAppendYears(globalObject)

        const mostRecentObj = await getMostRecentData()


        // HTML Collection of Grid in Most Recent Report Months       
        let gridItems = $(".grid-item")
        await getMostRecentAppendReportMonths(gridItems, mostRecentObj)
        await noReportMonth(gridItems)
        let groupbyMonth = _.groupBy(globalObject, "Report_Month")
        let groupbyYear = _.groupBy(globalObject, "Report_Year")
        let groupbyCarrier = _.groupBy(globalObject, "Carrier")
        let groupbyAccount = _.groupBy(globalObject, "Account_Name")
        let monthAggregateObject = await aggregate(groupbyMonth, monthArray)
        let All_Carriers_All_Years_YTD_DWP_Array_Month_Index = monthAggregateObject["YTD_DWP"]
        let All_Carriers_All_Years_YTD_NB_DWP_Array_Month_Index = monthAggregateObject["YTD_NB_DWP"]
        let All_Carriers_All_Years_DWP_12MM_Array_Month_Index = monthAggregateObject["DWP_12MM"]
        let All_Carriers_All_Years_NB_DWP_12MM_Array_Month_Index = monthAggregateObject["NB_DWP_12MM"]

        // Run Function & Declare Response from Function as Variable //
        // const carrierReportResponse = await getCarrierReports();
        //==================================//
        // New Business Year to Date Chart //
        //================================//
        // HTML Collection of NB YTD Bar Charts
        let NB_YTD_Bar_Chart_Collection = []
        // New Business Year to Date Canvas = All NB YTD Bar Charts
        const NB_YTD_Bar_Chart_Canvas = $(".NB_YTD_Bar_Chart")
        // Loop New Business Year to Date Canvas'
        for (let i = 0; i < NB_YTD_Bar_Chart_Canvas.length; i++) {
            // Push Charts into NB_YTD_Bar_Chart_Collection Array
            NB_YTD_Bar_Chart_Collection[i] = new Chart(NB_YTD_Bar_Chart_Canvas[i], {
                // Data for Chart //
                data: {
                    // Labels for X-Axis //
                    labels: monthArray,
                    datasets: [{
                        // Type of Chart //
                        type: 'bar',
                        data: All_Carriers_All_Years_YTD_NB_DWP_Array_Month_Index,
                        backgroundColor: [
                            'rgba(153, 102, 255, 0.4)',
                            'rgba(153, 102, 255, 0.4)',
                            'rgba(153, 102, 255, 0.4)',
                            'rgba(153, 102, 255, 0.4)',
                            'rgba(153, 102, 255, 0.4)',
                            'rgba(153, 102, 255, 0.4)'
                        ],
                        borderColor: [
                            'rgba(153, 102, 255, 0.4)',
                            'rgba(153, 102, 255, 0.4)',
                            'rgba(153, 102, 255, 0.4)',
                            'rgba(153, 102, 255, 0.4)',
                            'rgba(153, 102, 255, 0.4)',
                            'rgba(153, 102, 255, 0.4)'
                        ],
                        borderWidth: 1
                    }]
                },
                //----------------//
                // Chart Options //
                options: {
                    plugins: {
                        // Chart Title
                        title: {
                            display: true,
                            text: `Year to Date New Business Direct Written Premium (All Carriers)`,
                            font: {
                                size: 16
                            }
                        },
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Month',
                                font: {
                                    size: 14
                                }
                            },
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Direct Written Premium',
                                font: {
                                    size: 14
                                }
                            },
                            beginAtZero: false,
                            ticks: {
                                // Include a dollar sign in the ticks
                                callback: function (value, index, ticks) {
                                    return '$' + Chart.Ticks.formatters.numeric.apply(this, [value, index, ticks]);
                                }
                            }
                        }
                    }
                }// End of Chart Options //
            });
        }
        //================================//
        // New Business Rolling 12 Chart //
        //==============================//
        // HTML Collection of NB R12 Bar Charts
        let NB_R12_Bar_Chart_Collection = []
        // New Business Rolling 12 Canvas = All NB R12 Bar Charts
        const NB_R12_Bar_Chart_Canvas = $('.NB_R12_Bar_Chart');
        for (let i = 0; i < NB_R12_Bar_Chart_Canvas.length; i++) {
            // Push Charts into NB_R12_Bar_Chart_Collection Array
            NB_R12_Bar_Chart_Collection[i] = new Chart(NB_R12_Bar_Chart_Canvas[i], {
                data: {
                    labels: monthArray,
                    datasets: [{
                        type: 'bar',
                        data: All_Carriers_All_Years_NB_DWP_12MM_Array_Month_Index,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.4)',
                            'rgba(255, 99, 132, 0.4)',
                            'rgba(255, 99, 132, 0.4)',
                            'rgba(255, 99, 132, 0.4)',
                            'rgba(255, 99, 132, 0.4)',
                            'rgba(255, 99, 132, 0.4)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 0.4)',
                            'rgba(255, 99, 132, 0.4)',
                            'rgba(255, 99, 132, 0.4)',
                            'rgba(255, 99, 132, 0.4)',
                            'rgba(255, 99, 132, 0.4)',
                            'rgba(255, 99, 132, 0.4)'
                        ],
                        borderWidth: 1
                    }]
                },
                // Chart Options
                options: {
                    plugins: {
                        title: {
                            display: true,
                            text: 'Rolling 12 Month New Business Direct Written Premium (All Carriers)',
                            font: {
                                size: 16
                            }
                        },
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Month',
                                font: {
                                    size: 14
                                }
                            },
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Direct Written Premium',
                                font: {
                                    size: 14
                                }
                            },
                            beginAtZero: false,
                            ticks: {
                                // Include a dollar sign in the ticks
                                callback: function (value, index, ticks) {
                                    return '$' + Chart.Ticks.formatters.numeric.apply(this, [value, index, ticks]);
                                }
                            }
                        }
                    }
                }
            });
        }
        //======================================//
        // Direct Written Premium Year to Date //
        //====================================//
        // HTML Collection of DWP YTD Bar Charts
        let DWP_YTD_Bar_Chart_Collection = []
        // Direct Writen Premium Year to Date Canvas = All DWP YTD Bar Charts
        const DWP_YTD_Bar_Chart_Canvas = $('.DWP_YTD_Bar_Chart');
        for (let i = 0; i < DWP_YTD_Bar_Chart_Canvas.length; i++) {
            // Push Charts into DWP_YTD_Bar_Chart_Collection Array
            DWP_YTD_Bar_Chart_Collection[i] = new Chart(DWP_YTD_Bar_Chart_Canvas[i], {
                data: {
                    labels: monthArray,
                    datasets: [{
                        type: 'bar',
                        data: All_Carriers_All_Years_YTD_DWP_Array_Month_Index,
                        backgroundColor: [
                            'rgba(255, 159, 64, 0.4)',
                            'rgba(255, 159, 64, 0.4)',
                            'rgba(255, 159, 64, 0.4)',
                            'rgba(255, 159, 64, 0.4)',
                            'rgba(255, 159, 64, 0.4)',
                            'rgba(255, 159, 64, 0.4)'
                        ],
                        borderColor: [
                            'rgba(255, 159, 64, 0.4)',
                            'rgba(255, 159, 64, 0.4)',
                            'rgba(255, 159, 64, 0.4)',
                            'rgba(255, 159, 64, 0.4)',
                            'rgba(255, 159, 64, 0.4)',
                            'rgba(255, 159, 64, 0.4)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    plugins: {
                        title: {
                            display: true,
                            text: 'Year to Date Direct Written Premium (All Carriers)',
                            font: {
                                size: 16
                            }
                        },
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Month',
                                font: {
                                    size: 14
                                }
                            },
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Direct Written Premium',
                                font: {
                                    size: 14
                                }
                            },
                            beginAtZero: false,
                            ticks: {
                                // Include a dollar sign in the ticks
                                callback: function (value, index, ticks) {
                                    return '$' + Chart.Ticks.formatters.numeric.apply(this, [value, index, ticks]);
                                }
                            }
                        }
                    }
                }
            });
        }
        //=====================================//
        // Direct Written Premium Rolling 12  //
        //===================================//
        let DWP_R12_Bar_Chart_Collection = []
        const DWP_R12_Bar_Chart_Canvas = $('.DWP_R12_Bar_Chart');
        for (let i = 0; i < DWP_R12_Bar_Chart_Canvas.length; i++) {
            DWP_R12_Bar_Chart_Collection[i] = new Chart(DWP_R12_Bar_Chart_Canvas[i], {
                data: {
                    labels: monthArray,
                    datasets: [{
                        type: 'bar',
                        data: All_Carriers_All_Years_DWP_12MM_Array_Month_Index,
                        backgroundColor: [
                            'rgba(54, 162, 235, 0.4)',
                            'rgba(54, 162, 235, 0.4)',
                            'rgba(54, 162, 235, 0.4)',
                            'rgba(54, 162, 235, 0.4)',
                            'rgba(54, 162, 235, 0.4)',
                            'rgba(54, 162, 235, 0.4)'
                        ],
                        borderColor: [
                            'rgba(54, 162, 235, 0.4)',
                            'rgba(54, 162, 235, 0.4)',
                            'rgba(54, 162, 235, 0.4)',
                            'rgba(54, 162, 235, 0.4)',
                            'rgba(54, 162, 235, 0.4)',
                            'rgba(54, 162, 235, 0.4)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    plugins: {
                        title: {
                            display: true,
                            text: 'Rolling 12 Month Direct Written Premium (All Carriers)',
                            font: {
                                size: 16
                            }
                        },
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Month',
                                font: {
                                    size: 14
                                }
                            },
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Direct Written Premium',
                                font: {
                                    size: 14
                                }
                            },
                            beginAtZero: false,
                            ticks: {
                                // Include a dollar sign in the ticks
                                callback: function (value, index, ticks) {
                                    return '$' + Chart.Ticks.formatters.numeric.apply(this, [value, index, ticks]);
                                }
                            }
                        }
                    }
                }
            });
        }
        //==============================//
        // Data Select Change Function //
        //============================//
        $(".type_of_data_select").on("change", async function () {
            $(".DWP_YTD").show()
            $(".DWP_R12").show()
            // If Warning Modal is Visible
            if ($(".warning-modal").is(":visible")) {
                $(".warning-modal").hide()
            }
            // If YTD Tab is Active
            if ($("#YTD_Tab").hasClass('active') == true) {
                $("#YTD").show()
            }
            // If R12 Tab is Active
            if ($("#R12_Tab").hasClass('active') == true) {
                $("#R12").show()
            }
            // Get Selected Data Value
            let selected_data = await getSelectedData()
            // Get Selected Carrier Value
            let selected_carrier = await getSelectedCarrier()
            // Get Selected Month Value
            let selected_month = await getSelectedMonth()
            // Get Selected Year Value
            let selected_year = await getSelectedYear(yearsArray)
            // Get Selected Year Value
            let selected_agency = await getSelectedAgency(agencyArray)
            //=======================================================//
            // All Carriers & All Months & All Years & All Agencies //
            //=====================================================//
            if (selected_carrier == 'All Carriers' && selected_month == 'All Months' && selected_year == 'All Years' && selected_agency == "All Agencies") {
                await generalFunction(DWP_YTD_Bar_Chart_Collection, NB_YTD_Bar_Chart_Collection, NB_R12_Bar_Chart_Collection, DWP_R12_Bar_Chart_Collection, monthAggregateObject, monthArray, selected_data, selected_carrier, selected_year, selected_month, selected_agency, currencyCallbackFunction, numericCallbackFunction)
            }
            //=====================================================//
            // All Carriers & All Months & All Years & One Agency //
            //===================================================//
            if (selected_carrier == 'All Carriers' && selected_month == 'All Months' && selected_year == 'All Years' && selected_agency != "All Agencies") {
                singleReportData = groupbyAccount[selected_agency]
                await generalFunction(DWP_YTD_Bar_Chart_Collection, NB_YTD_Bar_Chart_Collection, NB_R12_Bar_Chart_Collection, DWP_R12_Bar_Chart_Collection, singleReportData, monthArray, selected_data, selected_carrier, selected_year, selected_month, selected_agency, currencyCallbackFunction, numericCallbackFunction)
            }
            //====================================================//
            // One Carrier & One Month & One Year & All Agencies //
            //==================================================//
            if (selected_carrier != 'All Carriers' && selected_month != 'All Months' && selected_year != 'All Years' && selected_agency == "All Agencies") {
                selectedMonthReport = groupbyMonth[selected_month]
                let groupbyCarrier = _.groupBy(selectedMonthReport, "Carrier")
                let ReportData = groupbyCarrier[selected_carrier]
                let groupbyYear = _.groupBy(ReportData, "Report_Year")
                let singleReportData = groupbyYear[selected_year]
                await generalFunction(DWP_YTD_Bar_Chart_Collection, NB_YTD_Bar_Chart_Collection, NB_R12_Bar_Chart_Collection, DWP_R12_Bar_Chart_Collection, singleReportData, monthArray, selected_data, selected_carrier, selected_year, selected_month, selected_agency, currencyCallbackFunction, numericCallbackFunction)
            }
            //==================================================//
            // One Carrier & One Month & One Year & One Agency //
            //================================================//
            if (selected_carrier != 'All Carriers' && selected_month != 'All Months' && selected_year != 'All Years' && selected_agency != "All Agencies") {
                selectedMonthReport = groupbyMonth[selected_month]
                let groupbyCarrier = _.groupBy(selectedMonthReport, "Carrier")
                let ReportData = groupbyCarrier[selected_carrier]
                let groupbyYear = _.groupBy(ReportData, "Report_Year")
                let ReportData2 = groupbyYear[selected_year]
                let groupbyAccount = _.groupBy(ReportData2, "Account_Name")
                let singleReportData = groupbyAccount[selected_agency]
                await generalFunction(DWP_YTD_Bar_Chart_Collection, NB_YTD_Bar_Chart_Collection, NB_R12_Bar_Chart_Collection, DWP_R12_Bar_Chart_Collection, singleReportData, monthArray, selected_data, selected_carrier, selected_year, selected_month, selected_agency, currencyCallbackFunction, numericCallbackFunction)
            }

            //=====================================================//
            // One Carrier & One Month & All Years & All Agencies //
            //===================================================//
            if (selected_carrier != 'All Carriers' && selected_month != 'All Months' && selected_year == 'All Years' && selected_agency == "All Agencies") {
                selectedMonthReport = groupbyMonth[selected_month]
                // Collection grouped by Month //
                let groupbyCarrier = _.groupBy(selectedMonthReport, "Carrier")
                // Report of Selected Carrier nad Selected Month
                let singleReportData = groupbyCarrier[selected_carrier]
                await generalFunction(DWP_YTD_Bar_Chart_Collection, NB_YTD_Bar_Chart_Collection, NB_R12_Bar_Chart_Collection, DWP_R12_Bar_Chart_Collection, singleReportData, monthArray, selected_data, selected_carrier, selected_year, selected_month, selected_agency, currencyCallbackFunction, numericCallbackFunction)
            }
            //===================================================//
            // One Carrier & One Month & All Years & One Agency //
            //==================================================//
            if (selected_carrier != 'All Carriers' && selected_month != 'All Months' && selected_year == 'All Years' && selected_agency != "All Agencies") {
                selectedMonthReport = groupbyMonth[selected_month]
                // Collection grouped by Month //
                let groupbyCarrier = _.groupBy(selectedMonthReport, "Carrier")
                // Report of Selected Carrier nad Selected Month
                let ReportData = groupbyCarrier[selected_carrier]
                let groupbyYear = _.groupBy(ReportData, "Account_Name")
                let singleReportData = groupbyYear[selected_agency]
                await generalFunction(DWP_YTD_Bar_Chart_Collection, NB_YTD_Bar_Chart_Collection, NB_R12_Bar_Chart_Collection, DWP_R12_Bar_Chart_Collection, singleReportData, monthArray, selected_data, selected_carrier, selected_year, selected_month, selected_agency, currencyCallbackFunction, numericCallbackFunction)
            }
            //======================================================//
            // All Carriers & All Months & One Year & All Agencies //
            //====================================================//
            if (selected_carrier == 'All Carriers' && selected_month == 'All Months' && selected_year != 'All Years' && selected_agency == "All Agencies") {
                // Filter by selected year //
                selectedYearReport = groupbyYear[selected_year]
                await generalFunction(DWP_YTD_Bar_Chart_Collection, NB_YTD_Bar_Chart_Collection, NB_R12_Bar_Chart_Collection, DWP_R12_Bar_Chart_Collection, selectedYearReport, monthArray, selected_data, selected_carrier, selected_year, selected_month, selected_agency, currencyCallbackFunction, numericCallbackFunction)
            }
            //======================================================//
            // All Carriers & All Months & One Year & One Agency //
            //====================================================//
            if (selected_carrier == 'All Carriers' && selected_month == 'All Months' && selected_year != 'All Years' && selected_agency != "All Agencies") {
                selectedYearReport = groupbyYear[selected_year]
                let groupbyAccount = _.groupBy(selectedYearReport, "Account_Name")
                let singleReportData = groupbyAccount[selected_agency]
                await generalFunction(DWP_YTD_Bar_Chart_Collection, NB_YTD_Bar_Chart_Collection, NB_R12_Bar_Chart_Collection, DWP_R12_Bar_Chart_Collection, singleReportData, monthArray, selected_data, selected_carrier, selected_year, selected_month, selected_agency, currencyCallbackFunction, numericCallbackFunction)
            }
            //======================================================//
            // One Carrier & All Months & All Years & All Agencies //
            //====================================================//
            if (selected_carrier != 'All Carriers' && selected_month == 'All Months' && selected_year == 'All Years' && selected_agency == "All Agencies") {
                selectedCarrierReport = groupbyCarrier[selected_carrier]
                // Filtered to only Data from the Selected Carrier
                await generalFunction(DWP_YTD_Bar_Chart_Collection, NB_YTD_Bar_Chart_Collection, NB_R12_Bar_Chart_Collection, DWP_R12_Bar_Chart_Collection, selectedCarrierReport, monthArray, selected_data, selected_carrier, selected_year, selected_month, selected_agency, currencyCallbackFunction, numericCallbackFunction)
            }
            //====================================================//
            // One Carrier & All Months & All Years & One Agency //
            //==================================================//
            if (selected_carrier != 'All Carriers' && selected_month == 'All Months' && selected_year == 'All Years' && selected_agency != "All Agencies") {
                selectedCarrierReport = groupbyCarrier[selected_carrier]
                let groupbyAccount = _.groupBy(selectedCarrierReport, "Account_Name")
                let singleReportData = groupbyAccount[selected_agency]
                // Filtered to only Data from the Selected Carrier
                await generalFunction(DWP_YTD_Bar_Chart_Collection, NB_YTD_Bar_Chart_Collection, NB_R12_Bar_Chart_Collection, DWP_R12_Bar_Chart_Collection, singleReportData, monthArray, selected_data, selected_carrier, selected_year, selected_month, selected_agency, currencyCallbackFunction, numericCallbackFunction)
            }
            //=====================================================//
            // One Carrier & All Months & One Year & All Agencies //
            //===================================================//
            if (selected_carrier != 'All Carriers' && selected_month == 'All Months' && selected_year != 'All Years' && selected_agency == "All Agencies") {
                // Filter by selected year //
                selectedYearReport = groupbyYear[selected_year]
                // Collection grouped by Month //
                let groupbyCarrier = _.groupBy(selectedYearReport, "Carrier")
                singleReportData = groupbyCarrier[selected_carrier]
                await generalFunction(DWP_YTD_Bar_Chart_Collection, NB_YTD_Bar_Chart_Collection, NB_R12_Bar_Chart_Collection, DWP_R12_Bar_Chart_Collection, singleReportData, monthArray, selected_data, selected_carrier, selected_year, selected_month, selected_agency, currencyCallbackFunction, numericCallbackFunction)
            }
            //===================================================//
            // One Carrier & All Months & One Year & One Agency //
            //=================================================//
            if (selected_carrier != 'All Carriers' && selected_month == 'All Months' && selected_year != 'All Years' && selected_agency != "All Agencies") {
                // Filter by selected year //
                selectedYearReport = groupbyYear[selected_year]
                // Collection grouped by Month //
                let groupbyCarrier = _.groupBy(selectedYearReport, "Carrier")
                selectedCarrierReport = groupbyCarrier[selected_carrier]
                let groupbyAccount = _.groupBy(selectedCarrierReport, "Account_Name")
                singleReportData = groupbyAccount[selected_agency]
                await generalFunction(DWP_YTD_Bar_Chart_Collection, NB_YTD_Bar_Chart_Collection, NB_R12_Bar_Chart_Collection, DWP_R12_Bar_Chart_Collection, singleReportData, monthArray, selected_data, selected_carrier, selected_year, selected_month, selected_agency, currencyCallbackFunction, numericCallbackFunction)
            }
            //======================================================//
            // All Carriers & One Month & All Years & All Agencies //
            //====================================================//
            if (selected_carrier == 'All Carriers' && selected_month != 'All Months' && selected_year == 'All Years' && selected_agency == "All Agencies") {
                selectedMonthReport = groupbyMonth[selected_month]
                await generalFunction(DWP_YTD_Bar_Chart_Collection, NB_YTD_Bar_Chart_Collection, NB_R12_Bar_Chart_Collection, DWP_R12_Bar_Chart_Collection, selectedMonthReport, monthArray, selected_data, selected_carrier, selected_year, selected_month, selected_agency, currencyCallbackFunction, numericCallbackFunction)
            }

            //======================================================//
            // All Carriers & One Month & All Years & One Agencies //
            //====================================================//
            if (selected_carrier == 'All Carriers' && selected_month != 'All Months' && selected_year == 'All Years' && selected_agency != "All Agencies") {
                selectedMonthReport = groupbyMonth[selected_month]
                let groupbyAccount = _.groupBy(selectedMonthReport, "Account_Name")
                singleReportData = groupbyAccount[selected_agency]
                await generalFunction(DWP_YTD_Bar_Chart_Collection, NB_YTD_Bar_Chart_Collection, NB_R12_Bar_Chart_Collection, DWP_R12_Bar_Chart_Collection, singleReportData, monthArray, selected_data, selected_carrier, selected_year, selected_month, selected_agency, currencyCallbackFunction, numericCallbackFunction)
            }
            //=====================================================//
            // All Carriers & One Month & One Year & All Agencies //
            //===================================================//
            if (selected_carrier == 'All Carriers' && selected_month != 'All Months' && selected_year != 'All Years' && selected_agency == "All Agencies") {
                selectedYearReport = groupbyYear[selected_year]
                // Collection grouped by Month //
                let groupbyMonth = _.groupBy(selectedYearReport, "Report_Month")
                let singleReportData = groupbyMonth[selected_month]
                await generalFunction(DWP_YTD_Bar_Chart_Collection, NB_YTD_Bar_Chart_Collection, NB_R12_Bar_Chart_Collection, DWP_R12_Bar_Chart_Collection, singleReportData, monthArray, selected_data, selected_carrier, selected_year, selected_month, selected_agency, currencyCallbackFunction, numericCallbackFunction)
            }
            //===================================================//
            // All Carriers & One Month & One Year & One Agency //
            //=================================================//
            if (selected_carrier == 'All Carriers' && selected_month != 'All Months' && selected_year != 'All Years' && selected_agency != "All Agencies") {
                selectedYearReport = groupbyYear[selected_year]
                // Collection grouped by Month //
                let groupbyMonth = _.groupBy(selectedYearReport, "Report_Month")
                let selectedMonthReport = groupbyMonth[selected_month]
                let groupbyAccount = _.groupBy(selectedMonthReport, "Account_Name")
                singleReportData = groupbyAccount[selected_agency]
                await generalFunction(DWP_YTD_Bar_Chart_Collection, NB_YTD_Bar_Chart_Collection, NB_R12_Bar_Chart_Collection, DWP_R12_Bar_Chart_Collection, singleReportData, monthArray, selected_data, selected_carrier, selected_year, selected_month, selected_agency, currencyCallbackFunction, numericCallbackFunction)
            }
        });
        //=================================//
        // Carrier Select Change Function //
        //===============================//
        $(".carrier_select").on("change", async function () {
            $(".DWP_YTD").show()
            $(".DWP_R12").show()
            // If Warning Modal is Visible
            if ($(".warning-modal").is(":visible")) {
                $(".warning-modal").hide()
            }
            // If YTD Tab is Active
            if ($("#YTD_Tab").hasClass('active') == true) {
                $("#YTD").show()
            }
            // If R12 Tab is Active
            if ($("#R12_Tab").hasClass('active') == true) {
                $("#R12").show()
            }
            // Get Selected Data Value
            let selected_data = await getSelectedData()
            // Get Selected Carrier Value
            let selected_carrier = await getSelectedCarrier()
            // Get Selected Month Value
            let selected_month = await getSelectedMonth()
            // Get Selected Year Value
            let selected_year = await getSelectedYear(yearsArray)
            // Get Selected Year Value
            let selected_agency = await getSelectedAgency(agencyArray)
            //=======================================================//
            // All Carriers & All Months & All Years & All Agencies //
            //=====================================================//
            if (selected_carrier == 'All Carriers' && selected_month == 'All Months' && selected_year == 'All Years' && selected_agency == "All Agencies") {
                await generalFunction(DWP_YTD_Bar_Chart_Collection, NB_YTD_Bar_Chart_Collection, NB_R12_Bar_Chart_Collection, DWP_R12_Bar_Chart_Collection, monthAggregateObject, monthArray, selected_data, selected_carrier, selected_year, selected_month, selected_agency, currencyCallbackFunction, numericCallbackFunction)
            }
            //=====================================================//
            // All Carriers & All Months & All Years & One Agency //
            //===================================================//
            if (selected_carrier == 'All Carriers' && selected_month == 'All Months' && selected_year == 'All Years' && selected_agency != "All Agencies") {
                singleReportData = groupbyAccount[selected_agency]
                await generalFunction(DWP_YTD_Bar_Chart_Collection, NB_YTD_Bar_Chart_Collection, NB_R12_Bar_Chart_Collection, DWP_R12_Bar_Chart_Collection, singleReportData, monthArray, selected_data, selected_carrier, selected_year, selected_month, selected_agency, currencyCallbackFunction, numericCallbackFunction)
            }
            //====================================================//
            // One Carrier & One Month & One Year & All Agencies //
            //==================================================//
            if (selected_carrier != 'All Carriers' && selected_month != 'All Months' && selected_year != 'All Years' && selected_agency == "All Agencies") {
                selectedMonthReport = groupbyMonth[selected_month]
                let groupbyCarrier = _.groupBy(selectedMonthReport, "Carrier")
                let ReportData = groupbyCarrier[selected_carrier]
                let groupbyYear = _.groupBy(ReportData, "Report_Year")
                let singleReportData = groupbyYear[selected_year]
                await generalFunction(DWP_YTD_Bar_Chart_Collection, NB_YTD_Bar_Chart_Collection, NB_R12_Bar_Chart_Collection, DWP_R12_Bar_Chart_Collection, singleReportData, monthArray, selected_data, selected_carrier, selected_year, selected_month, selected_agency, currencyCallbackFunction, numericCallbackFunction)
            }
            //==================================================//
            // One Carrier & One Month & One Year & One Agency //
            //================================================//
            if (selected_carrier != 'All Carriers' && selected_month != 'All Months' && selected_year != 'All Years' && selected_agency != "All Agencies") {
                selectedMonthReport = groupbyMonth[selected_month]
                let groupbyCarrier = _.groupBy(selectedMonthReport, "Carrier")
                let ReportData = groupbyCarrier[selected_carrier]
                let groupbyYear = _.groupBy(ReportData, "Report_Year")
                let ReportData2 = groupbyYear[selected_year]
                let groupbyAccount = _.groupBy(ReportData2, "Account_Name")
                let singleReportData = groupbyAccount[selected_agency]
                await generalFunction(DWP_YTD_Bar_Chart_Collection, NB_YTD_Bar_Chart_Collection, NB_R12_Bar_Chart_Collection, DWP_R12_Bar_Chart_Collection, singleReportData, monthArray, selected_data, selected_carrier, selected_year, selected_month, selected_agency, currencyCallbackFunction, numericCallbackFunction)
            }

            //=====================================================//
            // One Carrier & One Month & All Years & All Agencies //
            //===================================================//
            if (selected_carrier != 'All Carriers' && selected_month != 'All Months' && selected_year == 'All Years' && selected_agency == "All Agencies") {
                selectedMonthReport = groupbyMonth[selected_month]
                // Collection grouped by Month //
                let groupbyCarrier = _.groupBy(selectedMonthReport, "Carrier")
                // Report of Selected Carrier nad Selected Month
                let singleReportData = groupbyCarrier[selected_carrier]
                await generalFunction(DWP_YTD_Bar_Chart_Collection, NB_YTD_Bar_Chart_Collection, NB_R12_Bar_Chart_Collection, DWP_R12_Bar_Chart_Collection, singleReportData, monthArray, selected_data, selected_carrier, selected_year, selected_month, selected_agency, currencyCallbackFunction, numericCallbackFunction)
            }
            //===================================================//
            // One Carrier & One Month & All Years & One Agency //
            //==================================================//
            if (selected_carrier != 'All Carriers' && selected_month != 'All Months' && selected_year == 'All Years' && selected_agency != "All Agencies") {
                selectedMonthReport = groupbyMonth[selected_month]
                // Collection grouped by Month //
                let groupbyCarrier = _.groupBy(selectedMonthReport, "Carrier")
                // Report of Selected Carrier nad Selected Month
                let ReportData = groupbyCarrier[selected_carrier]
                let groupbyYear = _.groupBy(ReportData, "Account_Name")
                let singleReportData = groupbyYear[selected_agency]
                await generalFunction(DWP_YTD_Bar_Chart_Collection, NB_YTD_Bar_Chart_Collection, NB_R12_Bar_Chart_Collection, DWP_R12_Bar_Chart_Collection, singleReportData, monthArray, selected_data, selected_carrier, selected_year, selected_month, selected_agency, currencyCallbackFunction, numericCallbackFunction)
            }
            //======================================================//
            // All Carriers & All Months & One Year & All Agencies //
            //====================================================//
            if (selected_carrier == 'All Carriers' && selected_month == 'All Months' && selected_year != 'All Years' && selected_agency == "All Agencies") {
                // Filter by selected year //
                selectedYearReport = groupbyYear[selected_year]
                await generalFunction(DWP_YTD_Bar_Chart_Collection, NB_YTD_Bar_Chart_Collection, NB_R12_Bar_Chart_Collection, DWP_R12_Bar_Chart_Collection, selectedYearReport, monthArray, selected_data, selected_carrier, selected_year, selected_month, selected_agency, currencyCallbackFunction, numericCallbackFunction)
            }
            //======================================================//
            // All Carriers & All Months & One Year & One Agency //
            //====================================================//
            if (selected_carrier == 'All Carriers' && selected_month == 'All Months' && selected_year != 'All Years' && selected_agency != "All Agencies") {
                selectedYearReport = groupbyYear[selected_year]
                let groupbyAccount = _.groupBy(selectedYearReport, "Account_Name")
                let singleReportData = groupbyAccount[selected_agency]
                await generalFunction(DWP_YTD_Bar_Chart_Collection, NB_YTD_Bar_Chart_Collection, NB_R12_Bar_Chart_Collection, DWP_R12_Bar_Chart_Collection, singleReportData, monthArray, selected_data, selected_carrier, selected_year, selected_month, selected_agency, currencyCallbackFunction, numericCallbackFunction)
            }
            //======================================================//
            // One Carrier & All Months & All Years & All Agencies //
            //====================================================//
            if (selected_carrier != 'All Carriers' && selected_month == 'All Months' && selected_year == 'All Years' && selected_agency == "All Agencies") {
                selectedCarrierReport = groupbyCarrier[selected_carrier]
                // Filtered to only Data from the Selected Carrier
                await generalFunction(DWP_YTD_Bar_Chart_Collection, NB_YTD_Bar_Chart_Collection, NB_R12_Bar_Chart_Collection, DWP_R12_Bar_Chart_Collection, selectedCarrierReport, monthArray, selected_data, selected_carrier, selected_year, selected_month, selected_agency, currencyCallbackFunction, numericCallbackFunction)
            }
            //====================================================//
            // One Carrier & All Months & All Years & One Agency //
            //==================================================//
            if (selected_carrier != 'All Carriers' && selected_month == 'All Months' && selected_year == 'All Years' && selected_agency != "All Agencies") {
                selectedCarrierReport = groupbyCarrier[selected_carrier]
                let groupbyAccount = _.groupBy(selectedCarrierReport, "Account_Name")
                let singleReportData = groupbyAccount[selected_agency]
                // Filtered to only Data from the Selected Carrier
                await generalFunction(DWP_YTD_Bar_Chart_Collection, NB_YTD_Bar_Chart_Collection, NB_R12_Bar_Chart_Collection, DWP_R12_Bar_Chart_Collection, singleReportData, monthArray, selected_data, selected_carrier, selected_year, selected_month, selected_agency, currencyCallbackFunction, numericCallbackFunction)
            }
            //=====================================================//
            // One Carrier & All Months & One Year & All Agencies //
            //===================================================//
            if (selected_carrier != 'All Carriers' && selected_month == 'All Months' && selected_year != 'All Years' && selected_agency == "All Agencies") {
                // Filter by selected year //
                selectedYearReport = groupbyYear[selected_year]
                // Collection grouped by Month //
                let groupbyCarrier = _.groupBy(selectedYearReport, "Carrier")
                singleReportData = groupbyCarrier[selected_carrier]
                await generalFunction(DWP_YTD_Bar_Chart_Collection, NB_YTD_Bar_Chart_Collection, NB_R12_Bar_Chart_Collection, DWP_R12_Bar_Chart_Collection, singleReportData, monthArray, selected_data, selected_carrier, selected_year, selected_month, selected_agency, currencyCallbackFunction, numericCallbackFunction)
            }
            //===================================================//
            // One Carrier & All Months & One Year & One Agency //
            //=================================================//
            if (selected_carrier != 'All Carriers' && selected_month == 'All Months' && selected_year != 'All Years' && selected_agency != "All Agencies") {
                // Filter by selected year //
                selectedYearReport = groupbyYear[selected_year]
                // Collection grouped by Month //
                let groupbyCarrier = _.groupBy(selectedYearReport, "Carrier")
                selectedCarrierReport = groupbyCarrier[selected_carrier]
                let groupbyAccount = _.groupBy(selectedCarrierReport, "Account_Name")
                singleReportData = groupbyAccount[selected_agency]
                await generalFunction(DWP_YTD_Bar_Chart_Collection, NB_YTD_Bar_Chart_Collection, NB_R12_Bar_Chart_Collection, DWP_R12_Bar_Chart_Collection, singleReportData, monthArray, selected_data, selected_carrier, selected_year, selected_month, selected_agency, currencyCallbackFunction, numericCallbackFunction)
            }
            //======================================================//
            // All Carriers & One Month & All Years & All Agencies //
            //====================================================//
            if (selected_carrier == 'All Carriers' && selected_month != 'All Months' && selected_year == 'All Years' && selected_agency == "All Agencies") {
                selectedMonthReport = groupbyMonth[selected_month]
                await generalFunction(DWP_YTD_Bar_Chart_Collection, NB_YTD_Bar_Chart_Collection, NB_R12_Bar_Chart_Collection, DWP_R12_Bar_Chart_Collection, selectedMonthReport, monthArray, selected_data, selected_carrier, selected_year, selected_month, selected_agency, currencyCallbackFunction, numericCallbackFunction)
            }

            //======================================================//
            // All Carriers & One Month & All Years & One Agencies //
            //====================================================//
            if (selected_carrier == 'All Carriers' && selected_month != 'All Months' && selected_year == 'All Years' && selected_agency != "All Agencies") {
                selectedMonthReport = groupbyMonth[selected_month]
                let groupbyAccount = _.groupBy(selectedMonthReport, "Account_Name")
                singleReportData = groupbyAccount[selected_agency]
                await generalFunction(DWP_YTD_Bar_Chart_Collection, NB_YTD_Bar_Chart_Collection, NB_R12_Bar_Chart_Collection, DWP_R12_Bar_Chart_Collection, singleReportData, monthArray, selected_data, selected_carrier, selected_year, selected_month, selected_agency, currencyCallbackFunction, numericCallbackFunction)
            }
            //=====================================================//
            // All Carriers & One Month & One Year & All Agencies //
            //===================================================//
            if (selected_carrier == 'All Carriers' && selected_month != 'All Months' && selected_year != 'All Years' && selected_agency == "All Agencies") {
                selectedYearReport = groupbyYear[selected_year]
                // Collection grouped by Month //
                let groupbyMonth = _.groupBy(selectedYearReport, "Report_Month")
                let singleReportData = groupbyMonth[selected_month]
                await generalFunction(DWP_YTD_Bar_Chart_Collection, NB_YTD_Bar_Chart_Collection, NB_R12_Bar_Chart_Collection, DWP_R12_Bar_Chart_Collection, singleReportData, monthArray, selected_data, selected_carrier, selected_year, selected_month, selected_agency, currencyCallbackFunction, numericCallbackFunction)
            }
            //===================================================//
            // All Carriers & One Month & One Year & One Agency //
            //=================================================//
            if (selected_carrier == 'All Carriers' && selected_month != 'All Months' && selected_year != 'All Years' && selected_agency != "All Agencies") {
                selectedYearReport = groupbyYear[selected_year]
                // Collection grouped by Month //
                let groupbyMonth = _.groupBy(selectedYearReport, "Report_Month")
                let selectedMonthReport = groupbyMonth[selected_month]
                let groupbyAccount = _.groupBy(selectedMonthReport, "Account_Name")
                singleReportData = groupbyAccount[selected_agency]
                await generalFunction(DWP_YTD_Bar_Chart_Collection, NB_YTD_Bar_Chart_Collection, NB_R12_Bar_Chart_Collection, DWP_R12_Bar_Chart_Collection, singleReportData, monthArray, selected_data, selected_carrier, selected_year, selected_month, selected_agency, currencyCallbackFunction, numericCallbackFunction)
            }
        })//=====================================//
        // End of Carrier Select Click Function //
        //=====================================//
        //===============================//
        // Month Select Change Function //
        //=============================//
        $(".month_select").on("change", async function () {
            $(".DWP_YTD").show()
            $(".DWP_R12").show()
            // If Warning Modal is Visible
            if ($(".warning-modal").is(":visible")) {
                $(".warning-modal").hide()
            }
            // If YTD Tab is Active
            if ($("#YTD_Tab").hasClass('active') == true) {
                $("#YTD").show()
            }
            // If R12 Tab is Active
            if ($("#R12_Tab").hasClass('active') == true) {
                $("#R12").show()
            }
            // Get Selected Data Value
            let selected_data = await getSelectedData()
            // Get Selected Carrier Value
            let selected_carrier = await getSelectedCarrier()
            // Get Selected Month Value
            let selected_month = await getSelectedMonth()
            // Get Selected Year Value
            let selected_year = await getSelectedYear(yearsArray)
            // Get Selected Year Value
            let selected_agency = await getSelectedAgency(agencyArray)
            //=======================================================//
            // All Carriers & All Months & All Years & All Agencies //
            //=====================================================//
            if (selected_carrier == 'All Carriers' && selected_month == 'All Months' && selected_year == 'All Years' && selected_agency == "All Agencies") {
                await generalFunction(DWP_YTD_Bar_Chart_Collection, NB_YTD_Bar_Chart_Collection, NB_R12_Bar_Chart_Collection, DWP_R12_Bar_Chart_Collection, monthAggregateObject, monthArray, selected_data, selected_carrier, selected_year, selected_month, selected_agency, currencyCallbackFunction, numericCallbackFunction)
            }
            //=====================================================//
            // All Carriers & All Months & All Years & One Agency //
            //===================================================//
            if (selected_carrier == 'All Carriers' && selected_month == 'All Months' && selected_year == 'All Years' && selected_agency != "All Agencies") {
                singleReportData = groupbyAccount[selected_agency]
                await generalFunction(DWP_YTD_Bar_Chart_Collection, NB_YTD_Bar_Chart_Collection, NB_R12_Bar_Chart_Collection, DWP_R12_Bar_Chart_Collection, singleReportData, monthArray, selected_data, selected_carrier, selected_year, selected_month, selected_agency, currencyCallbackFunction, numericCallbackFunction)
            }
            //====================================================//
            // One Carrier & One Month & One Year & All Agencies //
            //==================================================//
            if (selected_carrier != 'All Carriers' && selected_month != 'All Months' && selected_year != 'All Years' && selected_agency == "All Agencies") {
                selectedMonthReport = groupbyMonth[selected_month]
                let groupbyCarrier = _.groupBy(selectedMonthReport, "Carrier")
                let ReportData = groupbyCarrier[selected_carrier]
                let groupbyYear = _.groupBy(ReportData, "Report_Year")
                let singleReportData = groupbyYear[selected_year]
                await generalFunction(DWP_YTD_Bar_Chart_Collection, NB_YTD_Bar_Chart_Collection, NB_R12_Bar_Chart_Collection, DWP_R12_Bar_Chart_Collection, singleReportData, monthArray, selected_data, selected_carrier, selected_year, selected_month, selected_agency, currencyCallbackFunction, numericCallbackFunction)
            }
            //==================================================//
            // One Carrier & One Month & One Year & One Agency //
            //================================================//
            if (selected_carrier != 'All Carriers' && selected_month != 'All Months' && selected_year != 'All Years' && selected_agency != "All Agencies") {
                selectedMonthReport = groupbyMonth[selected_month]
                let groupbyCarrier = _.groupBy(selectedMonthReport, "Carrier")
                let ReportData = groupbyCarrier[selected_carrier]
                let groupbyYear = _.groupBy(ReportData, "Report_Year")
                let ReportData2 = groupbyYear[selected_year]
                let groupbyAccount = _.groupBy(ReportData2, "Account_Name")
                let singleReportData = groupbyAccount[selected_agency]
                await generalFunction(DWP_YTD_Bar_Chart_Collection, NB_YTD_Bar_Chart_Collection, NB_R12_Bar_Chart_Collection, DWP_R12_Bar_Chart_Collection, singleReportData, monthArray, selected_data, selected_carrier, selected_year, selected_month, selected_agency, currencyCallbackFunction, numericCallbackFunction)
            }

            //=====================================================//
            // One Carrier & One Month & All Years & All Agencies //
            //===================================================//
            if (selected_carrier != 'All Carriers' && selected_month != 'All Months' && selected_year == 'All Years' && selected_agency == "All Agencies") {
                selectedMonthReport = groupbyMonth[selected_month]
                // Collection grouped by Month //
                let groupbyCarrier = _.groupBy(selectedMonthReport, "Carrier")
                // Report of Selected Carrier nad Selected Month
                let singleReportData = groupbyCarrier[selected_carrier]
                await generalFunction(DWP_YTD_Bar_Chart_Collection, NB_YTD_Bar_Chart_Collection, NB_R12_Bar_Chart_Collection, DWP_R12_Bar_Chart_Collection, singleReportData, monthArray, selected_data, selected_carrier, selected_year, selected_month, selected_agency, currencyCallbackFunction, numericCallbackFunction)
            }
            //===================================================//
            // One Carrier & One Month & All Years & One Agency //
            //==================================================//
            if (selected_carrier != 'All Carriers' && selected_month != 'All Months' && selected_year == 'All Years' && selected_agency != "All Agencies") {
                selectedMonthReport = groupbyMonth[selected_month]
                // Collection grouped by Month //
                let groupbyCarrier = _.groupBy(selectedMonthReport, "Carrier")
                // Report of Selected Carrier nad Selected Month
                let ReportData = groupbyCarrier[selected_carrier]
                let groupbyYear = _.groupBy(ReportData, "Account_Name")
                let singleReportData = groupbyYear[selected_agency]
                await generalFunction(DWP_YTD_Bar_Chart_Collection, NB_YTD_Bar_Chart_Collection, NB_R12_Bar_Chart_Collection, DWP_R12_Bar_Chart_Collection, singleReportData, monthArray, selected_data, selected_carrier, selected_year, selected_month, selected_agency, currencyCallbackFunction, numericCallbackFunction)
            }
            //======================================================//
            // All Carriers & All Months & One Year & All Agencies //
            //====================================================//
            if (selected_carrier == 'All Carriers' && selected_month == 'All Months' && selected_year != 'All Years' && selected_agency == "All Agencies") {
                // Filter by selected year //
                selectedYearReport = groupbyYear[selected_year]
                await generalFunction(DWP_YTD_Bar_Chart_Collection, NB_YTD_Bar_Chart_Collection, NB_R12_Bar_Chart_Collection, DWP_R12_Bar_Chart_Collection, selectedYearReport, monthArray, selected_data, selected_carrier, selected_year, selected_month, selected_agency, currencyCallbackFunction, numericCallbackFunction)
            }
            //======================================================//
            // All Carriers & All Months & One Year & One Agency //
            //====================================================//
            if (selected_carrier == 'All Carriers' && selected_month == 'All Months' && selected_year != 'All Years' && selected_agency != "All Agencies") {
                selectedYearReport = groupbyYear[selected_year]
                let groupbyAccount = _.groupBy(selectedYearReport, "Account_Name")
                let singleReportData = groupbyAccount[selected_agency]
                await generalFunction(DWP_YTD_Bar_Chart_Collection, NB_YTD_Bar_Chart_Collection, NB_R12_Bar_Chart_Collection, DWP_R12_Bar_Chart_Collection, singleReportData, monthArray, selected_data, selected_carrier, selected_year, selected_month, selected_agency, currencyCallbackFunction, numericCallbackFunction)
            }
            //======================================================//
            // One Carrier & All Months & All Years & All Agencies //
            //====================================================//
            if (selected_carrier != 'All Carriers' && selected_month == 'All Months' && selected_year == 'All Years' && selected_agency == "All Agencies") {
                selectedCarrierReport = groupbyCarrier[selected_carrier]
                // Filtered to only Data from the Selected Carrier
                await generalFunction(DWP_YTD_Bar_Chart_Collection, NB_YTD_Bar_Chart_Collection, NB_R12_Bar_Chart_Collection, DWP_R12_Bar_Chart_Collection, selectedCarrierReport, monthArray, selected_data, selected_carrier, selected_year, selected_month, selected_agency, currencyCallbackFunction, numericCallbackFunction)
            }
            //====================================================//
            // One Carrier & All Months & All Years & One Agency //
            //==================================================//
            if (selected_carrier != 'All Carriers' && selected_month == 'All Months' && selected_year == 'All Years' && selected_agency != "All Agencies") {
                selectedCarrierReport = groupbyCarrier[selected_carrier]
                let groupbyAccount = _.groupBy(selectedCarrierReport, "Account_Name")
                let singleReportData = groupbyAccount[selected_agency]
                // Filtered to only Data from the Selected Carrier
                await generalFunction(DWP_YTD_Bar_Chart_Collection, NB_YTD_Bar_Chart_Collection, NB_R12_Bar_Chart_Collection, DWP_R12_Bar_Chart_Collection, singleReportData, monthArray, selected_data, selected_carrier, selected_year, selected_month, selected_agency, currencyCallbackFunction, numericCallbackFunction)
            }
            //=====================================================//
            // One Carrier & All Months & One Year & All Agencies //
            //===================================================//
            if (selected_carrier != 'All Carriers' && selected_month == 'All Months' && selected_year != 'All Years' && selected_agency == "All Agencies") {
                // Filter by selected year //
                selectedYearReport = groupbyYear[selected_year]
                // Collection grouped by Month //
                let groupbyCarrier = _.groupBy(selectedYearReport, "Carrier")
                singleReportData = groupbyCarrier[selected_carrier]
                await generalFunction(DWP_YTD_Bar_Chart_Collection, NB_YTD_Bar_Chart_Collection, NB_R12_Bar_Chart_Collection, DWP_R12_Bar_Chart_Collection, singleReportData, monthArray, selected_data, selected_carrier, selected_year, selected_month, selected_agency, currencyCallbackFunction, numericCallbackFunction)
            }
            //===================================================//
            // One Carrier & All Months & One Year & One Agency //
            //=================================================//
            if (selected_carrier != 'All Carriers' && selected_month == 'All Months' && selected_year != 'All Years' && selected_agency != "All Agencies") {
                // Filter by selected year //
                selectedYearReport = groupbyYear[selected_year]
                // Collection grouped by Month //
                let groupbyCarrier = _.groupBy(selectedYearReport, "Carrier")
                selectedCarrierReport = groupbyCarrier[selected_carrier]
                let groupbyAccount = _.groupBy(selectedCarrierReport, "Account_Name")
                singleReportData = groupbyAccount[selected_agency]
                await generalFunction(DWP_YTD_Bar_Chart_Collection, NB_YTD_Bar_Chart_Collection, NB_R12_Bar_Chart_Collection, DWP_R12_Bar_Chart_Collection, singleReportData, monthArray, selected_data, selected_carrier, selected_year, selected_month, selected_agency, currencyCallbackFunction, numericCallbackFunction)
            }
            //======================================================//
            // All Carriers & One Month & All Years & All Agencies //
            //====================================================//
            if (selected_carrier == 'All Carriers' && selected_month != 'All Months' && selected_year == 'All Years' && selected_agency == "All Agencies") {
                selectedMonthReport = groupbyMonth[selected_month]
                await generalFunction(DWP_YTD_Bar_Chart_Collection, NB_YTD_Bar_Chart_Collection, NB_R12_Bar_Chart_Collection, DWP_R12_Bar_Chart_Collection, selectedMonthReport, monthArray, selected_data, selected_carrier, selected_year, selected_month, selected_agency, currencyCallbackFunction, numericCallbackFunction)
            }

            //======================================================//
            // All Carriers & One Month & All Years & One Agencies //
            //====================================================//
            if (selected_carrier == 'All Carriers' && selected_month != 'All Months' && selected_year == 'All Years' && selected_agency != "All Agencies") {
                selectedMonthReport = groupbyMonth[selected_month]
                let groupbyAccount = _.groupBy(selectedMonthReport, "Account_Name")
                singleReportData = groupbyAccount[selected_agency]
                await generalFunction(DWP_YTD_Bar_Chart_Collection, NB_YTD_Bar_Chart_Collection, NB_R12_Bar_Chart_Collection, DWP_R12_Bar_Chart_Collection, singleReportData, monthArray, selected_data, selected_carrier, selected_year, selected_month, selected_agency, currencyCallbackFunction, numericCallbackFunction)
            }
            //=====================================================//
            // All Carriers & One Month & One Year & All Agencies //
            //===================================================//
            if (selected_carrier == 'All Carriers' && selected_month != 'All Months' && selected_year != 'All Years' && selected_agency == "All Agencies") {
                selectedYearReport = groupbyYear[selected_year]
                // Collection grouped by Month //
                let groupbyMonth = _.groupBy(selectedYearReport, "Report_Month")
                let singleReportData = groupbyMonth[selected_month]
                await generalFunction(DWP_YTD_Bar_Chart_Collection, NB_YTD_Bar_Chart_Collection, NB_R12_Bar_Chart_Collection, DWP_R12_Bar_Chart_Collection, singleReportData, monthArray, selected_data, selected_carrier, selected_year, selected_month, selected_agency, currencyCallbackFunction, numericCallbackFunction)
            }
            //===================================================//
            // All Carriers & One Month & One Year & One Agency //
            //=================================================//
            if (selected_carrier == 'All Carriers' && selected_month != 'All Months' && selected_year != 'All Years' && selected_agency != "All Agencies") {
                selectedYearReport = groupbyYear[selected_year]
                // Collection grouped by Month //
                let groupbyMonth = _.groupBy(selectedYearReport, "Report_Month")
                let selectedMonthReport = groupbyMonth[selected_month]
                let groupbyAccount = _.groupBy(selectedMonthReport, "Account_Name")
                singleReportData = groupbyAccount[selected_agency]
                await generalFunction(DWP_YTD_Bar_Chart_Collection, NB_YTD_Bar_Chart_Collection, NB_R12_Bar_Chart_Collection, DWP_R12_Bar_Chart_Collection, singleReportData, monthArray, selected_data, selected_carrier, selected_year, selected_month, selected_agency, currencyCallbackFunction, numericCallbackFunction)
            }
        })//=====================================//
        // End of Carrier Select Click Function //
        //=====================================//
        //==============================//
        // Year Select Change Function //
        //============================//
        $(".year_select").on("change", async function () {
            $(".DWP_YTD").show()
            $(".DWP_R12").show()
            // If Warning Modal is Visible
            if ($(".warning-modal").is(":visible")) {
                $(".warning-modal").hide()
            }
            // If YTD Tab is Active
            if ($("#YTD_Tab").hasClass('active') == true) {
                $("#YTD").show()
            }
            // If R12 Tab is Active
            if ($("#R12_Tab").hasClass('active') == true) {
                $("#R12").show()
            }
            // Get Selected Data Value
            let selected_data = await getSelectedData()
            // Get Selected Carrier Value
            let selected_carrier = await getSelectedCarrier()
            // Get Selected Month Value
            let selected_month = await getSelectedMonth()
            // Get Selected Year Value
            let selected_year = await getSelectedYear(yearsArray)
            // Get Selected Year Value
            let selected_agency = await getSelectedAgency(agencyArray)
            //=======================================================//
            // All Carriers & All Months & All Years & All Agencies //
            //=====================================================//
            if (selected_carrier == 'All Carriers' && selected_month == 'All Months' && selected_year == 'All Years' && selected_agency == "All Agencies") {
                await generalFunction(DWP_YTD_Bar_Chart_Collection, NB_YTD_Bar_Chart_Collection, NB_R12_Bar_Chart_Collection, DWP_R12_Bar_Chart_Collection, monthAggregateObject, monthArray, selected_data, selected_carrier, selected_year, selected_month, selected_agency, currencyCallbackFunction, numericCallbackFunction)
            }
            //=====================================================//
            // All Carriers & All Months & All Years & One Agency //
            //===================================================//
            if (selected_carrier == 'All Carriers' && selected_month == 'All Months' && selected_year == 'All Years' && selected_agency != "All Agencies") {
                singleReportData = groupbyAccount[selected_agency]
                await generalFunction(DWP_YTD_Bar_Chart_Collection, NB_YTD_Bar_Chart_Collection, NB_R12_Bar_Chart_Collection, DWP_R12_Bar_Chart_Collection, singleReportData, monthArray, selected_data, selected_carrier, selected_year, selected_month, selected_agency, currencyCallbackFunction, numericCallbackFunction)
            }
            //====================================================//
            // One Carrier & One Month & One Year & All Agencies //
            //==================================================//
            if (selected_carrier != 'All Carriers' && selected_month != 'All Months' && selected_year != 'All Years' && selected_agency == "All Agencies") {
                selectedMonthReport = groupbyMonth[selected_month]
                let groupbyCarrier = _.groupBy(selectedMonthReport, "Carrier")
                let ReportData = groupbyCarrier[selected_carrier]
                let groupbyYear = _.groupBy(ReportData, "Report_Year")
                let singleReportData = groupbyYear[selected_year]
                await generalFunction(DWP_YTD_Bar_Chart_Collection, NB_YTD_Bar_Chart_Collection, NB_R12_Bar_Chart_Collection, DWP_R12_Bar_Chart_Collection, singleReportData, monthArray, selected_data, selected_carrier, selected_year, selected_month, selected_agency, currencyCallbackFunction, numericCallbackFunction)
            }
            //==================================================//
            // One Carrier & One Month & One Year & One Agency //
            //================================================//
            if (selected_carrier != 'All Carriers' && selected_month != 'All Months' && selected_year != 'All Years' && selected_agency != "All Agencies") {
                selectedMonthReport = groupbyMonth[selected_month]
                let groupbyCarrier = _.groupBy(selectedMonthReport, "Carrier")
                let ReportData = groupbyCarrier[selected_carrier]
                let groupbyYear = _.groupBy(ReportData, "Report_Year")
                let ReportData2 = groupbyYear[selected_year]
                let groupbyAccount = _.groupBy(ReportData2, "Account_Name")
                let singleReportData = groupbyAccount[selected_agency]
                await generalFunction(DWP_YTD_Bar_Chart_Collection, NB_YTD_Bar_Chart_Collection, NB_R12_Bar_Chart_Collection, DWP_R12_Bar_Chart_Collection, singleReportData, monthArray, selected_data, selected_carrier, selected_year, selected_month, selected_agency, currencyCallbackFunction, numericCallbackFunction)
            }

            //=====================================================//
            // One Carrier & One Month & All Years & All Agencies //
            //===================================================//
            if (selected_carrier != 'All Carriers' && selected_month != 'All Months' && selected_year == 'All Years' && selected_agency == "All Agencies") {
                selectedMonthReport = groupbyMonth[selected_month]
                // Collection grouped by Month //
                let groupbyCarrier = _.groupBy(selectedMonthReport, "Carrier")
                // Report of Selected Carrier nad Selected Month
                let singleReportData = groupbyCarrier[selected_carrier]
                await generalFunction(DWP_YTD_Bar_Chart_Collection, NB_YTD_Bar_Chart_Collection, NB_R12_Bar_Chart_Collection, DWP_R12_Bar_Chart_Collection, singleReportData, monthArray, selected_data, selected_carrier, selected_year, selected_month, selected_agency, currencyCallbackFunction, numericCallbackFunction)
            }
            //===================================================//
            // One Carrier & One Month & All Years & One Agency //
            //==================================================//
            if (selected_carrier != 'All Carriers' && selected_month != 'All Months' && selected_year == 'All Years' && selected_agency != "All Agencies") {
                selectedMonthReport = groupbyMonth[selected_month]
                // Collection grouped by Month //
                let groupbyCarrier = _.groupBy(selectedMonthReport, "Carrier")
                // Report of Selected Carrier nad Selected Month
                let ReportData = groupbyCarrier[selected_carrier]
                let groupbyYear = _.groupBy(ReportData, "Account_Name")
                let singleReportData = groupbyYear[selected_agency]
                await generalFunction(DWP_YTD_Bar_Chart_Collection, NB_YTD_Bar_Chart_Collection, NB_R12_Bar_Chart_Collection, DWP_R12_Bar_Chart_Collection, singleReportData, monthArray, selected_data, selected_carrier, selected_year, selected_month, selected_agency, currencyCallbackFunction, numericCallbackFunction)
            }
            //======================================================//
            // All Carriers & All Months & One Year & All Agencies //
            //====================================================//
            if (selected_carrier == 'All Carriers' && selected_month == 'All Months' && selected_year != 'All Years' && selected_agency == "All Agencies") {
                // Filter by selected year //
                selectedYearReport = groupbyYear[selected_year]
                await generalFunction(DWP_YTD_Bar_Chart_Collection, NB_YTD_Bar_Chart_Collection, NB_R12_Bar_Chart_Collection, DWP_R12_Bar_Chart_Collection, selectedYearReport, monthArray, selected_data, selected_carrier, selected_year, selected_month, selected_agency, currencyCallbackFunction, numericCallbackFunction)
            }
            //======================================================//
            // All Carriers & All Months & One Year & One Agency //
            //====================================================//
            if (selected_carrier == 'All Carriers' && selected_month == 'All Months' && selected_year != 'All Years' && selected_agency != "All Agencies") {
                selectedYearReport = groupbyYear[selected_year]
                let groupbyAccount = _.groupBy(selectedYearReport, "Account_Name")
                let singleReportData = groupbyAccount[selected_agency]
                await generalFunction(DWP_YTD_Bar_Chart_Collection, NB_YTD_Bar_Chart_Collection, NB_R12_Bar_Chart_Collection, DWP_R12_Bar_Chart_Collection, singleReportData, monthArray, selected_data, selected_carrier, selected_year, selected_month, selected_agency, currencyCallbackFunction, numericCallbackFunction)
            }
            //======================================================//
            // One Carrier & All Months & All Years & All Agencies //
            //====================================================//
            if (selected_carrier != 'All Carriers' && selected_month == 'All Months' && selected_year == 'All Years' && selected_agency == "All Agencies") {
                selectedCarrierReport = groupbyCarrier[selected_carrier]
                // Filtered to only Data from the Selected Carrier
                await generalFunction(DWP_YTD_Bar_Chart_Collection, NB_YTD_Bar_Chart_Collection, NB_R12_Bar_Chart_Collection, DWP_R12_Bar_Chart_Collection, selectedCarrierReport, monthArray, selected_data, selected_carrier, selected_year, selected_month, selected_agency, currencyCallbackFunction, numericCallbackFunction)
            }
            //====================================================//
            // One Carrier & All Months & All Years & One Agency //
            //==================================================//
            if (selected_carrier != 'All Carriers' && selected_month == 'All Months' && selected_year == 'All Years' && selected_agency != "All Agencies") {
                selectedCarrierReport = groupbyCarrier[selected_carrier]
                let groupbyAccount = _.groupBy(selectedCarrierReport, "Account_Name")
                let singleReportData = groupbyAccount[selected_agency]
                // Filtered to only Data from the Selected Carrier
                await generalFunction(DWP_YTD_Bar_Chart_Collection, NB_YTD_Bar_Chart_Collection, NB_R12_Bar_Chart_Collection, DWP_R12_Bar_Chart_Collection, singleReportData, monthArray, selected_data, selected_carrier, selected_year, selected_month, selected_agency, currencyCallbackFunction, numericCallbackFunction)
            }
            //=====================================================//
            // One Carrier & All Months & One Year & All Agencies //
            //===================================================//
            if (selected_carrier != 'All Carriers' && selected_month == 'All Months' && selected_year != 'All Years' && selected_agency == "All Agencies") {
                // Filter by selected year //
                selectedYearReport = groupbyYear[selected_year]
                // Collection grouped by Month //
                let groupbyCarrier = _.groupBy(selectedYearReport, "Carrier")
                singleReportData = groupbyCarrier[selected_carrier]
                await generalFunction(DWP_YTD_Bar_Chart_Collection, NB_YTD_Bar_Chart_Collection, NB_R12_Bar_Chart_Collection, DWP_R12_Bar_Chart_Collection, singleReportData, monthArray, selected_data, selected_carrier, selected_year, selected_month, selected_agency, currencyCallbackFunction, numericCallbackFunction)
            }
            //===================================================//
            // One Carrier & All Months & One Year & One Agency //
            //=================================================//
            if (selected_carrier != 'All Carriers' && selected_month == 'All Months' && selected_year != 'All Years' && selected_agency != "All Agencies") {
                // Filter by selected year //
                selectedYearReport = groupbyYear[selected_year]
                // Collection grouped by Month //
                let groupbyCarrier = _.groupBy(selectedYearReport, "Carrier")
                selectedCarrierReport = groupbyCarrier[selected_carrier]
                let groupbyAccount = _.groupBy(selectedCarrierReport, "Account_Name")
                singleReportData = groupbyAccount[selected_agency]
                await generalFunction(DWP_YTD_Bar_Chart_Collection, NB_YTD_Bar_Chart_Collection, NB_R12_Bar_Chart_Collection, DWP_R12_Bar_Chart_Collection, singleReportData, monthArray, selected_data, selected_carrier, selected_year, selected_month, selected_agency, currencyCallbackFunction, numericCallbackFunction)
            }
            //======================================================//
            // All Carriers & One Month & All Years & All Agencies //
            //====================================================//
            if (selected_carrier == 'All Carriers' && selected_month != 'All Months' && selected_year == 'All Years' && selected_agency == "All Agencies") {
                selectedMonthReport = groupbyMonth[selected_month]
                await generalFunction(DWP_YTD_Bar_Chart_Collection, NB_YTD_Bar_Chart_Collection, NB_R12_Bar_Chart_Collection, DWP_R12_Bar_Chart_Collection, selectedMonthReport, monthArray, selected_data, selected_carrier, selected_year, selected_month, selected_agency, currencyCallbackFunction, numericCallbackFunction)
            }

            //======================================================//
            // All Carriers & One Month & All Years & One Agencies //
            //====================================================//
            if (selected_carrier == 'All Carriers' && selected_month != 'All Months' && selected_year == 'All Years' && selected_agency != "All Agencies") {
                selectedMonthReport = groupbyMonth[selected_month]
                let groupbyAccount = _.groupBy(selectedMonthReport, "Account_Name")
                singleReportData = groupbyAccount[selected_agency]
                await generalFunction(DWP_YTD_Bar_Chart_Collection, NB_YTD_Bar_Chart_Collection, NB_R12_Bar_Chart_Collection, DWP_R12_Bar_Chart_Collection, singleReportData, monthArray, selected_data, selected_carrier, selected_year, selected_month, selected_agency, currencyCallbackFunction, numericCallbackFunction)
            }
            //=====================================================//
            // All Carriers & One Month & One Year & All Agencies //
            //===================================================//
            if (selected_carrier == 'All Carriers' && selected_month != 'All Months' && selected_year != 'All Years' && selected_agency == "All Agencies") {
                selectedYearReport = groupbyYear[selected_year]
                // Collection grouped by Month //
                let groupbyMonth = _.groupBy(selectedYearReport, "Report_Month")
                let singleReportData = groupbyMonth[selected_month]
                await generalFunction(DWP_YTD_Bar_Chart_Collection, NB_YTD_Bar_Chart_Collection, NB_R12_Bar_Chart_Collection, DWP_R12_Bar_Chart_Collection, singleReportData, monthArray, selected_data, selected_carrier, selected_year, selected_month, selected_agency, currencyCallbackFunction, numericCallbackFunction)
            }
            //===================================================//
            // All Carriers & One Month & One Year & One Agency //
            //=================================================//
            if (selected_carrier == 'All Carriers' && selected_month != 'All Months' && selected_year != 'All Years' && selected_agency != "All Agencies") {
                selectedYearReport = groupbyYear[selected_year]
                // Collection grouped by Month //
                let groupbyMonth = _.groupBy(selectedYearReport, "Report_Month")
                let selectedMonthReport = groupbyMonth[selected_month]
                let groupbyAccount = _.groupBy(selectedMonthReport, "Account_Name")
                singleReportData = groupbyAccount[selected_agency]
                await generalFunction(DWP_YTD_Bar_Chart_Collection, NB_YTD_Bar_Chart_Collection, NB_R12_Bar_Chart_Collection, DWP_R12_Bar_Chart_Collection, singleReportData, monthArray, selected_data, selected_carrier, selected_year, selected_month, selected_agency, currencyCallbackFunction, numericCallbackFunction)
            }
        })
        //================================//
        // Agency Select Change Function //
        //==============================//
        $(".agency_select").on("change", async function () {
            $(".DWP_YTD").show()
            $(".DWP_R12").show()
            // If Warning Modal is Visible
            if ($(".warning-modal").is(":visible")) {
                $(".warning-modal").hide()
            }
            // If YTD Tab is Active
            if ($("#YTD_Tab").hasClass('active') == true) {
                $("#YTD").show()
            }
            // If R12 Tab is Active
            if ($("#R12_Tab").hasClass('active') == true) {
                $("#R12").show()
            }
            // Get Selected Data Value
            let selected_data = await getSelectedData()
            // Get Selected Carrier Value
            let selected_carrier = await getSelectedCarrier()
            // Get Selected Month Value
            let selected_month = await getSelectedMonth()
            // Get Selected Year Value
            let selected_year = await getSelectedYear(yearsArray)
            // Get Selected Year Value
            let selected_agency = await getSelectedAgency(agencyArray)
            //=======================================================//
            // All Carriers & All Months & All Years & All Agencies //
            //=====================================================//
            if (selected_carrier == 'All Carriers' && selected_month == 'All Months' && selected_year == 'All Years' && selected_agency == "All Agencies") {
                await generalFunction(DWP_YTD_Bar_Chart_Collection, NB_YTD_Bar_Chart_Collection, NB_R12_Bar_Chart_Collection, DWP_R12_Bar_Chart_Collection, monthAggregateObject, monthArray, selected_data, selected_carrier, selected_year, selected_month, selected_agency, currencyCallbackFunction, numericCallbackFunction)
            }
            //=====================================================//
            // All Carriers & All Months & All Years & One Agency //
            //===================================================//
            if (selected_carrier == 'All Carriers' && selected_month == 'All Months' && selected_year == 'All Years' && selected_agency != "All Agencies") {
                singleReportData = groupbyAccount[selected_agency]
                await generalFunction(DWP_YTD_Bar_Chart_Collection, NB_YTD_Bar_Chart_Collection, NB_R12_Bar_Chart_Collection, DWP_R12_Bar_Chart_Collection, singleReportData, monthArray, selected_data, selected_carrier, selected_year, selected_month, selected_agency, currencyCallbackFunction, numericCallbackFunction)
            }
            //====================================================//
            // One Carrier & One Month & One Year & All Agencies //
            //==================================================//
            if (selected_carrier != 'All Carriers' && selected_month != 'All Months' && selected_year != 'All Years' && selected_agency == "All Agencies") {
                selectedMonthReport = groupbyMonth[selected_month]
                let groupbyCarrier = _.groupBy(selectedMonthReport, "Carrier")
                let ReportData = groupbyCarrier[selected_carrier]
                let groupbyYear = _.groupBy(ReportData, "Report_Year")
                let singleReportData = groupbyYear[selected_year]
                await generalFunction(DWP_YTD_Bar_Chart_Collection, NB_YTD_Bar_Chart_Collection, NB_R12_Bar_Chart_Collection, DWP_R12_Bar_Chart_Collection, singleReportData, monthArray, selected_data, selected_carrier, selected_year, selected_month, selected_agency, currencyCallbackFunction, numericCallbackFunction)
            }
            //==================================================//
            // One Carrier & One Month & One Year & One Agency //
            //================================================//
            if (selected_carrier != 'All Carriers' && selected_month != 'All Months' && selected_year != 'All Years' && selected_agency != "All Agencies") {
                selectedMonthReport = groupbyMonth[selected_month]
                let groupbyCarrier = _.groupBy(selectedMonthReport, "Carrier")
                let ReportData = groupbyCarrier[selected_carrier]
                let groupbyYear = _.groupBy(ReportData, "Report_Year")
                let ReportData2 = groupbyYear[selected_year]
                let groupbyAccount = _.groupBy(ReportData2, "Account_Name")
                let singleReportData = groupbyAccount[selected_agency]
                await generalFunction(DWP_YTD_Bar_Chart_Collection, NB_YTD_Bar_Chart_Collection, NB_R12_Bar_Chart_Collection, DWP_R12_Bar_Chart_Collection, singleReportData, monthArray, selected_data, selected_carrier, selected_year, selected_month, selected_agency, currencyCallbackFunction, numericCallbackFunction)
            }

            //=====================================================//
            // One Carrier & One Month & All Years & All Agencies //
            //===================================================//
            if (selected_carrier != 'All Carriers' && selected_month != 'All Months' && selected_year == 'All Years' && selected_agency == "All Agencies") {
                selectedMonthReport = groupbyMonth[selected_month]
                // Collection grouped by Month //
                let groupbyCarrier = _.groupBy(selectedMonthReport, "Carrier")
                // Report of Selected Carrier nad Selected Month
                let singleReportData = groupbyCarrier[selected_carrier]
                await generalFunction(DWP_YTD_Bar_Chart_Collection, NB_YTD_Bar_Chart_Collection, NB_R12_Bar_Chart_Collection, DWP_R12_Bar_Chart_Collection, singleReportData, monthArray, selected_data, selected_carrier, selected_year, selected_month, selected_agency, currencyCallbackFunction, numericCallbackFunction)
            }
            //===================================================//
            // One Carrier & One Month & All Years & One Agency //
            //==================================================//
            if (selected_carrier != 'All Carriers' && selected_month != 'All Months' && selected_year == 'All Years' && selected_agency != "All Agencies") {
                selectedMonthReport = groupbyMonth[selected_month]
                // Collection grouped by Month //
                let groupbyCarrier = _.groupBy(selectedMonthReport, "Carrier")
                // Report of Selected Carrier nad Selected Month
                let ReportData = groupbyCarrier[selected_carrier]
                let groupbyYear = _.groupBy(ReportData, "Account_Name")
                let singleReportData = groupbyYear[selected_agency]
                await generalFunction(DWP_YTD_Bar_Chart_Collection, NB_YTD_Bar_Chart_Collection, NB_R12_Bar_Chart_Collection, DWP_R12_Bar_Chart_Collection, singleReportData, monthArray, selected_data, selected_carrier, selected_year, selected_month, selected_agency, currencyCallbackFunction, numericCallbackFunction)
            }
            //======================================================//
            // All Carriers & All Months & One Year & All Agencies //
            //====================================================//
            if (selected_carrier == 'All Carriers' && selected_month == 'All Months' && selected_year != 'All Years' && selected_agency == "All Agencies") {
                // Filter by selected year //
                selectedYearReport = groupbyYear[selected_year]
                await generalFunction(DWP_YTD_Bar_Chart_Collection, NB_YTD_Bar_Chart_Collection, NB_R12_Bar_Chart_Collection, DWP_R12_Bar_Chart_Collection, selectedYearReport, monthArray, selected_data, selected_carrier, selected_year, selected_month, selected_agency, currencyCallbackFunction, numericCallbackFunction)
            }
            //======================================================//
            // All Carriers & All Months & One Year & One Agency //
            //====================================================//
            if (selected_carrier == 'All Carriers' && selected_month == 'All Months' && selected_year != 'All Years' && selected_agency != "All Agencies") {
                selectedYearReport = groupbyYear[selected_year]
                let groupbyAccount = _.groupBy(selectedYearReport, "Account_Name")
                let singleReportData = groupbyAccount[selected_agency]
                await generalFunction(DWP_YTD_Bar_Chart_Collection, NB_YTD_Bar_Chart_Collection, NB_R12_Bar_Chart_Collection, DWP_R12_Bar_Chart_Collection, singleReportData, monthArray, selected_data, selected_carrier, selected_year, selected_month, selected_agency, currencyCallbackFunction, numericCallbackFunction)
            }
            //======================================================//
            // One Carrier & All Months & All Years & All Agencies //
            //====================================================//
            if (selected_carrier != 'All Carriers' && selected_month == 'All Months' && selected_year == 'All Years' && selected_agency == "All Agencies") {
                selectedCarrierReport = groupbyCarrier[selected_carrier]
                // Filtered to only Data from the Selected Carrier
                await generalFunction(DWP_YTD_Bar_Chart_Collection, NB_YTD_Bar_Chart_Collection, NB_R12_Bar_Chart_Collection, DWP_R12_Bar_Chart_Collection, selectedCarrierReport, monthArray, selected_data, selected_carrier, selected_year, selected_month, selected_agency, currencyCallbackFunction, numericCallbackFunction)
            }
            //====================================================//
            // One Carrier & All Months & All Years & One Agency //
            //==================================================//
            if (selected_carrier != 'All Carriers' && selected_month == 'All Months' && selected_year == 'All Years' && selected_agency != "All Agencies") {
                selectedCarrierReport = groupbyCarrier[selected_carrier]
                let groupbyAccount = _.groupBy(selectedCarrierReport, "Account_Name")
                let singleReportData = groupbyAccount[selected_agency]
                // Filtered to only Data from the Selected Carrier
                await generalFunction(DWP_YTD_Bar_Chart_Collection, NB_YTD_Bar_Chart_Collection, NB_R12_Bar_Chart_Collection, DWP_R12_Bar_Chart_Collection, singleReportData, monthArray, selected_data, selected_carrier, selected_year, selected_month, selected_agency, currencyCallbackFunction, numericCallbackFunction)
            }
            //=====================================================//
            // One Carrier & All Months & One Year & All Agencies //
            //===================================================//
            if (selected_carrier != 'All Carriers' && selected_month == 'All Months' && selected_year != 'All Years' && selected_agency == "All Agencies") {
                // Filter by selected year //
                selectedYearReport = groupbyYear[selected_year]
                // Collection grouped by Month //
                let groupbyCarrier = _.groupBy(selectedYearReport, "Carrier")
                singleReportData = groupbyCarrier[selected_carrier]
                await generalFunction(DWP_YTD_Bar_Chart_Collection, NB_YTD_Bar_Chart_Collection, NB_R12_Bar_Chart_Collection, DWP_R12_Bar_Chart_Collection, singleReportData, monthArray, selected_data, selected_carrier, selected_year, selected_month, selected_agency, currencyCallbackFunction, numericCallbackFunction)
            }
            //===================================================//
            // One Carrier & All Months & One Year & One Agency //
            //=================================================//
            if (selected_carrier != 'All Carriers' && selected_month == 'All Months' && selected_year != 'All Years' && selected_agency != "All Agencies") {
                // Filter by selected year //
                selectedYearReport = groupbyYear[selected_year]
                // Collection grouped by Month //
                let groupbyCarrier = _.groupBy(selectedYearReport, "Carrier")
                selectedCarrierReport = groupbyCarrier[selected_carrier]
                let groupbyAccount = _.groupBy(selectedCarrierReport, "Account_Name")
                singleReportData = groupbyAccount[selected_agency]
                await generalFunction(DWP_YTD_Bar_Chart_Collection, NB_YTD_Bar_Chart_Collection, NB_R12_Bar_Chart_Collection, DWP_R12_Bar_Chart_Collection, singleReportData, monthArray, selected_data, selected_carrier, selected_year, selected_month, selected_agency, currencyCallbackFunction, numericCallbackFunction)
            }
            //======================================================//
            // All Carriers & One Month & All Years & All Agencies //
            //====================================================//
            if (selected_carrier == 'All Carriers' && selected_month != 'All Months' && selected_year == 'All Years' && selected_agency == "All Agencies") {
                selectedMonthReport = groupbyMonth[selected_month]
                await generalFunction(DWP_YTD_Bar_Chart_Collection, NB_YTD_Bar_Chart_Collection, NB_R12_Bar_Chart_Collection, DWP_R12_Bar_Chart_Collection, selectedMonthReport, monthArray, selected_data, selected_carrier, selected_year, selected_month, selected_agency, currencyCallbackFunction, numericCallbackFunction)
            }

            //======================================================//
            // All Carriers & One Month & All Years & One Agencies //
            //====================================================//
            if (selected_carrier == 'All Carriers' && selected_month != 'All Months' && selected_year == 'All Years' && selected_agency != "All Agencies") {
                selectedMonthReport = groupbyMonth[selected_month]
                let groupbyAccount = _.groupBy(selectedMonthReport, "Account_Name")
                singleReportData = groupbyAccount[selected_agency]
                await generalFunction(DWP_YTD_Bar_Chart_Collection, NB_YTD_Bar_Chart_Collection, NB_R12_Bar_Chart_Collection, DWP_R12_Bar_Chart_Collection, singleReportData, monthArray, selected_data, selected_carrier, selected_year, selected_month, selected_agency, currencyCallbackFunction, numericCallbackFunction)
            }
            //=====================================================//
            // All Carriers & One Month & One Year & All Agencies //
            //===================================================//
            if (selected_carrier == 'All Carriers' && selected_month != 'All Months' && selected_year != 'All Years' && selected_agency == "All Agencies") {
                selectedYearReport = groupbyYear[selected_year]
                // Collection grouped by Month //
                let groupbyMonth = _.groupBy(selectedYearReport, "Report_Month")
                let singleReportData = groupbyMonth[selected_month]
                await generalFunction(DWP_YTD_Bar_Chart_Collection, NB_YTD_Bar_Chart_Collection, NB_R12_Bar_Chart_Collection, DWP_R12_Bar_Chart_Collection, singleReportData, monthArray, selected_data, selected_carrier, selected_year, selected_month, selected_agency, currencyCallbackFunction, numericCallbackFunction)
            }
            //===================================================//
            // All Carriers & One Month & One Year & One Agency //
            //=================================================//
            if (selected_carrier == 'All Carriers' && selected_month != 'All Months' && selected_year != 'All Years' && selected_agency != "All Agencies") {
                selectedYearReport = groupbyYear[selected_year]
                // Collection grouped by Month //
                let groupbyMonth = _.groupBy(selectedYearReport, "Report_Month")
                let selectedMonthReport = groupbyMonth[selected_month]
                let groupbyAccount = _.groupBy(selectedMonthReport, "Account_Name")
                singleReportData = groupbyAccount[selected_agency]
                await generalFunction(DWP_YTD_Bar_Chart_Collection, NB_YTD_Bar_Chart_Collection, NB_R12_Bar_Chart_Collection, DWP_R12_Bar_Chart_Collection, singleReportData, monthArray, selected_data, selected_carrier, selected_year, selected_month, selected_agency, currencyCallbackFunction, numericCallbackFunction)
            }
        })//=====================================//
        // End of Carrier Select Click Function //
        //=====================================//
    })
    ZOHO.embeddedApp.init()
});