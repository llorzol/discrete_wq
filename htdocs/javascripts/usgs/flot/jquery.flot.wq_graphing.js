/* NwisWeb Javascript plotting library for jQuery and flot.
 *
 * Wq_Graphing is a JavaScript library to graph NwisWeb water-quality
 *  information such as the discrete water-quality measurements for a site(s).
 *
 * version 3.02
 * January 10, 2024
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

var plot;
var overview;
var data_sets            = [];
var data                 = [];
var LegendHash           = [];
var d                    = [];
var color_scheme         = [];
var previousPoint        = null;

var monthNames           = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Function to show tooltip
//
function showMessagetip(x, y, x_offset, y_offset, contents) 
  {
    var x_position = x + x_offset;
    var y_position = y + y_offset;
    jQuery("#tooltip").remove();
    jQuery('<div id="tooltip" class="flot_tooltip">' + contents + '</div>').css( {
          top:  parseInt(y_position),
          left: parseInt(x_position)
     }).appendTo("body").fadeIn(200);
  }
      
function closeMessagetip(fadeout) 
  {
   setTimeout(function(){
                $('#tooltip').fadeOut().remove();
      },fadeout);
  }
      
function plotDiscreteWq(site_no, SiteInfo, myWQ) 
  {
   console.log("plotDiscreteWq");
   //console.log(SiteInfo);
   //console.log(myWQ);
   //console.log('site_no ' + site_no);

   // Set variables
   //
   var x_axis_min     =  9999999999999999999;
   var x_axis_max     = -9999999999999999999;

   var y_axis_min     =  9999999999999999999;
   var y_axis_max     = -9999999999999999999;

   // Site information
   //
   var agency_cd      = SiteInfo[site_no].agency_cd;
   var station_nm     = SiteInfo[site_no].station_nm;
    
   // Change title
   // 
   $(".body-wrap").show(); 
   $("#plot_title").text(agency_cd + " " + site_no + " " + station_nm);
   $("#header").html("Water-Quality Measurement Information for Site " + agency_cd + " " + site_no + " " + station_nm);

   jQuery(document).prop("title", "Water-Quality Measurement Information for Site " + agency_cd + " " + site_no + " " + station_nm);

    var siteInfo       = [];
    siteInfo.push("<ul>");
    siteInfo.push(" <li>");
    siteInfo.push(" Agency code: " + agency_cd);
    siteInfo.push(" </li>");
    siteInfo.push(" <li>");
    siteInfo.push(" NWIS site number: " + site_no);
    siteInfo.push(" </li>");
    siteInfo.push(" <li>");
    siteInfo.push(" NWIS station name: " + station_nm);
    siteInfo.push(" </li>");
    siteInfo.push("</ul>");
    $("#site_tx").html(siteInfo.join("\n")); 

    // Parameter code information
    //
    var ParmInfo        = myWQ.ParameterCodes;

    // Remark code information
    //
    var RemarkInfo      = myWQ.RemarkCodes;

    // Water Quality information
    //
    var WaterQuality    = myWQ.WaterQuality;
    var WqInfo          = WaterQuality[site_no];
    //console.log(WaterQuality);
  
    // Loop through water-quality records
    //
    var wqDiscrete      = {};
    var last_wq_dt      = null;

    for(var i = 0; i < WqInfo.length; i++)
       {
         var sample_dt     = WqInfo[i].sample_dt;
         var sample_tm     = WqInfo[i].sample_tm;
         var sample_tz     = WqInfo[i].sample_start_time_datum_cd;

         //console.log("Time " + sample_tm);
         if(typeof sample_tm === "undefined") { sample_tm = '12:00'; }
         if(sample_tm.toString().length < 1)  { sample_tm = '12:00'; }

         // Process date and time
         //
         var sample_dt_txt = [sample_dt, sample_tm, sample_tz].join(" ");

         if(sample_dt.length < 5)
           {
             sample_dt    += "/01/01";
           }
         if(sample_dt.length < 8)
           {
             sample_dt = sample_dt.replace(/\-/g, "/") + "/01";
           }
         else
           {
             sample_dt = sample_dt.replace(/\-/g, "/");
           }

         // Set date in timestamp units
         //
         //console.log("sample_dt " + sample_dt_txt);
         //var dt       = new Date(datetime);
         //console.log("Date " + dt.toDateString());
         //console.log("Date " + dt.yyyymmddhhmmss());
         sample_dt    = [sample_dt, sample_tm, sample_tz].join(" ");
         var datetime = Date.parse(sample_dt);

         var browser_offset = 0;
         if(sample_tm.length > 0)
           {
             var browser_offset = new Date().getTimezoneOffset() * 60000;
           }
         datetime -= browser_offset;

         if(datetime > x_axis_max) { x_axis_max = datetime; }
         if(datetime < x_axis_min) { x_axis_min = datetime; }

         // Process parameter values
         //
         for(var param_cd in ParmInfo)
            {
             if(typeof WqInfo[i][param_cd] !== "undefined")
               {
                var param_nm  = ParmInfo[param_cd];
                var param_va  = WqInfo[i][param_cd];
                var remark_cd = "";
                //console.log("   Parm " + param_cd + " --> " + param_va + ' => ' + isNaN(param_va));

                // No valid parameter value
                //
                if(isNaN(param_va))
                  {
                  var paramL = param_va.split(" ");
                  if(paramL.length > 1) { param_va = paramL[1]; remark_cd = paramL[0]; }
                  else if(paramL.length > 0) { param_va = paramL[0]; }
                   //remark_cd, param_va = param_va.split(" ");
                   //console.log("   param_cd " + param_cd + " remark_cd " + remark_cd + " => " + param_va);
                  }
   
                var wq_va_str     = null;
                var value         = null;
       
                if(param_va.length > 0)
                  {
                    wq_va_str = param_va.toString();
                    wq_va     = parseFloat(param_va);
                    value     = parseFloat(param_va);
   
                    if(typeof wqDiscrete[param_cd] === "undefined")
                      {
                       wqDiscrete[param_cd]             = {}
                       wqDiscrete[param_cd]['count']    = 0
                       wqDiscrete[param_cd]['min']      =  9999999999999999999;
                       wqDiscrete[param_cd]['max']      = -9999999999999999999;
                       wqDiscrete[param_cd]['data']     = [];
                       wqDiscrete[param_cd]['plot']     = 0;
                       wqDiscrete[param_cd]['param_nm'] = ParmInfo[param_cd];
                      }
                     wqDiscrete[param_cd]['data'].push([datetime, value, remark_cd, sample_dt_txt]);
                     wqDiscrete[param_cd]['count']++;
                
                     // Set min and max
                     //
                     if(value !== null)
                       {
                        if(value > wqDiscrete[param_cd]['max'])
                          { 
                           wqDiscrete[param_cd]['max'] = value;
                          }
                        if(value < wqDiscrete[param_cd]['min'])
                          { 
                           wqDiscrete[param_cd]['min'] = value;
                          }
                       }
                  }
               }
            }
       }

    // Check date range
    //
    if(x_axis_max == x_axis_min)
      {
       x_axis_max += 2 * 24 * 60 * 60 * 1000;
       x_axis_min -= 2 * 24 * 60 * 60 * 1000;
      }
    //console.log("Min : " + x_axis_min + " Max : " + x_axis_max);
    //console.log("Before Min " + new Date(x_axis_min).toString() + " Max " + new Date(x_axis_max).toString());

    // Set date range and x-axis ticks
    //
    var date_min_max = Date_MinMax(x_axis_min, x_axis_max);
    var x_axis_min   = date_min_max.min;
    var x_axis_max   = date_min_max.max;
    //console.log("After  Min " + new Date(x_axis_min).toString() + " Max " + new Date(x_axis_max).toString());
    var interval     = setInterval(x_axis_min, x_axis_max);
    var Ticks        = setTicks(x_axis_min, x_axis_max);
    //console.log("Next   Min " + new Date(x_axis_min).toString() + " Max " + new Date(x_axis_max).toString());
    //console.log("Ticks " + Ticks);

    var ox_axis_min  = x_axis_min;
    var ox_axis_max  = x_axis_max;
    var oTicks       = Ticks;

    var ColorHash    = setColor();

    // Add records
    //
    var lines        = { show: true, lineWidth: 1 };
    var color_no     = 0;
                                                       
    // Y axes
    //
    var yaxes_sets   = [];
    var oaxes_sets   = [];

    var ParmSortedL  = jQuery.map(wqDiscrete, function(element,index) {return index}).sort();
    //console.log("ParmSortedL " + ParmSortedL);

    for(var i = 0; i < ParmSortedL.length; i++)
       {
        var param_cd      = ParmSortedL[i];
        var id            = [agency_cd, site_no, param_cd].join("_");
        var data          = wqDiscrete[param_cd]['data'];
        var y_axis_number = i + 1;

        // Hollow symbols   
        //
        var symbol_type   = "circle";
        if(y_axis_number > 9)  { symbol_type = "square"; }
        if(y_axis_number > 18) { symbol_type = "diamond"; }
        if(y_axis_number > 27) { symbol_type = "triangle"; }
        if(y_axis_number > 36) { symbol_type = "cross"; }
        if(y_axis_number > 45) { symbol_type = "downtriangle"; }
        if(y_axis_number > 54) { symbol_type = "righttriangle"; }
        if(y_axis_number > 63) { symbol_type = "lefttriangle"; }

        // Filled symbol   
        //
        if(y_axis_number > 72) { symbol_type = "circle"; }
        if(y_axis_number > 81) { symbol_type = "square"; }
        if(y_axis_number > 90) { symbol_type = "diamond"; }
        if(y_axis_number > 99) { symbol_type = "triangle"; }
        if(y_axis_number > 108) { symbol_type = "tcross"; }
        if(y_axis_number > 117) { symbol_type = "downtriangle"; }
        if(y_axis_number > 126) { symbol_type = "righttriangle"; }
        if(y_axis_number > 135) { symbol_type = "lefttriangle"; }

        // Color symbol   
        //
        color_no          = i % 9;
        var color         = ColorHash[++color_no];
        color_scheme.push(color);
        var points        = { show: true, symbol: symbol_type };
        if(y_axis_number > 72) { points = { show: true, symbol: symbol_type, fill: true, fillColor: false }; }
        data_sets.push(
                       { 
                        //label : "Measured values for " + param_cd,
                        label : "Values for " + param_cd,
                        id    : id,
                        data  : data,
                        color : color,
                        xaxis : 1,
                        yaxis : y_axis_number,
                        lines : lines,
                        points: points
                       }
                      );

        // Y axes [only activate first parameter in list]
        //
        LegendHash[id]   = 0;

        if(i == 0)
          {
           LegendHash[id]   = 1;
          }

        // Set Y axis lable for length
        //
        var param_nm    = setParamText(wqDiscrete[param_cd]['param_nm']);

        // Left Y axis
        //
        yaxes_sets.push(
                   { 
                    show: true,
                    position: 'left',
                    color: color,
                    font: { size: 10, weight: "bold", color: color },
                    axisLabel: param_nm,
                    axisLabelPadding: 10,
                    alignTicksWithAxis: null
                    //min: wqDiscrete[param_cd]['min'],
                    //max: wqDiscrete[param_cd]['max']
                   });
     
        oaxes_sets.push(
                   { 
                    show: false
                    //position: 'left',
                    //min: wqDiscrete[param_cd]['min'],
                    //max: wqDiscrete[param_cd]['max'],
                    //font: {size: 10, weight: "bold", color: "#000000"}
                   });
      }
                                                       
   // X axis
   //
   var xaxis = 
              { 
               show: true,
               position: 'bottom',
               ticks: 5,
               mode: "time",
               timezone: null,
               monthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
               //tickFormatter: XtickFormatter,
               ticks: Ticks,
               font: {size: 10, weight: "bold", color: "black"},
               color: "#000000",
               min: x_axis_min,
               max: x_axis_max
             };
    
   var oxaxis = 
              { 
               show: true,
               position: 'bottom',
               ticks: 5,
               mode: "time",
               timezone: null,
               monthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
               //tickFormatter: XtickFormatter,
               ticks: Ticks,
               font: {size: 10, weight: "bold", color: "black"},
               color: "#000000",
               min: ox_axis_min,
               max: ox_axis_max
             };
    
   // Set available parameters
   // 
   availableParameters(wqDiscrete);
   
   // Data
   //
   data  = [ data_sets[0] ];
   yaxes = [ yaxes_sets[0] ];
   oaxes = [ oaxes_sets[0] ];
                                                       
   // Graph options
   //
   var options = {
                  //canvas: false,
                  legend: { show: false },
                  lines:  { show: true },
                  points: { show: true },
                  margin: { 
                            top: 100, 
                            left: 10, 
                            bottom: 10, 
                            right: 10 
                          },
                  grid:   
                           { 
                            hoverable: true, 
                            clickable: true,
                            hoverFill: '#444',
                            hoverRadius: 1
                           },
                  yaxes:  yaxes,
                  xaxis:  xaxis,
                  colors: color_scheme,
                  selection: { mode: "x" }
                 };

   var overviewOptions = {
                  //canvas: false,
                  legend: { show: false },
                  lines:  { show: true, lineWidth: 1 },
                  grid: { color: "#999" },
                  yaxes:  oaxes,
                  xaxis:  oxaxis,
                  colors: color_scheme,
                  selection: { mode: "x", color: "#F5E832" }
                 };
                                                       
   // Graph plot
   //
   plot = $.plot($("#placeholder"), data, options);
   jQuery('#enableTooltip').prop('checked',true);

    // Overview
    //
    overview = $.plot($("#overview"), data, overviewOptions);

    // Double click reset
    //
    jQuery("#overview").dblclick(function () {
        plot = jQuery.plot(jQuery("#placeholder"), data,
                      jQuery.extend(true, {}, options, {
                                                        yaxes: yaxes,
                                                        xaxis: { min: new Date(x_axis_min).getTime(), max: new Date(x_axis_max).getTime() }
                      }));
    });
             
    // Reset button
    //
    $("#reset").click(function () {
        plot = jQuery.plot(jQuery("#placeholder"), data,
                      jQuery.extend(true, {}, options, {
                                                        yaxes: yaxes,
                                                        xaxis: { min: new Date(x_axis_min).getTime(), max: new Date(x_axis_max).getTime() }
                      }));
    });
   
   // Add legend table with checkboxes and values
   // 
   var i = 0;
   var legend_txt = [];
   legend_txt.push('<div id="Legend" class="container legendTable">');
   legend_txt.push(' <div class="row">');
   legend_txt.push('  <div class="col-xs-8">');
   legend_txt.push('   <span id="explanation">Explanation</span>');
   legend_txt.push('  </div>');
   legend_txt.push(' </div>');
   legend_txt.push(' <div class="row">');
   legend_txt.push('  <div class="col-xs-12">');
   legend_txt.push('  <div class="legendEntries">');

   jQuery.each(data_sets, function(key, val) {
       val.color         = i;
       var label         = val.label;
       var id            = val.id;
       var y_axis_number = val.yaxis;
       var color         = color_scheme[i];
       var feature_type  = val.points.symbol;
           ++i;
           if(typeof feature_type ===  "undefined")
             {
               feature_type = "line";
             }
           //console.log("Label " + label + " Feature " + feature_type);

           legend_txt.push(' <div id="legend_' + id + '" class="row">');

           // Value element
           //
           legend_txt.push('  <div class="col-sm-1">');
           legend_txt.push('   <div id="value_' + id + '" class="legendValue">&nbsp;&nbsp;&nbsp;</div>');
           legend_txt.push('  </div>');

           // Checkbox element
           //
           legend_txt.push('  <div class="col-sm-1">');
           legend_txt.push('   <div class="checkBoxes">');
           legend_txt.push('    <input type="checkbox" name="' + id + '" value="on" id="checkbox_' + id + '" />');
           legend_txt.push('   </div>');
           legend_txt.push('  </div>');

           // Symbol element
           //
           legend_txt.push('  <div class="legendSymbol col-sm-1">');
           if(feature_type === "line")
             {
               legend_txt.push('   <div id="legend_' + id + '" class="legendLine" style="border-bottom: 4px solid ' + color + ';">&nbsp;</div>');
             }
           if(feature_type === "circle")
             {
               if(y_axis_number < 63)
                 {
                     legend_txt.push('   <div id="legend_' + id + '" class="legendCircle" style="color: ' + color + ';">&#128903;</div>');
                 }
               else
                 {
                     legend_txt.push('   <div id="legend_' + id + '" class="legendSphere" style="color: ' + color + ';">&#9679;</div>');
                 }
             }
           if(feature_type === "square")
             {
               if(y_axis_number < 72)
                 {
                  legend_txt.push('   <div id="legend_' + id + '" class="legendSquare" style="color: ' + color + ';">&#128912;</div>');
                 }
               else
                 {
                  legend_txt.push('   <div id="legend_' + id + '" class="legendFilledSquare" style="color: ' + color + ';">&#9632;</div>');
                 }
             }
           if(feature_type === "diamond")
             {
               if(y_axis_number < 81)
                 {
                  legend_txt.push('   <div id="legend_' + id + '" class="legendDiamond" style="color: ' + color + ';">&#128912;</div>');
                 }
               else
                 {
                  legend_txt.push('   <div id="legend_' + id + '" class="legendFilledDiamond" style="color: ' + color + ';">&#9632;</div>');
                 }
             }
           if(feature_type === "triangle")
             {
               if(y_axis_number < 90)
                 {
                  legend_txt.push('   <div id="legend_' + id + '" class="legendUpHollowTriangle" style="color: ' + color + ';">&#9651;</div>');
                 }
               else
                 {
                  legend_txt.push('   <div id="legend_' + id + '" class="legendUpFilledTriangle" style="color: ' + color + ';">&#9650;</div>');
                 }
             }
           if(feature_type === "cross")
             {
               //console.log("  Feature " + feature_type);
               legend_txt.push('   <div id="legend_' + id + '" class="legendCross" style="color: ' + color + ';">&#128939;</div>');
             }
           if(feature_type === "tcross")
             {
               //console.log("  Feature " + feature_type);
               legend_txt.push('   <div id="legend_' + id + '" class="legendT" style="color: ' + color + ';">&#128931;</div>');
             }
           if(feature_type === "downtriangle")
             {
               if(y_axis_number < 99)
                 {
                  legend_txt.push('   <div id="legend_' + id + '" class="legendDownHollowTriangle" style="color: ' + color + ';">&#9661;</div>');
                 }
               else
                 {
                  legend_txt.push('   <div id="legend_' + id + '" class="legendDownFilledTriangle" style="color: ' + color + ';">&#9660;</div>');
                 }
             }
           if(feature_type === "righttriangle")
             {
               if(y_axis_number < 108)
                 {
                  legend_txt.push('   <div id="legend_' + id + '" class="legendRightHollowTriangle" style="color: ' + color + ';">&#9655;</div>');
                 }
               else
                 {
                  legend_txt.push('   <div id="legend_' + id + '" class="legendRightFilledTriangle" style="color: ' + color + ';">&#9656;</div>');
                 }
             }
           if(feature_type === "lefttriangle")
             {
               if(y_axis_number < 117)
                 {
                  legend_txt.push('   <div id="legend_' + id + '" class="legendLeftHollowTriangle" style="color: ' + color + ';">&#9665;</div>');
                 }
               else
                 {
                  legend_txt.push('   <div id="legend_' + id + '" class="legendLeftFilledTriangle" style="color: ' + color + ';">&#9666;</div>');
                 }
             }
           legend_txt.push('  </div>');

           // Explanation element
           //
           legend_txt.push('  <div class="col-sm-8">');
           legend_txt.push('   <div id="label_' + id + '" class="legendLabel parameterLegend">' + label + '</div>');
           legend_txt.push('  </div>');
           //legend_txt.push('  <div class="col-sm-5"></div>');

           legend_txt.push(' </div>');
  });
   jQuery(".legendCircle").corner("3px");

   legend_txt.push(' </div">');
   legend_txt.push(' </div">');
   legend_txt.push(' </div">');
   legend_txt.push('</div>');
   jQuery("#Legend").html(legend_txt.join(""));

   // Set fixed width for legend and set properties
   //
   var legends = jQuery(".legendValue");
   legends.each(function () {

       // Fix the widths so they don't jump around
       //
       jQuery(this).css('width', jQuery(this).width());

       // Set check box and properties
       //
       var id = jQuery(this).prop('id').replace("value_", "");

       if(LegendHash[id] > 0)
         {
          jQuery("#checkbox_" + id).prop('checked', true);
          jQuery('#label_' + id).css({ "opacity": 1.0 });
          jQuery('#value_' + id).html(" ");
         }
       else
         {
          jQuery("#checkbox_" + id).prop('checked', false);
          jQuery('#label_' + id).css({ "opacity": 0.4 });
          jQuery('#value_' + id).html(" ");
         }

       // Set hover properties
       //
       var param_cd  = id.split(/_/)[2];
       var param_nm  = ParmInfo[param_cd];

       jQuery("#legend_" + id).attr('title', param_nm);
       jQuery("#legend_" + id).attr('data-placement', "bottom");
       jQuery("#legend_" + id).attr('legend-tooltip', "on");
    });

   // Show on hover parameter name
   //
   jQuery('[legend-tooltip="on"]').tooltip({ trigger: 'hover' });

   // Monitor dropdown from nav bar
   //
   jQuery('.available-parameters li').click(function(e) {
      e.preventDefault();
      var parm_cd = jQuery(this).prop('id');
      //console.log("Click ID " + parm_cd);

      jQuery('.checkBoxes input').each(function( index ) {
         //console.log("..checking " + jQuery(this).prop('id'));
         var agency_cd = jQuery(this).prop('id').split(/_/)[1];
         var site_no   = jQuery(this).prop('id').split(/_/)[2];
         var parmCd    = jQuery(this).prop('id').split(/_/)[3];
         var id        = [ agency_cd, site_no, parmCd ].join("_");
         var checkbox  = jQuery(this).prop('id').replace("label_", "checkbox_");

         if(parmCd == parm_cd)
           {
            LegendHash[id] = 1;
            jQuery("#" + checkbox).prop('checked', true);
            jQuery('#label_' + id).css({ "opacity": 1.0 });
            jQuery('#value_' + id).html(" ");
            console.log("..checking " + id);
           }
         else
           {
            LegendHash[id] = 0;
            jQuery("#" + checkbox).prop('checked', false);
            jQuery('#label_' + id).css({ "opacity": 0.4 });
            jQuery('#value_' + id).html(" ");
           }
      });
                                 
      data  = [];
      yaxes = [];
      oaxes = [];
      for(i = 0; i < data_sets.length; i++)
         {
          var id = data_sets[i].id;
          if(LegendHash[id] > 0)
            {
             //console.log("Graphing " + id + " => " + LegendHash[id]);
             data.push(data_sets[i]);
             yaxes.push(yaxes_sets[i]);
             oaxes.push(oaxes_sets[i]);
            }
          else
            {
             //data.push( [ ] );
             yaxes.push( [ ] );
             oaxes.push( [ ] );
            }
         }
        
      // Determine min/max of xaxis
      //
      var axes  = plot.getAxes();
      var Ticks = setTicks(axes.xaxis.min, axes.xaxis.max);
                             
      jQuery.plot(jQuery("#placeholder"), data,
                                          jQuery.extend(true, 
                                                        {}, 
                                                        options, 
                                                        {
                                                         yaxes: yaxes,
                                                         xaxis: { min: axes.xaxis.min, max: axes.xaxis.max, ticks: Ticks }
       }));
                             
      jQuery.plot(jQuery("#overview"), data,
                                          jQuery.extend(true, 
                                                        {}, 
                                                        overviewOptions, 
                                                        {
                                                         yaxes: oaxes,
                                                         xaxis: { min: ox_axis_min, max: ox_axis_max, ticks: oTicks }
       }));
   });

   // Monitor hover
   //
   jQuery('.parameterLegend').hover(
                                function () 
                                  { 
                                    var agency_cd = jQuery(this).prop('id').split(/_/)[1];
                                    var site_no   = jQuery(this).prop('id').split(/_/)[2];
                                    var param_cd  = jQuery(this).prop('id').split(/_/)[3];
                                    var id        = [ agency_cd, site_no ].join("_");
                                    var seriesId  = [ agency_cd, site_no, param_cd ].join("_");
                                    var checkbox  = jQuery(this).prop('id').replace("label_", "checkbox_");
                                    //console.log("ID " +  jQuery(this).prop('id'));
                                    //console.log("Number of series " +  plot.getData().length);

                                    if(jQuery("#" + checkbox).prop('checked'))
                                      {
                                        jQuery(this).css({ "color": "red", "opacity": 0.4 });
                                        var seriesIndex = -99;
                                        var hoverSeries = jQuery.map(plot.getData(),function(series, idx) 
                                                             {
                                                              //console.log("ID " +  seriesId + " series " + series.id);
                                                              if(series.id == seriesId)
                                                                {
                                                                 seriesIndex = idx;
                                                                }

                                                             });
                                       //plot.setData()[seriesIndex].lines.lineWidth = 3;
                                       //plot.draw();
                                      }
                                    },
                                function () 
                                  { 
                                    var agency_cd = jQuery(this).prop('id').split(/_/)[1];
                                    var site_no   = jQuery(this).prop('id').split(/_/)[2];
                                    var param_cd  = jQuery(this).prop('id').split(/_/)[3];
                                    var id        = [ agency_cd, site_no ].join("_");
                                    var seriesId  = [ agency_cd, site_no, param_cd ].join("_");
                                    var checkbox  = jQuery(this).prop('id').replace("label_", "checkbox_");
                                    //console.log("ID " +  jQuery(this).prop('id'));

                                    if(jQuery("#" + checkbox).prop('checked'))
                                      {
                                        jQuery(this).css({ "color": "black", "opacity": 1.0 });

                                        var seriesIndex = -99;
                                        var hoverSeries = jQuery.map(plot.getData(),function(series, idx) 
                                                             {
                                                              if(series.id == seriesId)
                                                                {
                                                                 seriesIndex = idx;
                                                                }

                                                             });
                                       //plot.setData()[seriesIndex].lines.lineWidth = 1;
                                       //plot.draw();
                                      }
                                  }
                               );

   // Legend
   //
   jQuery('.checkBoxes :checkbox').click(function() {

     //var selected   = jQuery(this).prop('name');
     var id          = jQuery(this).prop('id').replace("checkbox_", "");

     //console.log("ID " + id + " checked " + jQuery("#checkbox_" + id).prop('checked') + " legend " + LegendHash[id]);
                                    
     // Enable data set
     //
     if(jQuery("#checkbox_" + id).prop('checked'))
       {
        LegendHash[id] = 1;
        jQuery('#label_' + id).css({ "opacity": 1.0 });
        jQuery('#value_' + id).html(" ");
       }
     else
       {
        LegendHash[id] = 0;
        jQuery('#label_' + id).css({ "opacity": 0.4 });
        jQuery('#value_' + id).html(" ");
       }

     // Loop through data sets
     //
     data  = [];
     yaxes = [];
     oaxes = [];
     for(var i = 0; i < data_sets.length; i++)
        {
         var id = data_sets[i].id;
         if(LegendHash[id] > 0)
           {
            data.push(data_sets[i]);
            yaxes.push(yaxes_sets[i]);
            oaxes.push(oaxes_sets[i]);
           }
         else
           {
            //data.push( [ ] );
            yaxes.push( [ ] );
            oaxes.push( [ ] );
           }
        }
        
     // Determine min/max of xaxis
     //
     var axes  = plot.getAxes();
     var Ticks = setTicks(axes.xaxis.min, axes.xaxis.max);
 
     jQuery.plot(jQuery("#placeholder"), data,
                                         jQuery.extend(true, 
                                                       {}, 
                                                       options, 
                                                       {
                                                         yaxes: yaxes,
                                                         xaxis: { min: axes.xaxis.min, max: axes.xaxis.max, ticks: Ticks }
      }));
 
     jQuery.plot(jQuery("#overview"), data,
                                         jQuery.extend(true, 
                                                       {}, 
                                                       overviewOptions, 
                                                       {
                                                         yaxes: oaxes,
                                                         xaxis: { min: ox_axis_min, max: ox_axis_max, ticks: oTicks }
      }));
   });
            
    // Connect plot and overview
    //
    $("#placeholder").unbind("plotselected");
    $("#placeholder").bind("plotselected", function (event, ranges) {
        // clamp the zooming to prevent eternal zoom
        if (ranges.xaxis.to - ranges.xaxis.from < 0.00001)
            ranges.xaxis.to = ranges.xaxis.from + 0.00001;
        //if (ranges.yaxis.to - ranges.yaxis.from < 0.00001)
        //    ranges.yaxis.to = ranges.yaxis.from + 0.00001;

        // Set interval of labeling
        //
        //var interval = setInterval(ranges.xaxis.from, ranges.xaxis.to);
        var Ticks    = setTicks(ranges.xaxis.from, ranges.xaxis.to);
        //alert("Interval " + interval.join(", "));
        
        // do the zooming
        plot = $.plot($("#placeholder"), data,
                      $.extend(true, {}, options, {
                                                   yaxes: yaxes,
                                                   xaxis: { min: ranges.xaxis.from, max: ranges.xaxis.to, ticks: Ticks }
                      }));
        
        // don't fire event on the overview to prevent eternal loop
        overview.setSelection(ranges, true);
    });
    $("#overview").unbind("plotselected");
    $("#overview").bind("plotselected", function (event, ranges) {
        plot.setSelection(ranges);
    });

    // Hover
    //
    $("#placeholder").bind("plothover", function (event, pos, item) {

        if($("#enableTooltip").prop("checked") === true)
          {
            if(item)
              {
                //var myList    = jQuery.map(item.series, function(element,index) {return index});
                //console.log("Item series id=> " +  item.series.id);
                //console.log("Item series=> " +  item.series.label);
                //console.log("Item seriesIndex=> " +  item.seriesIndex);
                //console.log("Item datapoint=> " +  item.datapoint);
                //console.log("Item dataIndex=> " +  item.dataIndex);
                if(previousPoint != item.datapoint)
                  {
                    var toolTipTxt    = [];
                    var seriesId      = item.series.id;
                    var param_cd      = seriesId.split(/_/)[2];
                    //toolTipTxt.push("Parameter " + param_cd);
                    //toolTipTxt.push("Parameter " + ParmSortedL[item.seriesIndex]);
                    var param_nm      = ParmInfo[param_cd];
                    toolTipTxt.push("Parameter: " + param_nm + "<br />");
                    var remark_cd     = item.series.data[item.dataIndex][2];
                    toolTipTxt.push("measured value " + remark_cd + item.datapoint[1]);
                    toolTipTxt.push("on " + item.series.data[item.dataIndex][3]);
                    
                    $("#tooltip").remove();

                    showTooltip(item.pageX, item.pageY, toolTipTxt.join(" "));

                    previousPoint     = item.datapoint;
                }
            }
            else {
                $("#tooltip").remove();
                previousPoint = null;            
            }
        }
      });

    console.log("Done ");

    return;
  }

function setAxesLabels(plot) 
  {
   // Create a div for each axis
   //
   jQuery.each(plot.getAxes(), function (i, axis) {

   if(!axis.show)
      return;

   var box = axis.box;

   jQuery("<div class='axisTarget' style='position:absolute; left:" + box.left + "px; top:" + box.top + "px; width:" + box.width +  "px; height:" + box.height + "px'></div>")
            .data("axis.direction", axis.direction)
            .data("axis.n", axis.n)
            .css({ backgroundColor: "#f00", opacity: 0, cursor: "pointer" })
            .appendTo(plot.getPlaceholder()).hover(
                                                   function () { $(this).css({ opacity: 0.10 }) },
                                                   function () { $(this).css({ opacity: 0 }) }
                                                  )
                                            .click(function () {
                                               $("#click").text("You clicked the " + axis.direction + axis.n + "axis!")
             });
     });
}

function showTooltip(x, y, contents) 
  {
    $('<div id="tooltip" class="flot_tooltip">' + contents + '</div>').css( {
        top:  y - 15,
        left: x + 15
          }).appendTo("body").fadeIn(200);
    //}).appendTo("#placeholder").fadeIn(200);
          //}).appendTo("body").fadeIn(200);
          //}).appendTo("body");

    //alert("Tooltip X: " + x + " Y: " + y);

    //$("#tooltip").corner( "cc: #000").css("padding","6px");
    //$("#placeholder").css( { "z-index": dz });
  }

function coordIn(element) {
  var x_coordinate = null;
  var y_coordinate = null;

  $('#' + element).mousemove(function (e) {
                         x_coordinate = e.clientX - $('#' + element).offset().left;
                         y_coordinate = e.clientY - $('#' + element).offset().top;
                       });
  return { x: x_coordinate, y: y_coordinate };
}

// Determine text width in pixels
//
function setParamText(param_nm) {

  var text_length = param_nm.length;
  var text_width  = setYaxisLength(param_nm);
  var char_ratio  = text_width / text_length;

  var param_array = param_nm.split(/(\s+)/);

  var param_text  =  [];
  var text        =  [];
  for(var i = 0; i < param_array.length; i++)
     {
      string = text.join(" ");
      if(string.length * char_ratio > 250)
        {
         param_text.push("<br />");
         text = [];
        }
      text.push(param_array[i]);
      param_text.push(param_array[i]);
     }
  

  return param_text.join(" ");
}

// Determine text width in pixels
//
function setYaxisLength(param_nm) {
  // create dummy span
  jQuery('<span id="param_nm"></span>').appendTo("body");
  // set text
  jQuery('#param_nm').text(param_nm);
  // set font parameters
  jQuery('#param_nm').addClass('y1axisLabel');
  // get width
  var width = jQuery('#param_nm').width();
  // Optional:
  jQuery('#param_nm').remove();
  // Return width
  var axisHeight = jQuery('flot-overlay').height();

  return width;
}

// Function to locate y axes
//
function getBoundingBoxForAxis(plot, axis) 
  {
   var left = axis.box.left, top = axis.box.top,
       right = left + axis.box.width, bottom = top + axis.box.height;

   // some ticks may stick out, enlarge the box to encompass all ticks
   var cls = axis.direction + axis.n + 'Axis';
   plot.getPlaceholder().find('.' + cls + ' .tickLabel').each(function () {
        var pos = jQuery(this).position();
        left = Math.min(pos.left, left);
        top = Math.min(pos.top, top);
        right = Math.max(Math.round(pos.left) + jQuery(this).outerWidth(), right);
        bottom = Math.max(Math.round(pos.top) + jQuery(this).outerHeight(), bottom);
   });
        
   return { left: left, top: top, width: right - left, height: bottom - top };
  }


// Function to locate y axes
//
function labelYAxis(plot, axis) 
  {
    // Create a div for each axis
    //
    jQuery.each(plot.getAxes(), function (i, axis) {
      if(!axis.show)
         return;

      //var box = axis.box;
      var box = getBoundingBoxForAxis(plot, axis);

      jQuery("<div class='axisTarget' style='position:absolute; left:" + box.left + "px; top:" + box.top + "px; width:" + box.width +  "px; height:" + box.height + "px'></div>")
				.data("axis.direction", axis.direction)
				.data("axis.n", axis.n)
				.css({ backgroundColor: "#f00", opacity: 0, cursor: "pointer" })
				.appendTo(plot.getPlaceholder())
				.hover(
					function () { $(this).css({ opacity: 0.10 }) },
					function () { $(this).css({ opacity: 0 }) }
				)
				.click(function () {
					$("#click").text("You clicked the " + axis.direction + axis.n + "axis!")
				});

      var yaxisClass = '.flot-y' + i + '-axis';
      var yaxisLabel = $("<div class='axisLabel yaxisLabels'></div>").text("param_nm").appendTo($("#placeholder"));
      yaxisLabel.css("margin-top", yaxisLabel.width() / 2 - 20);
      yaxisLabel.css("margin-left", (box.left - 50));
    });
        
   return;
  }


//Creating a Prototype 
Date.prototype.yyyymmddhhmmss = function() {
   //Grab each of your components
   var yyyy = this.getFullYear().toString();
   var MM = (this.getMonth()+1).toString();
   var dd  = this.getDate().toString();
   var hh = this.getHours().toString();
   var mm = this.getMinutes().toString();
   var ss = this.getSeconds().toString();

   //Returns your formatted result
  return yyyy + '-' + (MM[1]?MM:"0"+MM[0]) + '-' + (dd[1]?dd:"0"+dd[0]) + ' ' + (hh[1]?hh:"0"+hh[0]) + ':' + (mm[1]?mm:"0"+mm[0]) + ':' + (ss[1]?ss:"0"+ss[0]);
};
