/* NwisWeb Javascript plotting library for jQuery and flot.
 *
 * Main is a JavaScript library to graph NwisWeb groundwater information
 * such as the discrete groundwater measurements for a site(s).
 *
 * version 1.02
 * April 19, 2014
 */

/*
###############################################################################
# Copyright (c) 2014 NwisWeb Leonard L Orzol
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

// Toggle Site Specific Text
//-------------------------------------------------
jQuery(".site_tx_header_div").click(function() 
  {
    jQuery(this).next("#site_tx").slideToggle(500);

    var divText = jQuery(".site_tx_header_div").html();

    if(divText.indexOf('Click for') != -1) 
      {
        jQuery("#site_header_tx").replaceWith( "<span id='site_header_tx'>Click to hide General Site Information</span>" );

        jQuery("#collapsingSiteIcon").removeClass('ui-icon-circle-plus');
        jQuery("#collapsingSiteIcon").addClass('ui-icon-circle-minus');
      } 

    else 
      {
        jQuery("#site_header_tx").replaceWith( "<span id='site_header_tx'>Click for General Site Information</span>" );

        jQuery("#collapsingSiteIcon").removeClass('ui-icon-circle-minus');
        jQuery("#collapsingSiteIcon").addClass('ui-icon-circle-plus');
      }
});


