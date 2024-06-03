/* Javascript library for checking URL arguments.
 *
 * Main is a JavaScript library to graph NwisWeb well construction information
 * for a site(s).
 *
 * version 2.02
 * May 30, 2024
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

function checkSiteId(site_id) {

  var message = "Incorrectly formatted USGS site number or OWRD well log ID or CDWR well number: ";
  message    += "You must use the USGS station numbers, which are a number ";
  message    += "from 8 to 15 digits long. ";
  message    += "You must use the OWRD well log ID, which has a four-character county abbrevation ";
  message    += "along with from 1 to 7 digit well number. ";
  message    += "You must use the CDWR well numbers, which are 18-character string well number. ";
                
    if(!site_id)
      {
        openModal(message);
        fadeModal(10000)
        return null;
      }
                
    site_id  = site_id.trim();

    // Test for USGS site number
    //
    var myRe = /^(\d{8,15})$/g;
    if(myRe.test(site_id))
      {
        return site_id;
      }

    // Test for OWRD well log ID
    //
    var myRe = /^([a-z]{4}){1}\s*(\d+)$/i;
    if(myRe.test(site_id))
      {
        var countyNam  = site_id.substring(0,4).toUpperCase();
        var wellId     = site_id.substring(4).trim();
        var site_id    = countyNam + ('0000000' + wellId).slice(-7);
        return site_id;
      }
                   
    // Test for CDWR well number
    //
    var myRe = /^([a-z0-9]{18})$/i;
    if(myRe.test(site_id))
      {
        return site_id;
      }
                   
    // Message
    //
    openModal(message);
    fadeModal(6000)
                   
    // Return
    //
    return null;
}

function checkSiteId2(site) {

    if(!site)
      {
        openModal(message);
        fadeModal(6000)
        return false;
      }
    site  = site.trim();
    var myRe = /^[a-z0-9]+$/i;
    if(!myRe.test(site))
      {
        openModal(message);
        fadeModal(6000)
        return false;
      }

    return site;
}

function checkSiteNo(site_no) {

    if(!site_no)
      {
        var message = "Incorrectly formatted USGS site number: ";
        message    += "You must use the USGS station numbers, which are a number ";
        message    += "from 8 to 15 digits long (example 433152121281301). ";
        openModal(message);
        fadeModal(10000)
        return false;
      }
    site_no  = site_no.trim();
    var myRe = /^\d{8,15}$/;
    if(!myRe.test(site_no))
      {
        var message = "Incorrectly formatted USGS site number: ";
        message    += "You must use the USGS station numbers, which are a number ";
        message    += "from 8 to 15 digits long (example 433152121281301). ";
        openModal(message);
        fadeModal(6000)
        return false;
      }

    return site_no;
}

function checkCoopSiteNo(coop_site_no) {

    if(!coop_site_no)
      {
        var message = "Incorrectly formatted OWRD well log ID: ";
        message    += "You must use the OWRD well log ID, which has a four-character county abbrevation ";
        message    += "along with from 1 to 7 padded digit well number.";
        openModal(message);
        fadeModal(6000)
        return false;
      }
    coop_site_no = coop_site_no.trim();
    var myRe = /^([a-z]{4})(\d{7})$/i;
    if(!myRe.test(coop_site_no))
      {
        var message = "Incorrectly formatted OWRD well log ID: ";
        message    += "You must use the OWRD well log ID, which has a four-character county abbrevation ";
        message    += "along with from 1 to 7 padded digit well number.";
        openModal(message);
        fadeModal(6000)
        return false;
      }

    return coop_site_no;
}

function checkProject(project) {
    project       = project.trim();
    var myProject = /^[A-Za-z0-9_]+$/;
    if(!myProject.test(project))
      {
        var message = "Incorrectly formatted USGS project name";
        openModal(message);
        fadeModal(6000)
        return false;
      }

    return project;
}
