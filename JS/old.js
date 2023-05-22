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
        let memberDataConsolidatedResponse = await getMemberDataConsolidatedRecords();
        console.log("Member Data Consolidated Response")
        console.log(memberDataConsolidatedResponse)
        // Run Function & Declare Response from Function as Variable //
        let memberConsolidatedObject = await createMemberConsolidatedObject(memberDataConsolidatedResponse);
        let globalObject = memberConsolidatedObject["Data"]
        console.log("Global Object")
        console.log(globalObject)
        // Append Report Year to the Filter by Year Selector //
        const yearsArray = await appendYears(globalObject)
        console.log("YEARS ARRAY")
        console.log(yearsArray)

        //=================================//
        // "Most Rcent Report Months Tab" //
        let mostRecentData = await mostRecent(globalObject)
        // HTML Collection of Grid in Most Recent Report Months       
        let gridItems = $(".grid-item")
        await appendReportMonths(gridItems, mostRecentData)
        await noReportMonth(gridItems)

        let groupbyMonth = _.groupBy(globalObject, "Report_Month")
        let groupbyYear = _.groupBy(globalObject, "Report_Year")
        let groupbyCarrier = _.groupBy(globalObject, "Carrier")

        let monthAggregateObject = await aggregate(groupbyMonth, monthArray)
        let yearAggregateObject = await aggregate(groupbyYear, yearsArray)
        let carrierAggregateObject = await aggregate(groupbyCarrier, carrierArray)


        let All_Carriers_YTD_DWP_Array = monthAggregateObject["YTD_DWP"]
        let All_Carriers_YTD_NB_DWP_Array = monthAggregateObject["YTD_NB_DWP"]
        let All_Carriers_DWP_12MM_Array = monthAggregateObject["DWP_12MM"]
        let All_Carriers_NB_DWP_12MM_Array = monthAggregateObject["NB_DWP_12MM"]
        let All_Carriers_YTD_PIF_Array = monthAggregateObject["YTD_PIF"]
        let All_Carriers_YTD_NB_PIF_Array = monthAggregateObject["YTD_NB_PIF"]
        let All_Carriers_PIF_12MM_Array = monthAggregateObject["PIF_12MM"]
        let All_Carriers_PIF_NB_12MM_Array = monthAggregateObject["PIF_NB_12MM"]
        let All_Carriers_Incurred_Loss_YTD_Array = monthAggregateObject["Incurred_Loss_YTD"]
        let All_Carriers_Incurred_Loss_12MM_Array = monthAggregateObject["Incurred_Loss_12MM"]


        let yearObject = await aggregate(groupbyYear, yearsArray)
        console.log(yearObject)
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
                        data: All_Carriers_YTD_NB_DWP_Array,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
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
                        data: All_Carriers_NB_DWP_12MM_Array,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
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
                        data: All_Carriers_YTD_DWP_Array,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
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
                        data: All_Carriers_DWP_12MM_Array,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
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

        console.log("Group By Month")
        console.log(groupbyMonth)
        console.log("Group By Year")
        console.log(groupbyYear)
        console.log("Group By Carrier")
        console.log(groupbyCarrier)

        console.log("Year Aggregate Object")
        console.log(yearAggregateObject)
        console.log("Month Aggregate Object")
        console.log(monthAggregateObject)
        console.log("Carrier Aggregate Object")
        console.log(carrierAggregateObject)
        //==============================//
        // Data Select Change Function //
        //============================//
        $(".type_of_data_select").on("change", async function () {

            // If YTD Tab is Active
            if ($("#YTD_Tab").hasClass('active') == true) {
                $("#YTD").show()
            }
            // If R12 Tab is Active
            if ($("#R12_Tab").hasClass('active') == true) {
                $("#R12").show()
            }
            // If Warning Modal is Visible
            if ($(".warning-modal").is(":visible")) {
                $(".warning-modal").hide()
            }
            // Get Selected Data Value
            let selected_data = await getSelectedData()
            // Get Selected Carrier Value
            let selected_carrier = await getSelectedCarrier()
            // Get Selected Month Value
            let selected_month = await getSelectedMonth()

            let selected_year = await getSelectedYear()
            console.log(selected_year)

            $(".DWP_YTD").show()
            $(".DWP_R12").show()
            //============================//
            // All Carriers & All Months //
            //==========================//
            if (selected_carrier == 'All Carriers' && selected_month == 'All Months') {
                let xLabel = 'Month'
                // Switch Statement Based on Type of Data Selected
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
            //===========================//
            // One Carrier & All Months //
            //=========================//
            else if (selected_carrier != 'All Carriers' && selected_month == 'All Months') {
                let Carrier_Data_Object = await filterToSelectedCarrierData(monthAggregateObject, selected_carrier)
                let xLabel = 'Month'
                let YTD_DWP_Array = Carrier_Data_Object["YTD_DWP"]
                let YTD_NB_DWP_Array = Carrier_Data_Object["YTD_NB_DWP"]
                let DWP_12MM_Array = Carrier_Data_Object["DWP_12MM"]
                let NB_DWP_12MM_Array = Carrier_Data_Object["NB_DWP_12MM"]
                let YTD_PIF_Array = Carrier_Data_Object["YTD_PIF"]
                let YTD_NB_PIF_Array = Carrier_Data_Object["YTD_NB_PIF"]
                let PIF_12MM_Array = Carrier_Data_Object["PIF_12MM"]
                let PIF_NB_12MM_Array = Carrier_Data_Object["PIF_NB_12MM"]
                let Incurred_Loss_YTD = Carrier_Data_Object["Incurred_Loss_YTD"]
                let Incurred_Loss_12MM = Carrier_Data_Object["Incurred_Loss_12MM"]
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
                        await abstractChangeChart(NB_YTD_Bar_Chart_Collection, chartTitle, Incurred_Loss_YTD, monthArray, xLabel, yLabel, currencyCallbackFunction)
                        //=========================================================//
                        // Reset Rolling 12 New Business Policies In Force Charts //
                        chartTitle = `Rolling 12 Month New Business Incurred Loss (${selected_carrier})`
                        await abstractChangeChart(NB_R12_Bar_Chart_Collection, chartTitle, Incurred_Loss_12MM, monthArray, xLabel, yLabel, currencyCallbackFunction)
                        $(".DWP_YTD").hide()
                        $(".DWP_R12").hide()
                        break;
                }
            }
            //===========================//
            // All Carriers & One Month //
            //=========================//
            else if (selected_carrier == 'All Carriers' && selected_month != 'All Months') {
                let xLabel = 'Carrier'
                selectedMonthReport = groupbyMonth[selected_month]
                selectedMonthReport.sort(await dynamicSort("Carrier"))
                console.log(selectedMonthReport)
                let Carrier_Array = _.map(selectedMonthReport, 'Carrier');
                let YTD_DWP_Array = _.map(selectedMonthReport, 'YTD_DWP');
                let YTD_NB_DWP_Array = _.map(selectedMonthReport, 'YTD_NB_DWP');
                let DWP_12MM_Array = _.map(selectedMonthReport, "DWP_12MM");
                let NB_DWP_12MM_Array = _.map(selectedMonthReport, "NB_DWP_12MM")
                let YTD_PIF_Array = _.map(selectedMonthReport, 'YTD_PIF')
                let YTD_NB_PIF_Array = _.map(selectedMonthReport, 'YTD_NB_PIF')
                let PIF_12MM_Array = _.map(selectedMonthReport, 'PIF_12MM')
                let PIF_NB_12MM_Array = _.map(selectedMonthReport, 'PIF_NB_12MM')
                let Incurred_Loss_YTD = _.map(selectedMonthReport, 'Incurred_Loss_YTD')
                let Incurred_Loss_12MM = _.map(selectedMonthReport, 'Incurred_Loss_12MM')
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
                        await abstractChangeChart(NB_R12_Bar_Chart_Collection, chartTitle, DWP_12MM_Array, Carrier_Array, xLabel, yLabel, currencyCallbackFunction)
                        //=====================================================//
                        // Reset Rolling 12 Direct Written Premium Bar Charts //
                        chartTitle = `Rolling 12 Month Direct Written Premium (${selected_carrier})`
                        await abstractChangeChart(DWP_R12_Bar_Chart_Collection, chartTitle, NB_DWP_12MM_Array, Carrier_Array, xLabel, yLabel, currencyCallbackFunction)
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
            //=================================================//
            // One Carrier & One Month Direct Written Premium //
            //===============================================//
            else if (selected_carrier != 'All Carriers' && selected_month != 'All Months') {
                // Collection grouped by Month //
                let groupbyCarrier = _.groupBy(selectedMonthReport, "Carrier")
                // Report of Selected Carrier nad Selected Month
                let singleReportData = groupbyCarrier[selected_carrier]
                // Null Data Error Handling
                if (singleReportData == null || singleReportData == undefined) {
                    if ($("#YTD_Tab").hasClass('active') == true) {
                        $("#YTD").hide()
                        notification("warning", "No Match")
                    }
                    if ($("#R12_Tab").hasClass('active') == true) {
                        $("#R12").hide()
                        notification("warning", "No Match")
                    }
                }
                else {
                    let month = singleReportData[0].Report_Month
                    let monthArray = Array(month)
                    let xLabel = singleReportData[0].Carrier
                    let YTD_DWP_Array = []
                    YTD_DWP_Array = singleReportData[0].YTD_DWP
                    let YTD_NB_DWP_Array = singleReportData[0].YTD_NB_DWP
                    let DWP_12MM_Array = singleReportData[0].DWP_12MM
                    let NB_DWP_12MM_Array = singleReportData[0].NB_DWP_12MM
                    let YTD_PIF_Array = singleReportData[0].YTD_PIF
                    let YTD_NB_PIF_Array = singleReportData[0].YTD_NB_PIF
                    let PIF_12MM_Array = singleReportData[0].PIF_12MM
                    let PIF_NB_12MM_Array = singleReportData[0].PIF_12MM
                    let Incurred_Loss_YTD_Array = singleReportData[0].Incurred_Loss_YTD
                    let Incurred_Loss_12MM_Array = singleReportData[0].Incurred_Loss_12MM
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
            // Get Value of Selected Type of Data
            let selected_data = await getSelectedData()
            // Get Value of Selected Carrier
            let selected_carrier = await getSelectedCarrier()
            // Get Value of Selected Month
            let selected_month = await getSelectedMonth()

            let selected_year = await getSelectedYear()
            console.log(selected_year)


            // Selected Month Report
            let selectedMonthReport = groupbyMonth[selected_month]
            //============================//
            // All Carriers & All Months //
            //==========================//
            if (selected_carrier == 'All Carriers' && selected_month == 'All Months') {
                let xLabel = 'Month'
                // Switch Statement Based on Type of Data Selected
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
            //===========================//
            // One Carrier & All Months //
            //=========================//
            else if (selected_carrier != 'All Carriers' && selected_month == 'All Months') {
                let Carrier_Data_Object = await filterToSelectedCarrierData(monthAggregateObject, selected_carrier)
                let xLabel = 'Month'
                let YTD_DWP_Array = Carrier_Data_Object["YTD_DWP"]
                let YTD_NB_DWP_Array = Carrier_Data_Object["YTD_NB_DWP"]
                let DWP_12MM_Array = Carrier_Data_Object["DWP_12MM"]
                let NB_DWP_12MM_Array = Carrier_Data_Object["NB_DWP_12MM"]
                let YTD_PIF_Array = Carrier_Data_Object["YTD_PIF"]
                let YTD_NB_PIF_Array = Carrier_Data_Object["YTD_NB_PIF"]
                let PIF_12MM_Array = Carrier_Data_Object["PIF_12MM"]
                let PIF_NB_12MM_Array = Carrier_Data_Object["PIF_NB_12MM"]
                let Incurred_Loss_YTD = Carrier_Data_Object["Incurred_Loss_YTD"]
                let Incurred_Loss_12MM = Carrier_Data_Object["Incurred_Loss_12MM"]
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
                        await abstractChangeChart(NB_YTD_Bar_Chart_Collection, chartTitle, Incurred_Loss_YTD, monthArray, xLabel, yLabel, currencyCallbackFunction)
                        //=========================================================//
                        // Reset Rolling 12 New Business Policies In Force Charts //
                        chartTitle = `Rolling 12 Month New Business Incurred Loss (${selected_carrier})`
                        await abstractChangeChart(NB_R12_Bar_Chart_Collection, chartTitle, Incurred_Loss_12MM, monthArray, xLabel, yLabel, currencyCallbackFunction)
                        $(".DWP_YTD").hide()
                        $(".DWP_R12").hide()
                        break;
                }
            }
            //===========================//
            // All Carriers & One Month //
            //=========================//
            else if (selected_carrier == 'All Carriers' && selected_month != 'All Months') {
                let xLabel = 'Carrier'
                selectedMonthReport = groupbyMonth[selected_month]
                selectedMonthReport.sort(await dynamicSort("Carrier"))
                let Carrier_Array = _.map(selectedMonthReport, 'Carrier');
                let YTD_DWP_Array = _.map(selectedMonthReport, 'YTD_DWP');
                let YTD_NB_DWP_Array = _.map(selectedMonthReport, 'YTD_NB_DWP');
                let DWP_12MM_Array = _.map(selectedMonthReport, "DWP_12MM");
                let NB_DWP_12MM_Array = _.map(selectedMonthReport, "NB_DWP_12MM")
                let YTD_PIF_Array = _.map(selectedMonthReport, 'YTD_PIF')
                let YTD_NB_PIF_Array = _.map(selectedMonthReport, 'YTD_NB_PIF')
                let PIF_12MM_Array = _.map(selectedMonthReport, 'PIF_12MM')
                let PIF_NB_12MM_Array = _.map(selectedMonthReport, 'PIF_NB_12MM')
                let Incurred_Loss_YTD = _.map(selectedMonthReport, 'Incurred_Loss_YTD')
                let Incurred_Loss_12MM = _.map(selectedMonthReport, 'Incurred_Loss_12MM')
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
                        await abstractChangeChart(NB_R12_Bar_Chart_Collection, chartTitle, DWP_12MM_Array, Carrier_Array, xLabel, yLabel, currencyCallbackFunction)
                        //=====================================================//
                        // Reset Rolling 12 Direct Written Premium Bar Charts //
                        chartTitle = `Rolling 12 Month Direct Written Premium (${selected_carrier})`
                        await abstractChangeChart(DWP_R12_Bar_Chart_Collection, chartTitle, NB_DWP_12MM_Array, Carrier_Array, xLabel, yLabel, currencyCallbackFunction)
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
            //=================================================//
            // One Carrier & One Month Direct Written Premium //
            //===============================================//
            else if (selected_carrier != 'All Carriers' && selected_month != 'All Months') {
                // Collection grouped by Month //
                let groupbyCarrier = _.groupBy(selectedMonthReport, "Carrier")
                let singleReportData = groupbyCarrier[selected_carrier]

                console.log("singleReportData")
                console.log(singleReportData)

                // Null Data Error Handling
                if (singleReportData == null || singleReportData == undefined) {
                    console.log("HERE")

                    if ($("#YTD_Tab").hasClass('active') == true) {
                        $("#YTD").hide()
                        notification("warning", "No Match")
                    }
                    if ($("#R12_Tab").hasClass('active') == true) {
                        $("#R12").hide()
                        notification("warning", "No Match")
                    }
                }
                else {
                    let month = singleReportData[0].Report_Month
                    let monthArray = Array(month)
                    let xLabel = singleReportData[0].Carrier
                    let YTD_DWP_Array = []
                    YTD_DWP_Array = singleReportData[0].YTD_DWP
                    let YTD_NB_DWP_Array = singleReportData[0].YTD_NB_DWP
                    let DWP_12MM_Array = singleReportData[0].DWP_12MM
                    let NB_DWP_12MM_Array = singleReportData[0].NB_DWP_12MM
                    let YTD_PIF_Array = singleReportData[0].YTD_PIF
                    let YTD_NB_PIF_Array = singleReportData[0].YTD_NB_PIF
                    let PIF_12MM_Array = singleReportData[0].PIF_12MM
                    let PIF_NB_12MM_Array = singleReportData[0].PIF_12MM
                    let Incurred_Loss_YTD_Array = singleReportData[0].Incurred_Loss_YTD
                    let Incurred_Loss_12MM_Array = singleReportData[0].Incurred_Loss_12MM
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
            // Get Value of Selected Type of Data
            let selected_data = await getSelectedData()
            // Get Value of Selected Carrier
            let selected_carrier = await getSelectedCarrier()
            // Get Value of Selected Month
            let selected_month = await getSelectedMonth()

            let selected_year = await getSelectedYear()
            console.log(selected_year)

            selectedMonthReport = groupbyMonth[selected_month]
            // If the Selected Month Report is not null
            if (selectedMonthReport != null) {
                selectedMonthReport.sort(await dynamicSort("Carrier"))
                Carrier_Array = _.map(selectedMonthReport, 'Carrier');
                YTD_DWP_Array = _.map(selectedMonthReport, 'YTD_DWP');
                YTD_NB_DWP_Array = _.map(selectedMonthReport, 'YTD_NB_DWP');
                DWP_12MM_Array = _.map(selectedMonthReport, "DWP_12MM");
                NB_DWP_12MM_Array = _.map(selectedMonthReport, "NB_DWP_12MM");
                YTD_PIF_Array = _.map(selectedMonthReport, 'YTD_PIF')
                YTD_NB_PIF_Array = _.map(selectedMonthReport, 'YTD_NB_PIF')
                PIF_12MM_Array = _.map(selectedMonthReport, 'PIF_12MM')
                PIF_NB_12MM_Array = _.map(selectedMonthReport, 'PIF_NB_12MM')
                Incurred_Loss_YTD = _.map(selectedMonthReport, 'Incurred_Loss_YTD')
                Incurred_Loss_12MM = _.map(selectedMonthReport, 'Incurred_Loss_12MM')
                Name = _.map(selectedMonthReport, 'Report_Name')
            }
            else {
                // If YTD Tab is Active
                if ($("#YTD_Tab").hasClass('active') == true) {
                    let visibleTabContent = $("#YTD")
                    await warningModalFunction(visibleTabContent)
                }
                // If R12 Tab is Active
                if ($("#R12_Tab").hasClass('active') == true) {
                    visibleTabContent = $("#R12")
                    await warningModalFunction(visibleTabContent)
                }
            }



            // console.log(Carrier_Array)
            // const isNull = (element) => element == null;
            // const index = data.findIndex(isNull);
            // console.log("INDEX")
            // console.log(index)
            // if (index > -1) {
            //     data.splice(index, 1);
            //     dataLabelArray.splice(index, 1);
            // }
            // console.log(data);
            // let ind = []
            // for (let i = 0; i < data.length; i++) {
            //     console.log("Data Type")
            //     console.log(typeof (data[i]))
            //     if (typeof (data[i]) == 'object') {
            //         ind = i
            //         data.splice(i, 1)
            //         dataLabelArray.splice(i, 1);
            //     }
            // }

            // console.log(index)
            // console.log(ind)
            // console.log(dataLabelArray)
            // console.log(test)
            //============================//
            // All Carriers & All Months //
            //==========================//
            if (selected_month == 'All Months' && selected_carrier == 'All Carriers') {
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
            //===========================//
            // All Carriers & One Month //
            //=========================//
            else if (selected_month != 'All Months' && selected_carrier == 'All Carriers') {
                let xLabel = 'Carrier'
                let Carrier_Array = _.map(selectedMonthReport, 'Carrier');
                let YTD_DWP_Array = _.map(selectedMonthReport, 'YTD_DWP');
                let YTD_NB_DWP_Array = _.map(selectedMonthReport, 'YTD_NB_DWP');
                let DWP_12MM_Array = _.map(selectedMonthReport, "DWP_12MM");
                let NB_DWP_12MM_Array = _.map(selectedMonthReport, "NB_DWP_12MM")
                let YTD_PIF_Array = _.map(selectedMonthReport, 'YTD_PIF')
                let YTD_NB_PIF_Array = _.map(selectedMonthReport, 'YTD_NB_PIF')
                let PIF_12MM_Array = _.map(selectedMonthReport, 'PIF_12MM')
                let PIF_NB_12MM_Array = _.map(selectedMonthReport, 'PIF_NB_12MM')
                let Incurred_Loss_YTD = _.map(selectedMonthReport, 'Incurred_Loss_YTD')
                let Incurred_Loss_12MM = _.map(selectedMonthReport, 'Incurred_Loss_12MM')
                let Name = _.map(selectedMonthReport, 'Report_Name')
                console.log(Carrier_Array)
                console.log(YTD_NB_DWP_Array)
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
                        await abstractChangeChart(NB_R12_Bar_Chart_Collection, chartTitle, PIF_NB_12MM_Array, Carrier_Array, xLabel, yLabel, numericCallbackFunction)
                        //=====================================================//
                        // Reset Rolling 12 Direct Written Premium Bar Charts //
                        chartTitle = `Rolling 12 Month Policies In Force (${selected_carrier})`
                        await abstractChangeChart(DWP_R12_Bar_Chart_Collection, chartTitle, PIF_12MM_Array, Carrier_Array, xLabel, yLabel, numericCallbackFunction)
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
                // await warningModalFunction();
            }
            //===========================//
            // One Carrier & All Months //
            //=========================//
            else if (selected_carrier != 'All Carriers' && selected_month == 'All Months') {
                let Carrier_Data_Object = await filterToSelectedCarrierData(monthAggregateObject, selected_carrier)
                let xLabel = 'Month'
                let YTD_DWP_Array = Carrier_Data_Object["YTD_DWP"]
                let YTD_NB_DWP_Array = Carrier_Data_Object["YTD_NB_DWP"]
                let DWP_12MM_Array = Carrier_Data_Object["DWP_12MM"]
                let NB_DWP_12MM_Array = Carrier_Data_Object["NB_DWP_12MM"]
                let YTD_PIF_Array = Carrier_Data_Object["YTD_PIF"]
                let YTD_NB_PIF_Array = Carrier_Data_Object["YTD_NB_PIF"]
                let PIF_12MM_Array = Carrier_Data_Object["PIF_12MM"]
                let PIF_NB_12MM_Array = Carrier_Data_Object["PIF_NB_12MM"]
                let Incurred_Loss_YTD_Array = Carrier_Data_Object["Incurred_Loss_YTD"]
                let Incurred_Loss_12MM_Array = Carrier_Data_Object["Incurred_Loss_12MM"]
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
            //==========================//
            // One Carrier & One Month //
            //========================//
            else if (selected_month != 'All Months' && selected_carrier != 'All Carriers') {
                // Collection grouped by Month //
                let groupbyCarrier = _.groupBy(selectedMonthReport, "Carrier")
                let singleReportData = groupbyCarrier[selected_carrier]
                // Null Data Error Handling
                if (singleReportData == null || singleReportData == undefined) {
                    if ($("#YTD_Tab").hasClass('active') == true) {
                        $("#YTD").hide()
                        notification("warning", "No Match")
                    }
                    if ($("#R12_Tab").hasClass('active') == true) {
                        $("#R12").hide()
                        notification("warning", "No Match")
                    }
                }
                else {
                    let month = singleReportData[0].Report_Month
                    let monthArray = Array(month)
                    let xLabel = singleReportData[0].Carrier
                    let YTD_DWP_Array = singleReportData[0].YTD_DWP
                    let YTD_NB_DWP_Array = singleReportData[0].YTD_NB_DWP
                    let DWP_12MM_Array = singleReportData[0].DWP_12MM
                    let NB_DWP_12MM_Array = singleReportData[0].NB_DWP_12MM
                    let YTD_PIF_Array = singleReportData[0].YTD_PIF
                    let YTD_NB_PIF_Array = singleReportData[0].YTD_NB_PIF
                    let PIF_12MM_Array = singleReportData[0].PIF_12MM
                    let PIF_NB_12MM_Array = singleReportData[0].PIF_12MM
                    let Incurred_Loss_YTD_Array = singleReportData[0].Incurred_Loss_YTD
                    let Incurred_Loss_12MM_Array = singleReportData[0].Incurred_Loss_12MM
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
            // Get Value of Selected Type of Data
            let selected_data = await getSelectedData()
            // Get Value of Selected Carrier
            let selected_carrier = await getSelectedCarrier()
            // Get Value of Selected Month
            let selected_month = await getSelectedMonth()
            // Get Value of Selected Year
            let selected_year = await getSelectedYear()

            // Filter by selected year //
            selectedYearReport = groupbyYear[selected_year]
            console.log("Selected Year Report")
            console.log(selectedYearReport)
            // If the Selected Month Report is not null
            if (selectedYearReport != null) {
                selectedYearReport.sort(await dynamicSort("Carrier"))
                Carrier_Array = _.map(selectedYearReport, 'Carrier');
                Month_Array = _.map(selectedYearReport, "Report_Month")
                console.log(Month_Array)
                YTD_DWP_Array = _.map(selectedYearReport, 'YTD_DWP');
                YTD_NB_DWP_Array = _.map(selectedYearReport, 'YTD_NB_DWP');
                DWP_12MM_Array = _.map(selectedYearReport, "DWP_12MM");
                NB_DWP_12MM_Array = _.map(selectedYearReport, "NB_DWP_12MM");
                YTD_PIF_Array = _.map(selectedYearReport, 'YTD_PIF')
                YTD_NB_PIF_Array = _.map(selectedYearReport, 'YTD_NB_PIF')
                PIF_12MM_Array = _.map(selectedYearReport, 'PIF_12MM')
                PIF_NB_12MM_Array = _.map(selectedYearReport, 'PIF_NB_12MM')
                Incurred_Loss_YTD = _.map(selectedYearReport, 'Incurred_Loss_YTD')
                Incurred_Loss_12MM = _.map(selectedYearReport, 'Incurred_Loss_12MM')
            }
            else {
                // If YTD Tab is Active
                if ($("#YTD_Tab").hasClass('active') == true) {
                    let visibleTabContent = $("#YTD")
                    await warningModalFunction(visibleTabContent)
                }
                // If R12 Tab is Active
                if ($("#R12_Tab").hasClass('active') == true) {
                    visibleTabContent = $("#R12")
                    await warningModalFunction(visibleTabContent)
                }
            }


            // obj.forEach(element => {

            // });
            // for (var key in obj) {
            //     console.log(key)
            //     obj.for


            // }
            //============================//
            // All Carriers & All Months //
            //==========================//
            if (selected_month == 'All Months' && selected_carrier == 'All Carriers' && selected_year == 'All Years') {
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
            //============================//
            // All Carriers & All Months //
            //==========================//
            if (selected_month == 'All Months' && selected_carrier == 'All Carriers' && selected_year != 'All Years') {
                console.log(selectedYearReport)
                console.log(Month_Array)
                console.log(Carrier_Array)

                // YTD_DWP_Array = _.map(selectedYearReport, 'YTD_DWP');
                // YTD_NB_DWP_Array = _.map(selectedYearReport, 'YTD_NB_DWP');
                // DWP_12MM_Array = _.map(selectedYearReport, "DWP_12MM");
                // NB_DWP_12MM_Array = _.map(selectedYearReport, "NB_DWP_12MM");
                // YTD_PIF_Array = _.map(selectedYearReport, 'YTD_PIF')
                // YTD_NB_PIF_Array = _.map(selectedYearReport, 'YTD_NB_PIF')
                // PIF_12MM_Array = _.map(selectedYearReport, 'PIF_12MM')
                // PIF_NB_12MM_Array = _.map(selectedYearReport, 'PIF_NB_12MM')
                // Incurred_Loss_YTD = _.map(selectedYearReport, 'Incurred_Loss_YTD')
                // Incurred_Loss_12MM = _.map(selectedYearReport, 'Incurred_Loss_12MM')


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
            //===========================//
            // All Carriers & One Month //
            //=========================//
            else if (selected_month != 'All Months' && selected_carrier == 'All Carriers') {
                let xLabel = 'Carrier'
                let Carrier_Array = _.map(selectedYearReport, 'Carrier');
                let YTD_DWP_Array = _.map(selectedYearReport, 'YTD_DWP');
                let YTD_NB_DWP_Array = _.map(selectedYearReport, 'YTD_NB_DWP');
                let DWP_12MM_Array = _.map(selectedYearReport, "DWP_12MM");
                let NB_DWP_12MM_Array = _.map(selectedYearReport, "NB_DWP_12MM")
                let YTD_PIF_Array = _.map(selectedYearReport, 'YTD_PIF')
                let YTD_NB_PIF_Array = _.map(selectedYearReport, 'YTD_NB_PIF')
                let PIF_12MM_Array = _.map(selectedYearReport, 'PIF_12MM')
                let PIF_NB_12MM_Array = _.map(selectedYearReport, 'PIF_NB_12MM')
                let Incurred_Loss_YTD = _.map(selectedYearReport, 'Incurred_Loss_YTD')
                let Incurred_Loss_12MM = _.map(selectedYearReport, 'Incurred_Loss_12MM')
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
                        await abstractChangeChart(NB_R12_Bar_Chart_Collection, chartTitle, DWP_12MM_Array, Carrier_Array, xLabel, yLabel, currencyCallbackFunction)
                        //=====================================================//
                        // Reset Rolling 12 Direct Written Premium Bar Charts //
                        chartTitle = `Rolling 12 Month Direct Written Premium (${selected_carrier})`
                        await abstractChangeChart(DWP_R12_Bar_Chart_Collection, chartTitle, NB_DWP_12MM_Array, Carrier_Array, xLabel, yLabel, currencyCallbackFunction)
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
                // await warningModalFunction();
            }
            //===========================//
            // One Carrier & All Months //
            //=========================//
            else if (selected_carrier != 'All Carriers' && selected_month == 'All Months') {
                let Carrier_Data_Object = await filterToSelectedCarrierData(monthAggregateObject, selected_carrier)
                let xLabel = 'Month'
                let YTD_DWP_Array = Carrier_Data_Object["YTD_DWP"]
                let YTD_NB_DWP_Array = Carrier_Data_Object["YTD_NB_DWP"]
                let DWP_12MM_Array = Carrier_Data_Object["DWP_12MM"]
                let NB_DWP_12MM_Array = Carrier_Data_Object["NB_DWP_12MM"]
                let YTD_PIF_Array = Carrier_Data_Object["YTD_PIF"]
                let YTD_NB_PIF_Array = Carrier_Data_Object["YTD_NB_PIF"]
                let PIF_12MM_Array = Carrier_Data_Object["PIF_12MM"]
                let PIF_NB_12MM_Array = Carrier_Data_Object["PIF_NB_12MM"]
                let Incurred_Loss_YTD_Array = Carrier_Data_Object["Incurred_Loss_YTD"]
                let Incurred_Loss_12MM_Array = Carrier_Data_Object["Incurred_Loss_12MM"]
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
            //======================================//
            // One Carrier & One Month & All Years //
            //====================================//
            else if (selected_month != 'All Months' && selected_carrier != 'All Carriers' && selected_year == "All Years") {
                // Collection grouped by Month //
                let groupbyCarrier = _.groupBy(selectedYearReport, "Carrier")
                let singleReportData = groupbyCarrier[selected_carrier]

                console.log("singleReportData")
                console.log(singleReportData)
                // Null Data Error Handling
                if (singleReportData == null || singleReportData == undefined) {
                    if ($("#YTD_Tab").hasClass('active') == true) {
                        $("#YTD").hide()
                        notification("warning", "No Match")
                    }
                    if ($("#R12_Tab").hasClass('active') == true) {
                        $("#R12").hide()
                        notification("warning", "No Match")
                    }
                }
                else {
                    let month = singleReportData[0].Report_Month
                    let monthArray = Array(month)
                    let xLabel = singleReportData[0].Carrier
                    let YTD_DWP_Array = singleReportData[0].YTD_DWP
                    let YTD_NB_DWP_Array = singleReportData[0].YTD_NB_DWP
                    let DWP_12MM_Array = singleReportData[0].DWP_12MM
                    let NB_DWP_12MM_Array = singleReportData[0].NB_DWP_12MM
                    let YTD_PIF_Array = singleReportData[0].YTD_PIF
                    let YTD_NB_PIF_Array = singleReportData[0].YTD_NB_PIF
                    let PIF_12MM_Array = singleReportData[0].PIF_12MM
                    let PIF_NB_12MM_Array = singleReportData[0].PIF_12MM
                    let Incurred_Loss_YTD_Array = singleReportData[0].Incurred_Loss_YTD
                    let Incurred_Loss_12MM_Array = singleReportData[0].Incurred_Loss_12MM
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
                
            }
            //=====================================//
            // One Carrier & One Month & One Year //
            //===================================//
            else if (selected_month != 'All Months' && selected_carrier != 'All Carriers' && selected_year != "All Years") {
                // Collection grouped by Month //
                let groupbyCarrier = _.groupBy(selectedYearReport, "Carrier")
                let singleReportData = groupbyCarrier[selected_carrier]
                console.log("singleReportData")
                console.log(singleReportData)
                
                // Null Data Error Handling
                if (singleReportData == null || singleReportData == undefined) {
                    if ($("#YTD_Tab").hasClass('active') == true) {
                        $("#YTD").hide()
                        notification("warning", "No Match")
                    }
                    if ($("#R12_Tab").hasClass('active') == true) {
                        $("#R12").hide()
                        notification("warning", "No Match")
                    }
                }
                else {
                    let month = singleReportData[0].Report_Month
                    let Month_Array = Array(month)
                    console.log(Month_Array)
                    let xLabel = singleReportData[0].Carrier
                    let YTD_DWP_Array = singleReportData[0].YTD_DWP
                    let YTD_NB_DWP_Array = singleReportData[0].YTD_NB_DWP
                    let DWP_12MM_Array = singleReportData[0].DWP_12MM
                    let NB_DWP_12MM_Array = singleReportData[0].NB_DWP_12MM
                    let YTD_PIF_Array = singleReportData[0].YTD_PIF
                    let YTD_NB_PIF_Array = singleReportData[0].YTD_NB_PIF
                    let PIF_12MM_Array = singleReportData[0].PIF_12MM
                    let PIF_NB_12MM_Array = singleReportData[0].PIF_12MM
                    let Incurred_Loss_YTD_Array = singleReportData[0].Incurred_Loss_YTD
                    let Incurred_Loss_12MM_Array = singleReportData[0].Incurred_Loss_12MM

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
            }
        })
    })
    ZOHO.embeddedApp.init()
});