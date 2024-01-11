/* NwisWeb Javascript plotting library for jQuery and flot.
 *
 * A JavaScript library to retrieve NwisWeb information
 * such as the discrete groundwater measurements for a site(s).
 *
 * version 3.01
 * January 8, 2024
 */
/*
###############################################################################
# Copyright (c) Oregon Water Science Center
#
# Permission is hereby granted, free of charge, to any person obtaining a
# copy of this software and associated documentation files (the "Software"),
# to deal in the Software without restriction, including without limitation
# the rights to use, copy, modify, merge, publish, distribute, sublicense,
# and/or sell copies of the Software, and to permit persons to whom the
# Software is furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included
# in all copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
# OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
# THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
# FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
# DEALINGS IN THE SOFTWARE.
###############################################################################
*/

var indexField = "site_no";

// Parse IV measurements output from iv data service in RDB format
//
function parseIvRDB(dataRDB) {
    //console.log("parseIvRDB");

    var myRe = /^#/;
    var lineRe = /\r?\n/;
    var delimiter = '\t';
    var myData = {};
    var mySiteData = {};
    var myParameterData = {};
    var myAgingData = {};
    var myColumnData = {};
    var mySiteList = [];

    var Fields = [];

    // Parse from header explanations
    //
    var mySiteInfo = /^# Data for the following/;
    var mySiteInfoEnd = /^# --------------/;
    var myParameterInfo = /^# Data provided for site/;
    var myAgingInfo = /^# Data-value qualification codes included in this output/;
    var noDataInfo   = /No sites found matching all criteria/;

    // Parse in lines
    //
    var fileLines = dataRDB.split(lineRe);

    // Column names on header line
    //
    while (fileLines.length > 0) {
        var fileLine = jQuery.trim(fileLines.shift());

        if (fileLine.length < 1) {
            continue;
        }

        // Header portion of input
        //
        if (myRe.test(fileLine)) {
            
            // No site information
            //
            if (noDataInfo.test(fileLine)) {
                // console.log("mySiteData");
                // console.log(mySiteData);

                return {
                    "message": "No sites found matching all criteria",
                    "myData": myData,
                    "mySiteData": mySiteData,
                    "myColumnData": myColumnData,
                    "myParameterData": myParameterData,
                    "myAgingData": myAgingData
                };
            }
            
            // Header portion for site information
            //
            if (mySiteInfo.test(fileLine)) {
                //console.log("mySiteInfo");
                while (fileLines.length > 0) {
                    fileLine = jQuery.trim(fileLines.shift());
                    if (myRe.test(fileLine)) {
                        if (fileLine.length < 5) { break; }
                    }
                    if (mySiteInfoEnd.test(fileLine)) {
                        break;
                    }
                    // console.log("fileLine");
                    // console.log(fileLine);

                    var Fields = fileLine.split(/\s+/);
                    var blank = Fields.shift();
                    var agency_cd = Fields.shift();
                    var site_no = Fields.shift();
                    var station_nm = Fields.join(" ");

                    mySiteData[site_no] = {};
                    mySiteData[site_no].agency_cd = agency_cd;
                    mySiteData[site_no].station_nm = station_nm;
                    mySiteList.push(site_no);
                }
                // console.log("mySiteData");
                // console.log(mySiteData);
            }

            // Header portion for parameter information
            //
            else if (myParameterInfo.test(fileLine)) {
                //console.log("myParameterInfo");
                fileLines.shift(); // skip blank line

                while (fileLines.length > 0) {
                    fileLine = jQuery.trim(fileLines.shift());
                    if (myRe.test(fileLine)) {
                        if (fileLine.length < 5) { break; }
                    }

                    var Fields = fileLine.split(/\s+/);
                    var blank = Fields.shift();
                    var ts_id = Fields.shift();
                    var parameter_cd = Fields.shift();
                    var description = Fields.join(" ");

                    myParameterData[ts_id] = {};
                    myParameterData[ts_id].parameter = parameter_cd;
                    myParameterData[ts_id].description = description;
                }
                //console.log("myParameterData");
                //console.log(myParameterData);
            }

            // Header portion for approval-status
            //
            else if (myAgingInfo.test(fileLine)) {
                //console.log("myAgingInfo");
                while (fileLines.length > 0) {
                    fileLine = jQuery.trim(fileLines.shift());
                    // console.log("fileLine");
                    // console.log(fileLine);
                    if (myRe.test(fileLine)) {
                        if (fileLine.length < 5) { break; }
                    }

                    var Fields = fileLine.split(/\s+/);
                    var blank = Fields.shift();
                    var iv_age_cd = Fields.shift();
                    var description = Fields.join(" ");

                    myAgingData[iv_age_cd] = description;
                }
                // console.log("done myAgingInfo");
                // console.log(myAgingData);
            }
        }

        // Data portion of input
        //
        else {
            site_no = jQuery.trim(mySiteList.shift());
            // console.log("Data portion of input for site " + site_no);

            // Check index column name in file
            //
            var Fields = fileLine.split(delimiter);
            if (jQuery.inArray(indexField, Fields) < 0) {
                var message = "Header line of column names does not contain " + indexField + " column\n";
                message += "Header line contains " + Fields.join(", ");
                openModal("Warning " + message);
                fadeModal(3000);
                return false;
            }
            myColumnData[site_no] = Fields;
            // console.log("myColumns");
            // console.log(site_no);
            // console.log(myColumnData[site_no]);

            // Format line in header portion [skip]
            //
            var fileLine = jQuery.trim(fileLines.shift());

            // Data lines
            //
            var count = 0;
            while (fileLines.length > 0) {
                fileLine = jQuery.trim(fileLines.shift());
                if (myRe.test(fileLine)) {
                    fileLines.unshift(fileLine);
                    break;
                }
                if (fileLine.length > 1) {
                    var Values = fileLine.split(delimiter);
                    var site_no = Values[jQuery.inArray(indexField, Fields)];

                    // Key does not exist [First time seen; create it]
                    //
                    if (typeof myData[site_no] === "undefined") {
                        myData[site_no] = {};
                    }
                    if (typeof myData[site_no][count] === "undefined") {
                        myData[site_no][count] = {};
                    }

                    // Load values
                    //
                    for (var i = 0; i < Fields.length; i++) {
                        var Value = Values[jQuery.inArray(Fields[i], Fields)];
                        if (typeof Value === "undefined" || Value.length < 1) {
                            Value = null;
                        }
                        myData[site_no][count][Fields[i]] = Value;
                    }
                    count++;
                }
            }

            continue;
        }
    }

    // console.log("myData");
    // console.log(myData);

    return {
        "myData": myData,
        "mySiteData": mySiteData,
        "myColumnData": myColumnData,
        "myParameterData": myParameterData,
        "myAgingData": myAgingData
    };

}

// Water-Quality measurements
//
var wqFields = [
    'agency_cd',
    'site_no',
    'sample_dt',
    'sample_tm',
    'sample_end_dt',
    'sample_end_tm',
    'sample_start_time_datum_cd',
    'tm_datum_rlbty_cd',
    'coll_ent_cd',
    'medium_cd',
    'tu_id',
    'body_part_id',
    'parm_cd',
    'remark_cd',
    'result_va',
    'val_qual_tx',
    'meth_cd',
    'dqi_cd',
    'rpt_lev_va',
    'rpt_lev_cd',
    'lab_std_va',
    'anl_ent_cd'
];

// Parse Water-Quality measurements output from NwisWeb request in RDB format
//
function parseWqRDB(dataRDB) {
    //console.log("parseWqRDB");

    var myRe = /^#/;
    var lineRe = /\r?\n/;
    var delimiter = '\t';
    
    var myData = {};
    var myParameters = {};
    var coll_ent_cds = {};
    var remark_cds = {};
    var val_qual_txs = {};
    var meth_cds = {};
    var dqi_cds = {};
    var rpt_lev_cds = {};

    var Fields = [];

    // Parse from header explanations
    //
    var myParameterInfo = /^# To view additional data-quality attributes, output the results using these options/;
    var myPcodesInfo = /^#\s+P\d{5}\s+/;
    var myCollectionInfo = /^# Description of coll_ent_cd and anl_ent_cd/;
    var myRemarkInfo = /^# Description of remark_cd/;
    var myQualAcyInfo = /^# Description of val_qual_tx/;
    var myMethodInfo = /^# Description of meth_cd/;
    var myDqiInfo = /^# Description of dqi_cd/;
    var myReportInfo = /^# Description of rpt_lev_cd:/;

    // Parse in lines
    //
    var fileLines = dataRDB.split(lineRe);

    // Column names on header line
    //
    while (fileLines.length > 0) {
        var fileLine = jQuery.trim(fileLines.shift());
        if (fileLine.length < 1) {
            continue;
        }
        if (!myRe.test(fileLine)) {
            break;
        }

        // Header portion for site status information
        //
        if (myParameterInfo.test(fileLine)) {
            fileLines.shift(); // skip line
            fileLines.shift(); // skip line
            fileLines.shift(); // skip line
            //console.log("Parameter line ");

            while (fileLines.length > 0) {
                fileLine = jQuery.trim(fileLines.shift());
                if (myRe.test(fileLine)) {
                    if (fileLine.length < 5) { break; }
                }
                if (myPcodesInfo.test(fileLine)) {
                    var Fields = fileLine.split(/\s+/);
                    var parameter_cd = Fields[1];
                    myParameters[parameter_cd] = {};
                    myParameters[parameter_cd] = Fields.slice(3).join(" ");
                }
            }
        }

        // Description of coll_ent_cd in header portion
        //
        if (myCollectionInfo.test(fileLine)) {
            //fileLines.shift(); // skip blank line

            while (fileLines.length > 0) {
                fileLine = jQuery.trim(fileLines.shift());
                if (myRe.test(fileLine)) {
                    if (fileLine.length < 5) { break; }
                }

                var Fields = fileLine.split(/\s+/);
                var coll_ent_cd = Fields[1];
                coll_ent_cds[coll_ent_cd] = {};
                coll_ent_cds[coll_ent_cd] = Fields.slice(3).join(" ");
            }
        }

        // Description of remark_cd in header portion
        //
        if (myRemarkInfo.test(fileLine)) {
            //fileLines.shift(); // skip blank line

            while (fileLines.length > 0) {
                fileLine = jQuery.trim(fileLines.shift());
                if (myRe.test(fileLine)) {
                    if (fileLine.length < 5) { break; }
                }

                var Fields = fileLine.split(/\s+/);
                var remark_cd = Fields[1];
                remark_cds[remark_cd] = {};
                remark_cds[remark_cd] = Fields.slice(3).join(" ");
            }
        }

        // Description of val_qual_tx in header portion
        //
        if (myQualAcyInfo.test(fileLine)) {
            //fileLines.shift(); // skip blank line

            while (fileLines.length > 0) {
                fileLine = jQuery.trim(fileLines.shift());
                if (myRe.test(fileLine)) {
                    if (fileLine.length < 5) { break; }
                }

                var Fields = fileLine.split(/\s+/);
                var val_qual_tx = Fields[1];
                val_qual_txs[val_qual_tx] = {};
                val_qual_txs[val_qual_tx] = Fields.slice(3).join(" ");
            }
        }

        // Description of meth_cd in header portion
        //
        if (myMethodInfo.test(fileLine)) {
            fileLines.shift(); // skip blank line

            while (fileLines.length > 0) {
                fileLine = jQuery.trim(fileLines.shift());
                if (myRe.test(fileLine)) {
                    if (fileLine.length < 5) { break; }
                }

                var Fields = fileLine.split(/\s+/);
                var meth_cd = Fields[1];
                meth_cds[meth_cd] = {};
                meth_cds[meth_cd] = Fields.slice(3).join(" ");
            }
        }

        // Description of dqi_cd in header portion
        //
        if (myDqiInfo.test(fileLine)) {
            fileLines.shift(); // skip blank line

            while (fileLines.length > 0) {
                fileLine = jQuery.trim(fileLines.shift());
                if (myRe.test(fileLine)) {
                    if (fileLine.length < 5) { break; }
                }

                var Fields = fileLine.split(/\s+/);
                var dqi_cd = Fields[1];
                dqi_cds[dqi_cd] = {};
                dqi_cds[dqi_cd] = Fields.slice(3).join(" ");
            }
        }

        // Description of rpt_lev_cd in header portion
        //
        if (myReportInfo.test(fileLine)) {
            fileLines.shift(); // skip blank line

            while (fileLines.length > 0) {
                fileLine = jQuery.trim(fileLines.shift());
                if (myRe.test(fileLine)) {
                    if (fileLine.length < 5) { break; }
                }

                var Fields = fileLine.split(/\s+/);
                var rpt_lev_cd = Fields[1];
                rpt_lev_cds[rpt_lev_cd] = {};
                rpt_lev_cds[rpt_lev_cd] = Fields.slice(3).join(" ");
            }
        }
    }

    // Check index column name in file
    //
    var Fields = fileLine.split(delimiter);
    if (jQuery.inArray(indexField, Fields) < 0) {
        var message = "Header line of column names does not contain " + indexField + " column\n";
        message += "Header line contains " + Fields.join(", ");
        message_dialog("Warning", message);
        close_dialog();
        return false;
    }

    // Format line in header portion [skip]
    //
    var fileLine = jQuery.trim(fileLines.shift());

    // Available parameter codes
    //
    var myParamsL = jQuery.map(myParameters, function(element,index) {return index});

    // Data lines
    //
    var count = 0;
    while (fileLines.length > 0) {
        fileLine = jQuery.trim(fileLines.shift());
        if (myRe.test(fileLine)) {
            continue;
        }
        if (fileLine.length > 1) {
            var Values  = fileLine.split(delimiter);
            var site_no = Values[jQuery.inArray(indexField, Fields)];

            // Key does not exist [First time seen; create it]
            //
            if (!myData[site_no]) {
                myData[site_no] = [];
                count = 0;
            }

            // Build data structure
            //
            if (!myData[site_no][count]) { myData[site_no][count] = {}; }
            
            myData[site_no][count].sample_dt = Values[jQuery.inArray('sample_dt', Fields)];
            myData[site_no][count].sample_tm = Values[jQuery.inArray('sample_tm', Fields)];
            myData[site_no][count].sample_start_time_datum_cd = Values[jQuery.inArray('sample_start_time_datum_cd', Fields)];
            
            for (var i = 0; i < myParamsL.length; i++) {
                var Value = Values[jQuery.inArray(myParamsL[i].toLowerCase(), Fields)];
                //console.log("Parameter " + myParamsL[i] + "--> " + Value);
                if (!Value) { Value = ""; }
                myData[site_no][count][myParamsL[i]] = Value;
            }
            count++;
        }
    }

    return {
        "WaterQuality": myData,
        "ParameterCodes": myParameters,
        "coll_ent_cds": coll_ent_cds,
        "RemarkCodes": remark_cds,
        "val_qual_txs": val_qual_txs,
        "meth_cds": meth_cds,
        "dqi_cds": dqi_cds,
        "rpt_lev_cds": rpt_lev_cds
    };

}

// Groundwater measurements
//
var gwFields = [
    'agency_cd',
    'site_no',
    'site_tp_cd',
    'lev_dt',
    'lev_tm',
    'lev_tz_cd',
    'lev_va',
    'sl_lev_va',
    'sl_datum_cd',
    'lev_status_cd',
    'lev_agency_cd',
    'lev_dt_acy_cd',
    'lev_acy_cd',
    'lev_src_cd',
    'lev_meth_cd',
    'lev_age_cd'
];

// Parse Groundwater measurements output from gw data service in RDB format
//
function parseGwRDB(dataRDB) {
    //console.log("parseGwRDB gwService");

    var myRe = /^#/;
    var lineRe = /\r?\n/;
    var delimiter = '\t';
    var myData = {};
    var sl_datum_cds = {};
    var lev_status_cds = {};
    var lev_agency_cds = {};
    var lev_dt_acy_cds = {};
    var lev_acy_cds = {};
    var lev_src_cds = {};
    var lev_meth_cds = {};
    var lev_age_cds = {};

    var Fields = [];

    // Parse from header explanations
    //
    var myAgencyInfo = /^# Referenced agency codes/;
    var myStatusInfo = /^# Referenced water-level site status codes/;
    var myReferenceInfo = /^# Referenced vertical datum codes/;
    var myDateAcyInfo = /^# Referenced water-level date-time accuracy codes/;
    var myLevAcyInfo = /^# Referenced water-level accuracy codes/;
    var myLevSrcInfo = /^# Referenced source of measurement codes/;
    var myMethodInfo = /^# Referenced method of measurement codes/;
    var myAgingInfo = /^# Referenced water-level approval-status codes/;

    // Parse in lines
    //
    var fileLines = dataRDB.split(lineRe);

    // Column names on header line
    //
    while (fileLines.length > 0) {
        var fileLine = jQuery.trim(fileLines.shift());
        if (fileLine.length < 1) {
            continue;
        }
        if (!myRe.test(fileLine)) {
            break;
        }

        // Header portion for site status information
        //
        if (myStatusInfo.test(fileLine)) {
            fileLines.shift(); // skip blank line

            while (fileLines.length > 0) {
                fileLine = jQuery.trim(fileLines.shift());
                if (myRe.test(fileLine)) {
                    if (fileLine.length < 5) { break; }
                }

                var Fields = fileLine.split(/\s+/);
                var lev_status_cd = Fields[1];
                if (lev_status_cd === '""') { lev_status_cd = "9"; }
                lev_status_cds[lev_status_cd] = {};
                lev_status_cds[lev_status_cd] = Fields.slice(2).join(" ");
                //console.log("Status " + lev_status_cd.length + "--> " + Fields.slice(2).join(" "));
            }
        }

        // Header portion for measuring agency codes information
        //
        if (myAgencyInfo.test(fileLine)) {
            fileLines.shift(); // skip blank line

            while (fileLines.length > 0) {
                fileLine = jQuery.trim(fileLines.shift());
                if (myRe.test(fileLine)) {
                    if (fileLine.length < 5) { break; }
                }

                var Fields = fileLine.split(/\s+/);
                var lev_agency_cd = Fields[1];
                lev_agency_cds[lev_agency_cd] = {};
                lev_agency_cds[lev_agency_cd] = Fields.slice(2).join(" ");
            }
        }

        // Header portion for referenced vertical datum codes
        //
        if (myReferenceInfo.test(fileLine)) {
            fileLines.shift(); // skip blank line

            while (fileLines.length > 0) {
                fileLine = jQuery.trim(fileLines.shift());
                if (myRe.test(fileLine)) {
                    if (fileLine.length < 5) { break; }
                }

                var Fields = fileLine.split(/\s+/);
                var sl_datum_cd = Fields[1];
                sl_datum_cds[sl_datum_cd] = {};
                sl_datum_cds[sl_datum_cd] = Fields.slice(2).join(" ");
            }
        }

        // Header portion for method codes
        //
        if (myMethodInfo.test(fileLine)) {
            fileLines.shift(); // skip blank line

            while (fileLines.length > 0) {
                fileLine = jQuery.trim(fileLines.shift());
                if (myRe.test(fileLine)) {
                    if (fileLine.length < 5) { break; }
                }

                var Fields = fileLine.split(/\s+/);
                var lev_meth_cd = Fields[1];
                lev_meth_cds[lev_meth_cd] = {};
                lev_meth_cds[lev_meth_cd] = Fields.slice(2).join(" ");
            }
        }

        // Header portion for  water-level date-time accuracy
        //
        if (myDateAcyInfo.test(fileLine)) {
            fileLines.shift(); // skip blank line

            while (fileLines.length > 0) {
                fileLine = jQuery.trim(fileLines.shift());
                if (myRe.test(fileLine)) {
                    if (fileLine.length < 5) { break; }
                }

                var Fields = fileLine.split(/\s+/);
                var lev_dt_acy_cd = Fields[1];
                lev_dt_acy_cds[lev_dt_acy_cd] = {};
                lev_dt_acy_cds[lev_dt_acy_cd] = Fields.slice(2).join(" ");
            }
        }

        // Header portion for water-level approval-status
        //
        if (myAgingInfo.test(fileLine)) {
            fileLines.shift(); // skip blank line

            while (fileLines.length > 0) {
                fileLine = jQuery.trim(fileLines.shift());
                if (myRe.test(fileLine)) {
                    if (fileLine.length < 5) { break; }
                }

                var Fields = fileLine.split(/\s+/);
                var lev_age_cd = Fields[1];
                lev_age_cds[lev_age_cd] = {};
                lev_age_cds[lev_age_cd] = Fields.slice(2).join(" ");
            }
        }

        // Header portion for source of measurement
        //
        if (myLevSrcInfo.test(fileLine)) {
            fileLines.shift(); // skip blank line

            while (fileLines.length > 0) {
                fileLine = jQuery.trim(fileLines.shift());
                if (myRe.test(fileLine)) {
                    if (fileLine.length < 5) { break; }
                }

                var Fields = fileLine.split(/\s+/);
                var lev_src_cd = Fields[1];
                lev_src_cds[lev_src_cd] = {};
                lev_src_cds[lev_src_cd] = Fields.slice(2).join(" ");
            }
        }

        // Header portion for water-level accuracy
        //
        if (myLevAcyInfo.test(fileLine)) {
            fileLines.shift(); // skip blank line

            while (fileLines.length > 0) {
                fileLine = jQuery.trim(fileLines.shift());
                if (myRe.test(fileLine)) {
                    if (fileLine.length < 5) { break; }
                }

                var Fields = fileLine.split(/\s+/);
                var lev_acy_cd = Fields[1];
                lev_acy_cds[lev_acy_cd] = {};
                lev_acy_cds[lev_acy_cd] = Fields.slice(2).join(" ");
            }
        }
    }

    // Check index column name in file
    //
    var Fields = fileLine.split(delimiter);
    if (jQuery.inArray(indexField, Fields) < 0) {
        var message = "Header line of column names does not contain " + indexField + " column\n";
        message += "Header line contains " + Fields.join(", ");
        message_dialog("Warning", message);
        close_dialog();
        return false;
    }

    // Format line in header portion [skip]
    //
    var fileLine = jQuery.trim(fileLines.shift());

    // Data lines
    //
    var count = 0;
    while (fileLines.length > 0) {
        fileLine = jQuery.trim(fileLines.shift());
        if (myRe.test(fileLine)) {
            continue;
        }
        if (fileLine.length > 1) {
            var Values = fileLine.split(delimiter);
            var site_no = Values[jQuery.inArray(indexField, Fields)];

            // Key does not exist [First time seen; create it]
            //
            if (typeof myData[site_no] === "undefined") {
                myData[site_no] = {};
            }
            if (typeof myData[site_no][count] === "undefined") {
                myData[site_no][count] = {};
            }

            for (var i = 0; i < gwFields.length; i++) {
                var Value = Values[jQuery.inArray(gwFields[i], Fields)];
                if (typeof Value === "undefined" || Value.length < 1) {
                    Value = "";
                }
                myData[site_no][count][gwFields[i]] = Value;
            }
            count++;
        }
    }

    return {
        "myData": myData,
        "lev_status_cds": lev_status_cds,
        "lev_agency_cds": lev_agency_cds,
        "lev_dt_acy_cds": lev_dt_acy_cds,
        "lev_acy_cds": lev_acy_cds,
        "lev_src_cds": lev_src_cds,
        "lev_meth_cds": lev_meth_cds,
        "lev_age_cds": lev_age_cds,
        "sl_datum_cds": sl_datum_cds
    };

}

// Site with general information
//
var siteFields = [
    'agency_cd',
    'site_no',
    'station_nm',
    'site_tp_cd',
    'dec_lat_va',
    'dec_long_va',
    'coord_acy_cd',
    'dec_coord_datum_cd',
    'alt_va',
    'alt_acy_va',
    'alt_datum_cd',
    'huc_cd'
];


// Parse Site information output from site data service in RDB format
//
function parseSiteRDB(dataRDB) {
    console.log("parseSiteRDB from siteService");

    var myRe = /^#/;
    var lineRe = /\r?\n/;
    var delimiter = '\t';
    var siteInfo = {};
    
    var Fields   = [];
    var myFields = {};

    // Parse from header explanations
    //
    var myFieldsInfo = /^# The following selected fields are included in this output/;
    var noDataInfo   = /No sites found matching all criteria/;

    // Parse in lines
    //
    var fileLines = dataRDB.split(lineRe);

    // Column names on header line
    //
    while (fileLines.length > 0) {
        var fileLine = jQuery.trim(fileLines.shift());
        if (fileLine.length < 1) {
            continue;
        }
        if (!myRe.test(fileLine)) {
            break;
        }

        // Header portion for No site information
        //
        if (noDataInfo.test(fileLine)) {

            console.log('No site information');
    
            return {};
        }
    }

    // Check index column name in file
    //
    var Fields = fileLine.split(delimiter);
    if (jQuery.inArray(indexField, Fields) < 0) {
        var message = "Header line of column names does not contain " + indexField + " column\n";
        message += "Header line contains " + Fields.join(", ");
        message_dialog("Warning", message);
        close_dialog();
        return false;
    }

    // Format line in header portion [skip]
    //
    var fileLine = jQuery.trim(fileLines.shift());

    // Data lines
    //
    var count = 0;
    while (fileLines.length > 0) {
        fileLine = jQuery.trim(fileLines.shift());
        if (myRe.test(fileLine)) {
            continue;
        }
        if (fileLine.length > 1)
        {
            var Values   = fileLine.split(delimiter);
            var siteNo   = Values[jQuery.inArray(indexField, Fields)];

            // Create hash
            //
            if (typeof siteInfo[siteNo] === "undefined") {
                siteInfo[siteNo] = {};
            }

            // Fill hash
            //
            for (i in siteFields) {
                myColumn = siteFields[i];
                siteInfo[siteNo][myColumn] = Values[jQuery.inArray(myColumn, Fields)];
            }
        }
    }

    return siteInfo;

}


// Site with period of record information
//
var sitePorFields = [
    'agency_cd',
    'site_no',
    'station_nm',
    'site_tp_cd',
    'dec_lat_va',
    'dec_long_va',
    'coord_acy_cd',
    'dec_coord_datum_cd',
    'alt_va',
    'alt_acy_va',
    'alt_datum_cd',
    'huc_cd',
    'data_type_cd',
    'parm_cd',
    'stat_cd',
    'ts_id',
    'loc_web_ds',
    'medium_grp_cd',
    'parm_grp_cd',
    'srs_id',
    'access_cd',
    'begin_date',
    'end_date',
    'count_nu'
];


// Parse Site information output from site data service in RDB format
//
function parseSitePorRDB(dataRDB) {
    //console.log("parseSiteRDB from siteService");

    var myRe = /^#/;
    var lineRe = /\r?\n/;
    var delimiter = '\t';
    var siteInfo = {};
    var myData = {};
    var parm_cds = [];
    var data_type_cds = [];
    var loc_web_cds = [];
    
    var Fields   = [];
    var myFields = {};

    // Parse from header explanations
    //
    var myFieldsInfo = /^# The following selected fields are included in this output/;
    var noDataInfo   = /No sites found matching all criteria/;

    // Parse in lines
    //
    var fileLines = dataRDB.split(lineRe);

    // Column names on header line
    //
    while (fileLines.length > 0) {
        var fileLine = jQuery.trim(fileLines.shift());
        if (fileLine.length < 1) {
            continue;
        }
        if (!myRe.test(fileLine)) {
            break;
        }

        // Header portion for No site information
        //
        if (noDataInfo.test(fileLine)) {

            console.log('No site information');
    
            return {
                    "message": "No sites found matching all criteria",
                    "myData": myData,
                    "siteInfo": siteInfo,
                    "parm_cds": parm_cds,
                    "data_type_cds": data_type_cds,
                    "loc_web_ds": loc_web_cds
                };
        }
 
        // Header portion for site status information
        //
        if (myFieldsInfo.test(fileLine)) {
            fileLines.shift(); // skip blank line

            while (fileLines.length > 0) {
                fileLine = jQuery.trim(fileLines.shift());
                if (myRe.test(fileLine)) {
                    if (fileLine.length < 5) { break; }
                }

                var Fields = fileLine.split(/\s+/);
                if (Fields[1].toLowerCase() in myFields === false)
                {
                    myFields[Fields[1].toLowerCase()] = Fields.slice(2).join(" ");
                }
            }
        }
    }

    // Check index column name in file
    //
    var Fields = fileLine.split(delimiter);
    if (jQuery.inArray(indexField, Fields) < 0) {
        var message = "Header line of column names does not contain " + indexField + " column\n";
        message += "Header line contains " + Fields.join(", ");
        message_dialog("Warning", message);
        close_dialog();
        return false;
    }

    // Format line in header portion [skip]
    //
    var fileLine = jQuery.trim(fileLines.shift());

    // Data lines
    //
    var count = 0;
    while (fileLines.length > 0) {
        fileLine = jQuery.trim(fileLines.shift());
        if (myRe.test(fileLine)) {
            continue;
        }
        if (fileLine.length > 1)
        {
            var Values   = fileLine.split(delimiter);
            
            var siteNo       = Values[jQuery.inArray(indexField, Fields)];
            var ts_id        = Values[jQuery.inArray('ts_id', Fields)];
            var parm_cd      = Values[jQuery.inArray('parm_cd', Fields)];
            var count_nu     = Values[jQuery.inArray('count_nu', Fields)];
            var data_type_cd = Values[jQuery.inArray('data_type_cd', Fields)];
            var begin_date   = Values[jQuery.inArray('begin_date', Fields)];
            var end_date     = Values[jQuery.inArray('end_date', Fields)];
            var loc_web_ds   = Values[jQuery.inArray('loc_web_ds', Fields)];

            // Create hash
            //
            if (typeof myData[siteNo] === "undefined") {
                myData[siteNo] = {};
            }
            if (typeof myData[siteNo][ts_id] === "undefined") {
                myData[siteNo][ts_id] = {};
            }

            myData[siteNo][ts_id] = {
                'parm_cd': parm_cd,
                'loc_web_ds': loc_web_ds,
                'begin_date': begin_date,
                'end_date': end_date
            };

            if (jQuery.inArray('parm_cd', Fields) > -1 &&
                jQuery.inArray(parm_cd, parm_cds) < 0) {
                parm_cds.push(parm_cd);
            }
            if (jQuery.inArray('data_type_cd', Fields) > -1 &&
                jQuery.inArray(data_type_cd, data_type_cds) < 0) {
                data_type_cds.push(data_type_cd);
            }
            if (jQuery.inArray('loc_web_ds', Fields) > -1 &&
                jQuery.inArray(loc_web_ds, loc_web_cds) < 0) {
                loc_web_cds.push(loc_web_ds);
            }


            if (typeof siteInfo[siteNo] === "undefined") {
                
                siteInfo[siteNo] = {};
                
                for (var i = 0; i < sitePorFields.length; i++) {
                    var Value = Values[jQuery.inArray(sitePorFields[i], Fields)];
                    if (typeof Value === "undefined" || Value.length < 1) {
                        Value = "";
                    }
                    siteInfo[siteNo][sitePorFields[i]] = Value;
                }
            }
        }
    }

    return {
        "myData": myData,
        "siteInfo": siteInfo,
        "parm_cds": parm_cds,
        "data_type_cds": data_type_cds,
        "loc_web_ds": loc_web_cds
    };

}
