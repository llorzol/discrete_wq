/**
 * Namespace: Discrete_wq
 *
 * Discrete_wq is a JavaScript library to provide a set of functions to build
 *  a Discrete Water-Quality Web Site.
 *
 * version 3.08
 * January 28, 2024
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

var SiteInfo         = {};
var myParameterCodes = {};

// No need to graph these parameter codes
//
var unParameterCodes = [
    'P00003', // Sampling depth, feet
    'P00004', // Stream width, feet
    'P00009', // Location in cross section, distance from left bank looking downstream, feet
    'P00028', // Agency analyzing sample, code
    'P00060', // Discharge, cubic feet per second
    'P00061', // Discharge, instantaneous, cubic feet per second
    'P00063', // Number of sampling points, count
    'P00064', // Mean depth of stream, feet
    'P71999', // Sample purpose, code
    'P72104', // Sample location, distance downstream, feet
    'P72105', // Sample location, distance upstream, feet
    'P72217', // Duration sampler collected water, seconds
    'P72219', // Sampler nozzle material, code
    'P72220', // Sampler nozzle diameter, code
    'P82073', // Starting time, 24 hour clock, hour-minute (hhmm)
    'P82074', // Ending time, 24 hour clock, hour-minute (hhmm)
    'P82398', // Sampling method, code
    'P84164', // Sampler type, code
    'P99111'  // Type of quality assurance data associated with sample, code
];
   
var agency_cd        = "";
var site_no          = ""

// Prepare when the DOM is ready 
//
$(document).ready(function() 
  {
   // Nav Bar help tooltips
   //
   setHelpTip("#aboutHelp", "Click this for information about this web site.", "right");
   setHelpTip("#aboutTutorial", "Click this to explore a tutorial on the features.", "bottom");
   setHelpTip("#projectHelp", "Click this to display links to other important web pages.", "bottom");
   setHelpTip("#contactHelp", "Click this for contact information.", "bottom");
   setHelpTip("#availableHelp", "Click this to graph a single parameter.", "bottom");
   setHelpTip("#downloadHelp", "Click to download discrete water-quality records.", "bottom");
      
   // Current url
   //-------------------------------------------------
   var url     = new URL(window.location.href);  
   console.log("Current Url " + window.location.href);

   // Parse
   //-------------------------------------------------
   agency_cd  = url.searchParams.get('agency_cd');
   site_no    = url.searchParams.get('site_no');

   // Check agency code
   //
   if(!agency_cd)
     {
      agency_cd  = "USGS";
     }

   // No site number specified
   //
   if(!site_no)
     {
      var message = "<p>Error loading discrete water-quality records<br />Require Nwis site number</p>";
      message_dialog(message);
      openModal(message);
      fadeModal(4000)

      return;
     }

   // Check site number specified
   //
   site_no = checkSiteNo(site_no);
   if(!site_no)
     {
      var message = "<p>Error loading discrete water-quality records<br />Require Nwis site number</p>";
      message_dialog(message);
      openModal(message);
      fadeModal(4000)

      return;
     }
   
   message = "Requesting general site and  discrete water-quality measurement for site " + site_no;
   openModal(message);

   // Build ajax requests
   //
   var webRequests  = [];
   
   // Request for general site information
   //
   var request_type = "GET";
   var script_http  = 'https://waterservices.usgs.gov/nwis/site/?format=rdb&siteStatus=all&hasDataTypeCd=qw'
   var data_http    = "sites=" + site_no;
         
   var dataType     = "text";
      
   // Web request
   //
   webRequests.push($.ajax( {
                             method:   request_type,
                             url:      script_http, 
                             data:     data_http, 
                             dataType: dataType
   }));

   // Request for discrete water-quality measurement information
   // 
   // https://nwis.waterdata.usgs.gov/nwis/qwdata?search_site_no=11523000&format=rdb&qw_sample_wide=wide
   // 
   var request_type = "GET";
   var script_http  = 'https://nwis.waterdata.usgs.gov/nwis/qwdata?format=rdb&qw_sample_wide=wide';
   var data_http    = "search_site_no=" + site_no;
         
   var dataType     = "text";
      
   // Web request
   //
   webRequests.push($.ajax( {
                             method:   request_type,
                             url:      script_http, 
                             data:     data_http, 
                             dataType: dataType
   }));

   // Run ajax requests
   //
   var j       = 0;
   $.when.apply($, webRequests).then(function() {
        //console.log('Responses');
        //console.log("Responses length " + arguments.length);
        //console.log(arguments);

        // Retrieve site information
        //
        var i = 0;
        if(arguments.length > 0)
          {
           var myInfo  = arguments[i];
           //console.log("arguments " + i);
           //console.log(arguments[i]);

           if(myInfo[1] === "success")
             {
              // Loading message
              //
              message = "Processed site information";
              openModal(message);
              fadeModal(2000);

              mySiteData = parseSiteRDB(myInfo[0]);
              //console.log('mySiteData');
              //console.log(mySiteData);
             }
            else
             {
              // Loading message
              //
              message = "Failed to load site information";
              openModal(message);
              fadeModal(2000);
              return false;
             }
          }

        // Retrieve water-quality measurement information
        //
        i++;
        //console.log("Retrieve water-quality measurement information ");
        //console.log(arguments[i]);
        if(arguments.length > i)
          {
           var myInfo = arguments[i];

           if(myInfo[1] === "success")
             {
              // Loading message
              //
              message = "Processed water-quality measurement information";
              openModal(message);
              fadeModal(2000);

              myParmData = parseWqRDB(myInfo[0]);
             }
            else
             {
              // Loading message
              //
              message = "Failed to load water-quality measurement information";
              openModal(message);
              fadeModal(2000);
              return false;
             }
          }

        console.log("done with main");
        fadeModal(2000);

       // Plot water-quality records
       //
       plotDiscreteWq(site_no, mySiteData, myParmData);
   });
  })

function checkSiteNo(site_no)
  {
   // Check site number
   //
   if(!site_no)
     {
      var message = "Incorrectly formatted USGS site number: ";
      message    += "You must use the USGS station numbers, which are a number ";
      message    += "from 8 to 15 digits long. ";
      openModal(message);
      fadeModal(4000)

      return undefined;
     }

   // Is site number valid
   //
   site_no  = site_no.replace(/^\s+|\s+$/g,'');
   var myRe = /^(\d{8,15})$/g;
   if(!myRe.test(site_no))
     {
      var message = "Incorrectly formatted USGS site number: ";
      message    += "You must use the USGS station numbers, which are a number ";
      message    += "from 8 to 15 digits long. ";
      openModal(message);
      fadeModal(4000)

      return undefined;
     }

   return site_no;
  }

function requestSiteInfo(site_no)
  {
   console.log("requestSiteInfo");
   
   message = "Requesting general site and  discrete water-quality measurement for site " + site_no;
   openModal(message);

   // Build ajax requests
   //
   var webRequests  = [];
   
   // Request for general site information
   //
   var request_type = "GET";
   var script_http  = 'https://waterservices.usgs.gov/nwis/site/?format=rdb&siteStatus=all&hasDataTypeCd=qw'
   var data_http    = "sites=" + site_no;
         
   var dataType     = "json";
      
   // Web request
   //
   webRequests.push($.ajax( {
                             method:   request_type,
                             url:      script_http, 
                             data:     data_http, 
                             dataType: dataType
   }));

   // Request for discrete water-quality measurement information
   // 
   // https://nwis.waterdata.usgs.gov/nwis/qwdata?search_site_no=11523000&format=rdb
   // 
   var request_type = "GET";
   var script_http  = 'https://nwis.waterdata.usgs.gov/nwis/qwdata?format=rdb';
   var data_http    = "search_site_no=" + site_no;
         
   var dataType     = "text";
      
   // Web request
   //
   webRequests.push($.ajax( {
                             method:   request_type,
                             url:      script_http, 
                             data:     data_http, 
                             dataType: dataType
   }));

   // Run ajax requests
   //
   var j       = 0;
   $.when.apply($, webRequests).then(function() {
        console.log('Responses');
        console.log("Responses length " + arguments.length);
        console.log(arguments);

        // Retrieve site information
        //
        var i = 0;
        if(arguments.length > 0)
          {
           var myInfo  = arguments[i];
           console.log("arguments " + i);
           console.log(arguments[i]);

           if(myInfo[1] === "success")
             {
              // Loading message
              //
              message = "Processed site information";
              openModal(message);
              fadeModal(2000);

              mySiteData = parseSiteRDB(myInfo[0]);
              console.log('mySiteData');
              console.log(mySiteData);
             }
            else
             {
              // Loading message
              //
              message = "Failed to load site information";
              openModal(message);
              fadeModal(2000);
              return false;
             }
          }

        // Retrieve water-quality measurement information
        //
        i++;
        console.log("Retrieve water-quality measurement information ");
        console.log(arguments[i]);
        if(arguments.length > i)
          {
           var myInfo = arguments[i];

           if(myInfo[1] === "success")
             {
              // Loading message
              //
              message = "Processed water-quality measurement information";
              openModal(message);
              fadeModal(2000);

              myParmData = parseWqRDB(myInfo[0]);
             }
            else
             {
              // Loading message
              //
              message = "Failed to load water-quality measurement information";
              openModal(message);
              fadeModal(2000);
              return false;
             }
          }

        console.log("done with main");
        fadeModal(2000);

       // Plot water-quality records
       //
       plotDiscreteWq(mySiteData, myParmData);
   });

  }

function processSiteInfo(myData)
  {
   console.log("processSiteInfo");

   var site_no         = myJson.features[0].properties.site_no;
   
   SiteInfo.site_no    = myJson.features[0].properties.site_no;
   SiteInfo.agency_cd  = myJson.features[0].properties.agency_cd;
   SiteInfo.station_nm = myJson.features[0].properties.station_nm;
   SiteInfo.site_tp_cd = myJson.features[0].properties.site_tp_cd;
   SiteInfo.status     = myJson.features[0].properties.status;

   return;
  }

function processDiscreteWqInfo(myData)
  {
   console.log("processDiscreteWqInfo");

   if(typeof myJson.message !== "undefined")
     {
      message = "Error loading discrete water-quality records";
      openModal(message);

      return;
     }

   // Check for parameter codes
   //
   myParameterCodes = myJson.ParameterCodes;
   var myParamsL    = jQuery.map(myParameterCodes, function(element,index) {return index});

   if(myParamsL.length < 1)
     {
      message = "No discrete water-quality records";
      openModal(message);

      return;
     }

   closeModal();
}

function availableParameters(myParams)
  {
   var myParamsL   = jQuery.map(myParams, function(element,index) {return index});
   var ParmSortedL = myParamsL.sort();

    // Parameter code information
    //
    ParmList = [];
    for(var i = 0; i < ParmSortedL.length; i++)
       {
        var param_cd = ParmSortedL[i];
        var param_nm = myParams[param_cd]['param_nm'];
        var param_tx = '[' + param_cd + '] -- ' + param_nm;

        ParmList.push('<li id="' + param_cd + '" class="dropdown-item" ><a href="#">' + param_tx + '</a></li>');
       }

   jQuery('.available-parameters').html(ParmList.join(" "));
}
