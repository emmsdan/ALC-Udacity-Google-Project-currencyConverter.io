/*!
 * currency.js - v1.1.4
 * http://scurker.github.io/currency.js
 *
 * Copyright (c) 2018 Jason Wilson
 * Released under MIT license
 */
(function(f,d){"object"===typeof exports&&"undefined"!==typeof module?module.exports=d():"function"===typeof define&&define.amd?define(d):f.currency=d()})(this,function(){function f(b,a){if(!(this instanceof f))return new f(b,a);a=l({},m,a);var c=Math.pow(10,a.precision);this.intValue=b=d(b,a);this.value=b/c;a.increment=a.increment||1/c;a.groups=a.useVedic?n:p;this.s=a;this.p=c}function d(b,a){var c=2<arguments.length&&void 0!==arguments[2]?arguments[2]:!0,g=a.decimal,d=a.errorOnInvalid;var e=Math.pow(10,
a.precision);var h="number"===typeof b;if(h||b instanceof f)e*=h?b:b.value;else if("string"===typeof b)d=new RegExp("[^-\\d"+g+"]","g"),g=new RegExp("\\"+g,"g"),e=(e*=b.replace(/\((.*)\)/,"-$1").replace(d,"").replace(g,"."))||0;else{if(d)throw Error("Invalid Input");e=0}e=e.toFixed(1);return c?Math.round(e):e}var l=Object.assign||function(b){for(var a=1;a<arguments.length;a++){var c=arguments[a],g;for(g in c)Object.prototype.hasOwnProperty.call(c,g)&&(b[g]=c[g])}return b},m={symbol:"$",separator:",",
decimal:".",formatWithSymbol:!1,errorOnInvalid:!1,precision:2},p=/(\d)(?=(\d{3})+\b)/g,n=/(\d)(?=(\d\d)+\d\b)/g;f.prototype={add:function(b){var a=this.s,c=this.p;return f((this.intValue+d(b,a))/c,a)},subtract:function(b){var a=this.s,c=this.p;return f((this.intValue-d(b,a))/c,a)},multiply:function(b){var a=this.s;return f(this.intValue*b/Math.pow(10,a.precision),a)},divide:function(b){var a=this.s;return f(this.intValue/d(b,a,!1),a)},distribute:function(b){for(var a=this.intValue,c=this.p,g=this.s,
d=[],e=Math[0<=a?"floor":"ceil"](a/b),h=Math.abs(a-e*b);0!==b;b--){var k=f(e/c,g);0<h--&&(k=0<=a?k.add(1/c):k.subtract(1/c));d.push(k)}return d},dollars:function(){return~~this.value},cents:function(){return~~(this.intValue%this.p)},format:function(b){var a=this.s,c=a.formatWithSymbol,d=a.symbol,f=a.separator,e=a.decimal;a=a.groups;"undefined"===typeof b&&(b=c);b=((b?d:"")+this).split(".");c=b[1];return""+b[0].replace(a,"$1"+f)+(c?e+c:"")},toString:function(){var b=this.s,a=b.increment;return(Math.round(this.intValue/
this.p/a)*a).toFixed(b.precision)},toJSON:function(){return this.value}};return f});
