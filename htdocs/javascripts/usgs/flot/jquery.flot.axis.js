/* NwisWeb Javascript plotting library for jQuery and flot.
 *
 * Gw_Graphing is a JavaScript library to graph NwisWeb groundwater information
 * such as the discrete groundwater measurements for a site(s).
 *
 * version 1.06
 * December 4, 2014
 */

/*
###############################################################################
# Copyright (c) 2014 NwisWeb
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

function days_between(date1_ms, date2_ms) {

  // The number of milliseconds in one day
  var ONE_DAY = 1000 * 60 * 60 * 24;

  // Calculate the difference in milliseconds
  var difference_ms = Math.abs(date1_ms - date2_ms)

  // Convert back to days and return
  return Math.round(difference_ms/ONE_DAY)
}

function Date_MinMax(min, max) {

  var delta_days = days_between(min, max);
  var date_min   = new Date(min);
  var date_max   = new Date(max);

  // Twenty year [20 years]
  //
  if(delta_days > 100 * 365)
    {
      var years    = 20;
      var min_year = date_min.getUTCFullYear();
      var max_year = date_max.getUTCFullYear();
      if(min_year % years > 0)
        {
          var year = Math.ceil( min_year / years ) * years;
          if(year > min_year) { year -= years; }
          min_year = year;
        }
      year = min_year;
      min_date = [min_year, "01", "01"].join("/")
      while ( year <= max_year)
        {
          year += years;
        }
      max_year = year;
      max_date = [max_year, "01", "01"].join("/")
    }

  // Ten year [10 years]
  //
  else if(delta_days > 50 * 365)
    {
      var years    = 10;
      var min_year = date_min.getUTCFullYear();
      var max_year = date_max.getUTCFullYear();
      if(min_year % years > 0)
        {
          var year = Math.ceil( min_year / years ) * years;
          if(year > min_year) { year -= years; }
          min_year = year;
        }
      year = min_year;
      min_date = [min_year, "01", "01"].join("/")
      while ( year <= max_year)
        {
          year += years;
        }
      max_year = year;
      max_date = [max_year, "01", "01"].join("/")
    }

  // Five year [5 years]
  //
  else if(delta_days > 20 * 365)
    {
      var years    = 5;
      var min_year = date_min.getUTCFullYear();
      var max_year = date_max.getUTCFullYear();
      if(min_year % years > 0)
        {
          var year = Math.ceil( min_year / years ) * years;
          if(year > min_year) { year -= years; }
          min_year = year;
        }
      year = min_year;
      min_date = [min_year, "01", "01"].join("/")
      while ( year <= max_year)
        {
          year += years;
        }
      max_year = year;
      max_date = [max_year, "01", "01"].join("/")
    }

  // Two year [2 years]
  //
  else if(delta_days > 10 * 365)
    {
      var years    = 2;
      var min_year = date_min.getUTCFullYear();
      var max_year = date_max.getUTCFullYear();
      if(min_year % years > 0)
        {
          var year = Math.ceil( min_year / years ) * years;
          if(year > min_year) { year -= years; }
          min_year = year;
        }
      year = min_year;
      min_date = [min_year, "01", "01"].join("/")
      while ( year <= max_year)
        {
          year += years;
        }
      max_year = year;
      max_date = [max_year, "01", "01"].join("/")
    }

  // One year [1 year]
  //
  else if(delta_days > 5 * 365)
    {
      var years    = 1;
      //alert("5 Years " + years);
      var min_year = date_min.getUTCFullYear();
      var max_year = date_max.getUTCFullYear();
      //alert("min_year " + min_year + " max_year " + max_year);
      year = min_year;
      min_date = [min_year, "01", "01"].join("/")
      while ( year <= max_year)
        {
          year += years;
        }
      max_year = year;
      max_date = [max_year, "01", "01"].join("/")
      //alert("min_date " + min_date + " max_date " + max_date);
      //alert("min_date " + Date.parse(min_date) + " max_date " + Date.parse(max_date));
    }

  // One year [1 year]
  //
  else if(delta_days > 2 * 365)
    {
      var years    = 1;
      //alert("2 Years " + years);
      var min_year = date_min.getUTCFullYear();
      var max_year = date_max.getUTCFullYear();
      //alert("min_year " + min_year + " max_year " + max_year);
      year = min_year;
      min_date = [min_year, "01", "01"].join("/")
      while ( year <= max_year)
        {
          year += years;
        }
      max_year = year;
      max_date = [max_year, "01", "01"].join("/")
      //alert("min_date " + min_date + " max_date " + max_date);
      //alert("min_date " + Date.parse(min_date) + " max_date " + Date.parse(max_date));
    }

  // One year [1 year]
  //
  else if(delta_days > 1 * 365)
    {
      var years    = 1;
      //alert("1 Year " + years);
      var min_year = date_min.getUTCFullYear();
      var max_year = date_max.getUTCFullYear();
      //alert("min_year " + min_year + " max_year " + max_year);
      year = min_year;
      min_date = [min_year, "01", "01"].join("/")
      while ( year <= max_year)
        {
          year += years;
        }
      max_year = year;
      max_date = [max_year, "01", "01"].join("/")
      //alert("min_date " + min_date + " max_date " + max_date);
      //alert("min_date " + Date.parse(min_date) + " max_date " + Date.parse(max_date));
    }
  else
    {
      x_label = d.getUTCHours() + ":" + padout(d.getUTCMinutes()) + '<br>' + monthNames[d.getUTCMonth()] + "-" + d.getUTCDate() + '<br>' + d.getUTCFullYear();
    }

  return { min: Date.parse(min_date), max: Date.parse(max_date) }
}

function setInterval(min, max) {

  var delta_days = days_between(min, max);
  var interval   = [5, "year"];

  if(delta_days > 10 * 365)
     {
       interval   = [5, "year"];
     }
  else if(delta_days > 5 * 365)
     {
       interval   = [5, "year"];
     }
   else if(delta_days > 2 * 365)
     {
       interval   = [5, "month"];
     }
   else if(delta_days > 10)
     {
       interval   = [5, "month"];
     }
   else if(delta_days > 5)
     {
       interval   = [5, "day"];
     }
   else
     {
       interval   = [5, "hour"];
     }

  return interval;
 }

function setTicks(min, max) {

  var delta_days    = days_between(min, max);
  var Ticks         = [];
  var date_min      = new Date(min);
  var date_max      = new Date(max);
  var delta_days_tx = "100 years";

  if(delta_days > 100 * 365)
     {
       delta_days_tx = "100 years";
       var years     = 20;
       var min_year  = date_min.getUTCFullYear();
       var max_year  = date_max.getUTCFullYear();
       if(min_year % years > 0)
         {
           var year = Math.ceil( min_year / years ) * years;
           if(year > min_year) { year -= years; }
           min_year = year;
         }
       Ticks.push( [ Date.parse([min_year, "01", "01"].join("/")), min_year ] );
       var year = min_year;

       while ( year < max_year)
         {
           year += years;
           Ticks.push( [ Date.parse([year, "01", "01"].join("/")), year ] );
         }
       max_year = year;
       Ticks.push( [ Date.parse([max_year, "01", "01"].join("/")), year ] );
     }

  else if(delta_days > 50 * 365)
     {
       delta_days_tx = "50 years";
       var years     = 10;
       var min_year  = date_min.getUTCFullYear();
       var max_year  = date_max.getUTCFullYear();
       if(min_year % years > 0)
         {
           var year = Math.ceil( min_year / years ) * years;
           if(year > min_year) { year -= years; }
           min_year = year;
         }
       Ticks.push( [ Date.parse([min_year, "01", "01"].join("/")), min_year ] );
       var year = min_year;

       while ( year < max_year)
         {
           year += years;
           Ticks.push( [ Date.parse([year, "01", "01"].join("/")), year ] );
         }
       max_year = year;
       Ticks.push( [ Date.parse([max_year, "01", "01"].join("/")), year ] );
     }

  else if(delta_days > 20 * 365)
     {
       delta_days_tx = "20 years";
       var years     = 5;
       var min_year  = date_min.getUTCFullYear();
       var max_year  = date_max.getUTCFullYear();
       if(min_year % years > 0)
         {
           var year = Math.ceil( min_year / years ) * years;
           if(year > min_year) { year -= years; }
           min_year = year;
         }
       Ticks.push( [ Date.parse([min_year, "01", "01"].join("/")), min_year ] );
       var year = min_year;

       while ( year < max_year)
         {
           year += years;
           Ticks.push( [ Date.parse([year, "01", "01"].join("/")), year ] );
         }
       max_year = year;
       Ticks.push( [ Date.parse([max_year, "01", "01"].join("/")), year ] );
     }

  else if(delta_days > 10 * 365)
     {
       delta_days_tx = "10 years";
       var interval  = 2;
       var min_year  = date_min.getUTCFullYear();
       var max_year  = date_max.getUTCFullYear();
       if(min_year % interval > 0)
         {
           var year = Math.ceil( min_year / interval ) * interval;
           if(year > min_year) { year -= interval; }
           min_year = year;
         }
       var year     = min_year;
       max_year    += interval;

       while ( year < max_year)
         {
           Ticks.push( [ Date.parse([year, "01", "01"].join("/")), year ] );
           year += interval;
         }
       Ticks.push( [ Date.parse([max_year, "01", "01"].join("/")), max_year ] );
     }

  else if(delta_days > 5 * 365)
     {
       delta_days_tx = "5 years";
       var interval  = 1;
       var min_year  = date_min.getUTCFullYear();
       var max_year  = date_max.getUTCFullYear();
       var year      = min_year;
       max_year++;

       while ( year < max_year)
         {
           Ticks.push( [ Date.parse([year, "01", "01"].join("/")), year ] );
           year += interval;
         }
       Ticks.push( [ Date.parse([max_year, "01", "01"].join("/")), year ] );
     }

  else if(delta_days > 2 * 365)
     {
       delta_days_tx  = "2 years";
       var min_year   = date_min.getUTCFullYear();
       var min_month  = date_min.getUTCMonth();
       var start_date = Date.parse([min_year, ++min_month, "01"].join("/"));

       var max_year   = date_max.getUTCFullYear();
       var max_month  = date_max.getUTCMonth();
       var end_date   = Date.parse([max_year, max_month + 2, "01"].join("/"));

       while ( start_date < end_date)
         {
           var start_dt = new Date(start_date);
           var year     = start_dt.getUTCFullYear();
           var month    = start_dt.getUTCMonth();
           var date_str = monthNames[month] + "<br />" + year;
           Ticks.push( [ start_date, date_str ] );

           start_date = start_dt.setFullYear(year, month + 6, 1);
         }
     }

  else if(delta_days > 1 * 365)
     {
       delta_days_tx  = "1 years";
       var min_year   = date_min.getUTCFullYear();
       var min_month  = date_min.getUTCMonth();
       var start_date = Date.parse([min_year, ++min_month, "01"].join("/"));

       var max_year   = date_max.getUTCFullYear();
       var max_month  = date_max.getUTCMonth();
       var end_date   = Date.parse([++max_year, "01", "01"].join("/"));

       while ( start_date < end_date)
         {
           var start_dt = new Date(start_date);
           var year     = start_dt.getUTCFullYear();
           var month    = start_dt.getUTCMonth();
           var date_str = monthNames[month] + "<br />" + year;
           Ticks.push( [ start_date, date_str ] );

           start_date = start_dt.setFullYear(year, month + 4, 1);
         }
     }

  else if(delta_days > 0.5 * 365)
     {
       delta_days_tx  = "0.5 years";
       var min_year   = date_min.getUTCFullYear();
       var min_month  = date_min.getUTCMonth();
       var start_date = Date.parse([min_year, ++min_month, "01"].join("/"));

       var max_year   = date_max.getUTCFullYear();
       var max_month  = date_max.getUTCMonth();
       var end_date   = Date.parse([max_year, max_month + 3, "01"].join("/"));
       //alert("delta_days > 0.5 * 365 start " + start_date + " end " + end_date);

       while ( start_date < end_date)
         {
           var start_dt = new Date(start_date);
           var year     = start_dt.getUTCFullYear();
           var month    = start_dt.getUTCMonth();
           var date_str = monthNames[month] + "<br />" + year;
           Ticks.push( [ start_date, date_str ] );
           //alert("start_date 1 " + start_date + " month " + month + "  year " + year);

           start_date = start_dt.setFullYear(year, month + 3, 1);
           //alert("start_date 2 " + start_date + " month " + month + "  year " + year);
         }
     }

  else if(delta_days > 0.25 * 365)
     {
       delta_days_tx  = "0.25 years";
       var min_year   = date_min.getUTCFullYear();
       var min_month  = date_min.getUTCMonth();
       var start_date = Date.parse([min_year, ++min_month, "01"].join("/"));

       var max_year   = date_max.getUTCFullYear();
       var max_month  = date_max.getUTCMonth();
       var end_date   = Date.parse([max_year, max_month + 2, "01"].join("/"));
       //alert("delta_days > 0.25 * 365 start " + start_date + " end " + end_date);


       while ( start_date < end_date)
         {
           var start_dt = new Date(start_date);
           var year     = start_dt.getUTCFullYear();
           var month    = start_dt.getUTCMonth();
           var date_str = monthNames[month] + "<br />" + year;
           Ticks.push( [ start_date, date_str ] );
           //alert("start_date 1 " + start_date + " month " + month + "  year " + year);

           start_date = start_dt.setFullYear(year, month + 1, 1);
           //alert("start_date 2 " + start_date + " month " + month + "  year " + year);
         }
     }

  else if(delta_days > 100)
     {
       delta_days_tx  = "100 days";
       var min_year   = date_min.getUTCFullYear();
       var min_month  = date_min.getUTCMonth();
       var start_date = Date.parse([min_year, ++min_month, "01"].join("/"));

       var max_year   = date_max.getUTCFullYear();
       var max_month  = date_max.getUTCMonth();
       var end_date   = Date.parse([max_year, max_month + 2, "01"].join("/"));
       //alert("delta_days > 100 start " + start_date + " end " + end_date);


       while ( start_date < end_date)
         {
           var start_dt = new Date(start_date);
           var year     = start_dt.getUTCFullYear();
           var month    = start_dt.getUTCMonth();
           var date_str = monthNames[month] + "<br />" + year;
           Ticks.push( [ start_date, date_str ] );
           //alert("start_date 1 " + start_date + " month " + month + "  year " + year);

           start_date = start_dt.setFullYear(year, month + 1, 1);
           //alert("start_date 2 " + start_date + " month " + month + "  year " + year);
         }
     }

  else if(delta_days > 50)
     {
       delta_days_tx  = "50 days";
       var min_year   = date_min.getUTCFullYear();
       var min_month  = date_min.getUTCMonth();
       var min_day    = date_min.getUTCDate();
       var start_date = Date.parse([min_year, ++min_month, min_day].join("/"));

       var max_year   = date_max.getUTCFullYear();
       var max_month  = date_max.getUTCMonth();
       var max_day    = date_max.getUTCDate();
       var end_date   = Date.parse([max_year, ++max_month, ++max_day].join("/"));
       //alert("delta_days > 50 start " + start_date + " end " + end_date);


       while ( start_date < end_date)
         {
           var start_dt = new Date(start_date);
           var year     = start_dt.getUTCFullYear();
           var month    = start_dt.getUTCMonth();
           var day      = start_dt.getUTCDate();
           var date_str = day + "<br />" + monthNames[month] + "<br />" + year;
           Ticks.push( [ start_date, date_str ] );
           //alert("start_date 1 " + start_date + " month " + month + "  year " + year);

           start_date = start_dt.setFullYear(year, month, day + 10);
           //alert("start_date 2 " + start_date + " month " + month + "  year " + year);
         }
     }

  else if(delta_days > 25)
     {
       delta_days_tx  = "25 days";
       var min_year   = date_min.getUTCFullYear();
       var min_month  = date_min.getUTCMonth();
       var min_day    = date_min.getUTCDate();
       var start_date = Date.parse([min_year, ++min_month, min_day].join("/"));

       var max_year   = date_max.getUTCFullYear();
       var max_month  = date_max.getUTCMonth();
       var max_day    = date_max.getUTCDate();
       var end_date   = Date.parse([max_year, ++max_month, max_day].join("/"));
       //alert("delta_days > 25 start " + start_date + " end " + end_date);


       while ( start_date < end_date)
         {
           var start_dt = new Date(start_date);
           var year     = start_dt.getUTCFullYear();
           var month    = start_dt.getUTCMonth();
           var day      = start_dt.getUTCDate();
           var date_str = day + "<br />" + monthNames[month] + "<br />" + year;
           Ticks.push( [ start_date, date_str ] );
           //alert("start_date 1 " + start_date + " month " + month + "  year " + year);

           start_date = start_dt.setFullYear(year, month, day + 5);
           //alert("start_date 2 " + start_date + " month " + month + "  year " + year);
         }
     }

  else if(delta_days > 10)
     {
       delta_days_tx  = "10 days";
       var min_year   = date_min.getUTCFullYear();
       var min_month  = date_min.getUTCMonth();
       var min_day    = date_min.getUTCDate();
       var start_date = Date.parse([min_year, ++min_month, min_day].join("/"));

       var max_year   = date_max.getUTCFullYear();
       var max_month  = date_max.getUTCMonth();
       var max_day    = date_max.getUTCDate();
       var end_date   = Date.parse([max_year, ++max_month, max_day].join("/"));
       //alert("delta_days > 10 start " + start_date + " end " + end_date);


       while ( start_date < end_date)
         {
           var start_dt = new Date(start_date);
           var year     = start_dt.getUTCFullYear();
           var month    = start_dt.getUTCMonth();
           var day      = start_dt.getUTCDate();
           var date_str = day + "<br />" + monthNames[month] + "<br />" + year;
           Ticks.push( [ start_date, date_str ] );
           //alert("start_date 1 " + start_date + " month " + month + "  year " + year);

           start_date = start_dt.setFullYear(year, month, day + 2);
           //alert("start_date 2 " + start_date + " month " + month + "  year " + year);
         }
     }

  else if(delta_days > 5)
     {
       delta_days_tx  = "5 days";
       var min_year   = date_min.getUTCFullYear();
       var min_month  = date_min.getUTCMonth();
       var min_day    = date_min.getUTCDate();
       var start_date = Date.parse([min_year, ++min_month, min_day].join("/"));

       var max_year   = date_max.getUTCFullYear();
       var max_month  = date_max.getUTCMonth();
       var max_day    = date_max.getUTCDate();
       var end_date   = Date.parse([max_year, ++max_month, ++max_day].join("/"));
       //alert("delta_days > 5 start " + start_date + " end " + end_date);


       while ( start_date < end_date)
         {
           var start_dt = new Date(start_date);
           var year     = start_dt.getUTCFullYear();
           var month    = start_dt.getUTCMonth();
           var day      = start_dt.getUTCDate();
           var date_str = day + "<br />" + monthNames[month] + "<br />" + year;
           Ticks.push( [ start_date, date_str ] );
           //alert("start_date 1 " + start_date + " month " + month + "  year " + year);

           start_date = start_dt.setFullYear(year, month, day + 1);
           //alert("start_date 2 " + start_date + " month " + month + "  year " + year);
         }
     }

  else if(delta_days > 3)
     {
       delta_days_tx  = "3 days";
       var min_year   = date_min.getUTCFullYear();
       var min_month  = date_min.getUTCMonth();
       var min_day    = date_min.getUTCDate();
       var start_date = Date.parse([min_year, ++min_month, min_day].join("/") + " 00:00:00");

       var max_year   = date_max.getUTCFullYear();
       var max_month  = date_max.getUTCMonth();
       var max_day    = date_max.getUTCDate();
       var end_date   = Date.parse([max_year, ++max_month, max_day].join("/") + " 23:59:00");
       //alert("delta_days > 3 start " + start_date + " end " + end_date + " ---> " + new Date(start_date) + " end " + new Date(end_date));


       while ( start_date < end_date)
         {
           var start_dt = new Date(start_date);
           var year     = start_dt.getUTCFullYear();
           var month    = start_dt.getUTCMonth();
           var day      = start_dt.getUTCDate();
           var hour     = start_dt.getUTCHours();
           var date_str = hour + ":00<br />" + day + "<br />" + monthNames[month] + "<br />" + year;
           Ticks.push( [ start_date, date_str ] );
           //alert("start_date 1 " + start_date + "  year " + year + " month " + month + " day " + day + " hour " + hour);

           start_date  += 24 * 60 * 60 * 1000;
           //alert("start_date 2 " + start_date + "  year " + year + " month " + month + " day " + day + " hour " + hour);
         }
     }

  else if(delta_days > 2)
     {
       delta_days_tx  = "2 days";
       var min_year   = date_min.getUTCFullYear();
       var min_month  = date_min.getUTCMonth();
       var min_day    = date_min.getUTCDate();
       var start_date = Date.parse([min_year, ++min_month, min_day].join("/") + " 00:00:00");

       var max_year   = date_max.getUTCFullYear();
       var max_month  = date_max.getUTCMonth();
       var max_day    = date_max.getUTCDate();
       var end_date   = Date.parse([max_year, ++max_month, max_day].join("/") + " 23:59:00");
       //alert("delta_days > 3 start " + start_date + " end " + end_date + " ---> " + new Date(start_date) + " end " + new Date(end_date));


       while ( start_date < end_date)
         {
           var start_dt = new Date(start_date);
           var year     = start_dt.getUTCFullYear();
           var month    = start_dt.getUTCMonth();
           var day      = start_dt.getUTCDate();
           var hour     = start_dt.getUTCHours();
           var date_str = hour + ":00<br />" + day + "<br />" + monthNames[month] + "<br />" + year;
           Ticks.push( [ start_date, date_str ] );
           //alert("start_date 1 " + start_date + "  year " + year + " month " + month + " day " + day + " hour " + hour);

           start_date  += 12 * 60 * 60 * 1000;
           //alert("start_date 2 " + start_date + "  year " + year + " month " + month + " day " + day + " hour " + hour);
         }
     }

  else if(delta_days > 1)
     {
       delta_days_tx  = "1 days";
       var min_year   = date_min.getUTCFullYear();
       var min_month  = date_min.getUTCMonth();
       var min_day    = date_min.getUTCDate();
       var start_date = Date.parse([min_year, ++min_month, min_day].join("/") + " 00:00:00");

       var max_year   = date_max.getUTCFullYear();
       var max_month  = date_max.getUTCMonth();
       var max_day    = date_max.getUTCDate();
       var end_date   = Date.parse([max_year, ++max_month, max_day].join("/") + " 23:59:00");
       //alert("delta_days > 3 start " + start_date + " end " + end_date + " ---> " + new Date(start_date) + " end " + new Date(end_date));


       while ( start_date < end_date)
         {
           var start_dt = new Date(start_date);
           var year     = start_dt.getUTCFullYear();
           var month    = start_dt.getUTCMonth();
           var day      = start_dt.getUTCDate();
           var hour     = start_dt.getUTCHours();
           var date_str = hour + ":00<br />" + day + "<br />" + monthNames[month] + "<br />" + year;
           Ticks.push( [ start_date, date_str ] );
           //alert("start_date 1 " + start_date + "  year " + year + " month " + month + " day " + day + " hour " + hour);

           start_date  += 6 * 60 * 60 * 1000;
           //alert("start_date 2 " + start_date + "  year " + year + " month " + month + " day " + day + " hour " + hour);
         }
     }

  else
     {
       delta_days_tx  = "< 1 days";
       var min_year   = date_min.getUTCFullYear();
       var min_month  = date_min.getUTCMonth();
       var min_day    = date_min.getUTCDate();
       var start_date = Date.parse([min_year, ++min_month, min_day].join("/") + " 00:00:00");

       var max_year   = date_max.getUTCFullYear();
       var max_month  = date_max.getUTCMonth();
       var max_day    = date_max.getUTCDate();
       var end_date   = Date.parse([max_year, ++max_month, max_day].join("/") + " 23:59:00");
       //alert("delta_days > 3 start " + start_date + " end " + end_date + " ---> " + new Date(start_date) + " end " + new Date(end_date));


       while ( start_date < end_date)
         {
           var start_dt = new Date(start_date);
           var year     = start_dt.getUTCFullYear();
           var month    = start_dt.getUTCMonth();
           var day      = start_dt.getUTCDate();
           var hour     = start_dt.getUTCHours();
           var date_str = hour + ":00<br />" + day + "<br />" + monthNames[month] + "<br />" + year;
           Ticks.push( [ start_date, date_str ] );
           //alert("start_date 1 " + start_date + "  year " + year + " month " + month + " day " + day + " hour " + hour);

           start_date  += 3 * 60 * 60 * 1000;
           //alert("start_date 2 " + start_date + "  year " + year + " month " + month + " day " + day + " hour " + hour);
         }
     }

  //alert("setTicks " + delta_days_tx + "\n\t Date min " + date_min + "\n\t Date max " + date_max + "\n\t delta_days " + "\nReturning ticks \n" + Ticks.join("\n "));
  return Ticks;
}

function XtickFormatter(val,axis) {
   var d          = new Date(val);
   var delta_days = days_between(axis.min, axis.max);
   var x_label = d.getUTCFullYear();
   if(delta_days > 10 * 365)
     {
      x_label = d.getUTCFullYear();
      //axis.getAxes().xaxis.tickSize = [5, "year"];
      //plot.getOptions().xaxes[0].tickSize = [5, "year"];
     }
   else if(delta_days > 5 * 365)
     {
      x_label = d.getUTCFullYear();
      //axis.getAxes().xaxis.tickSize = [5, "year"];
      //plot.getOptions().xaxes[0].tickSize = [5, "year"];
     }
   else if(delta_days > 2 * 365)
     {
      x_label = monthNames[d.getUTCMonth()]  + '<br>' + d.getUTCFullYear();
      //axis.getAxes().xaxis.tickSize = [5, "month"];
      //plot.getOptions().xaxes[0].tickSize = [5, "month"];
     }
   else if(delta_days > 1 * 365)
     {
      x_label = monthNames[d.getUTCMonth()] + "-" + d.getUTCDate()  + '<br>' + d.getUTCFullYear();
      //axis.getAxes().xaxis.tickSize = [5, "day"];
      //plot.getOptions().xaxes[0].tickSize = [5, "day"];
     }
   else
     {
      x_label = d.getUTCHours() + ":" + padout(d.getUTCMinutes()) + '<br>' + monthNames[d.getUTCMonth()] + "-" + d.getUTCDate() + '<br>' + d.getUTCFullYear();
      //axis.getAxes().xaxis.tickSize = [5, "hour"];
      //plot.getOptions().xaxes[0].tickSize = [5, "hour"];
     }
   //alert("Val " + val + "\n D " + d + "\n Max " + new Date(axis.max) + "\n Min " + new Date(axis.min) + "\n Range " + delta_days + "\n Label " + x_label);

   return x_label;
 }

function padout(number) {
    return (number < 10) ? '0' + number : number;
 }

function YtickFormatter(v, axis)
  { 
   var vv = -1.0 * v ; 
   return vv;
  }

function roundAlt(alt_acy_va)
  { 
   if(alt_acy_va >= 1)
     {
      return 0;
     }
   else if(alt_acy_va > 0.1)
     {
      return 1;
     }
   else if(alt_acy_va > 0.01)
     {
      return 2;
     }
   else if(alt_acy_va > 0.001)
     {
      return 3;
     }
   else
     {
      return 2;
     }
   return 0;
  }

function rgb2hex(colorval) {
    var parts = colorval.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    delete(parts[0]);
    for (var i = 1; i <= 3; ++i) {
        parts[i] = parseInt(parts[i]).toString(16);
        if (parts[i].length == 1) parts[i] = '0' + parts[i];
    }
    var color = '#' + parts.join('');
    return color;
}

function draw_label(plot, canvascontext) {
    //iterate plot items and get the label
  var data_label = 'XXX';
  var ctx = canvascontext;
  ctx.fillStyle = 'rgb(100, 100, 100)';

  var dt = plot.data[j];
  var x = dt[0];
  var y = dt[1];

  var xAxis = plot.getAxes().xaxis;
  var yAxis = plot.getAxes().yaxis;
  var x_pos = xAxis.p2c(x) + plot.getPlotOffset().left;
  var y_pos = yAxis.p2c(y) + plot.getPlotOffset().top;


  ctx.save();
  ctx.translate(x_pos, y_pos);
  ctx.textAlign = "center";
  ctx.font = "10px tahoma,arial,verdana,sans-serif";
  ctx.fillText(data_label, 0, 0);
  ctx.restore();
}

function draw_label2(plot, canvascontext) {
    //iterate plot items and get the label
  // data array in Flot is used to contain data points; to attach further information for each data point, you can add another array Object (say, name as extraData) in each plot_item. e.g.,
  // {
  //   data:[[0, 1], [2,3]],
  //   extraData: [{label: 'point 1'}, {label: 'point 2'}],
  //   points: {},
  //   bars: {},
  //   ...
  // } 
  var ctx = canvascontext;
  ctx.fillStyle = 'rgb(100, 100, 100)';
   var dtPlot  = plot.getData();
   var item_count = dtPlot.length;
for(var i=0; i<item_count; i++) {
      var plot_item = dtPlot[i];
      var data_count = plot_item.data.length;
    for(var j=0; j<data_count; j++) {
      
       var data_label = plot_item.extraData[j].label;
    
	var dt = plot_item.data[j];
	var x = dt[0];
	var y = dt[1];

	var xAxis = plot.getAxes().xaxis;
	var yAxis = plot.getAxes().yaxis;
	var x_pos = xAxis.p2c(x) + plot.getPlotOffset().left;
	var y_pos = yAxis.p2c(y) + plot.getPlotOffset().top;


	ctx.save();
	ctx.translate(x_pos, y_pos);
	ctx.textAlign = "center";
	ctx.font = "10px tahoma,arial,verdana,sans-serif";
	ctx.fillText(data_label, 0, 0);
	ctx.restore();
    }
  }
}

function AddText2Canvas(plot_canvas, graph_id, text)
  {
    if(graph_id.search(/^[#]/) < 0)
      {
        id = "#" + graph_id;
      }
    var offSet   = $(graph_id).offset();
    var context  = plot_canvas.getContext("2d");
    context.font = "16px helvetica";
    context.fillText(text,offSet.left,offSet.top);
  }

function setColor()
  {
   // Set colors for parameters
   //
   var ColorHash      = new Object();
   var color_array    = [];
   var yaxis_array    = [];
   for(var i = 1; i <= 100; i++)
     {
       var item        = "color_" + i.toString();
       jQuery('<div id="' + item + '"></div>').appendTo("body");
       var div_color   = jQuery('#' + item).css('color');
       if(typeof div_color === "undefined" || div_color === "null") { jQuery('#' + item).remove(); break; }
       var graph_color = div_color;
       if(div_color.match(/^rgb/i))
         {
          graph_color = rgb2hex(div_color);
         }
       if(graph_color === "#000000") { jQuery('#' + item).remove(); break; }
       color_array.push(graph_color);
       yaxis_array.push(graph_color);
       ColorHash[i] = color_array[i - 1];
       jQuery('#' + item).remove();
     }

   return ColorHash;
  }
