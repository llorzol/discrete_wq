/**
* Namespace: helpTips
*
* helpTips is a JavaScript library to set of functions to build
*  a popup for the helpful information.
*
 * version 1.03
 * May 10, 2017
*/

/*
###############################################################################
# Copyright (c) 2017 Oregon Water Science Center
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
var helpStatus = "off";
var helpTitles = {};

// Dynamically enable or disable  help tooltip
//
function setHelp()
  {	
   if(helpStatus === "off")
     {
      helpStatus = "on";
      jQuery("#helpHelp").attr('data-original-title', "Click to disable help text for features and tools");

      for (var selector in helpTitles)
          {
           jQuery(selector).attr('data-original-title', helpTitles[selector]);
          }
     }
   else
     {
      helpStatus = "off";
      jQuery("#helpHelp").attr('data-original-title', "Click to enable help text for features and tools");

      for (var selector in helpTitles)
          {
           jQuery(selector).attr('data-original-title', '');
          }
     }

   //console.log("Help is " + helpStatus);
  }

// Dynamically create tooltip html attributes
//
function setHelpTip(selector, helpText, position)
  {	
   //console.log("setHelpTip " + selector);

   // Set title attribute to empty [if empty no help tool tip enabled]
   //
   var title = '';
   
   // Build help title text
   //
   helpTitles[selector] = helpText;

   if(helpStatus === "on")
     {   
      title = helpText;
     }
   
   jQuery(selector).attr('title', title);
   jQuery(selector).attr('data-placement', position);
   jQuery(selector).attr('data-tooltip', "on");

   jQuery('[data-tooltip="on"]').tooltip({ trigger: 'hover' });
  }

// Replaced by internal bootstrap tool tip
//
function addToolTips()
  {	
   // Dynamically create tooltip html attributes (only for dynamically created elements)
   //
   jQuery(".leaflet-control-minimap").attr("id", "miniMap");
   
   tooltipAttr(jQuery("#enable_disable"), "Enable or disable the ability to zoom using the scrollwheel on your mouse.", "right");
   tooltipAttr(jQuery("#cursorType"), "Click the image to change to the cursor type shown.", "right");
   //tooltipAttr(jQuery("#fullExtent"), "Zoom in as far as possible on the current map view.", "right");
   tooltipAttr(jQuery("#ableTooltip"), "Message tips will popup when you hover over a map feature.  Check the box to hide.", "right");
   tooltipAttr(jQuery("#miniMap"), "Use the mini map to navigate the regional area.", "left");
   tooltipAttr(jQuery('.leaflet-marker-icon'), "click a marker to view site information", "left");
   tooltipAttr(jQuery(".leaflet-control-layers"), "use the layers control to choose how you want data to look and be displayed", "left");
   tooltipAttr(jQuery("#plot_btn"), "Plots may take time to load.  Please be patient.", "right");
   tooltipAttr(jQuery(".fa-home"), "Return to the original full extent", "right");
   	
   //set timers for each tooltip
   jQuery(".hasTooltip").tooltip({'delay': { show: 500}});
   	jQuery('.hasTooltip').on('shown.bs.tooltip', function() {
   		setTimeout(function() {
   			jQuery('.hasTooltip').tooltip('hide');
   		}, 2500);
   	});
   	
   	//make sure all the tooltips are hidden when the page loads
   	jQuery(document).ready(function(){
   		jQuery(".hasTooltip").tooltip('hide');
   	});
   	
   	//enable/disable tooltips
   	jQuery("#ableTooltip").click(function(){
   		if(document.getElementById("ableTooltip").innerHTML === "Hide Message Tips")
   		{
   		jQuery(".hasTooltip").tooltip('disable');
   		document.getElementById("ableTooltip").innerHTML = "Show Message Tips";
   		}
   		else
   		{
   		jQuery(".hasTooltip").tooltip('enable');
   		document.getElementById("ableTooltip").innerHTML = "Hide Message Tips";
   		}
   	});
  }
