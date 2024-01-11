/**
 * Namespace: Global
 *
 * Global is a JavaScript library to set of functions to build
 *  a sites layers from a tab delimiter text file.
 *
 * version 1.22
 * February 17, 2019
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
var isMobile         = false;

// Global variables for cgi scripts
//
var cgiService       = "/cgi-bin/discrete_gw";
var cgiService       = "/cgi-bin/klamath_wells";

var download_url     = "url=http://127.0.0.1/cgi-bin/klamath_wells"
var download_script  = "requestGwRecords.py";

// Set files for About text
//-----------------------------------------------
var aboutFiles     = {
                      "welcome" : "graph_welcome.txt",
                      "graphFeatures" : "graphFeatures.txt",
                      "contacts" : "contacts.txt"
                     };

  
// Control for nav bar topics
//
jQuery('.noJump').click(function(e){

   // Prevent jumping to top of page
   //
   e.preventDefault();

   });

