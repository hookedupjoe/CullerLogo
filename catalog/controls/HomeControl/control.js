(function (ActionAppCore, $) {

	var ControlSpecs = {
	  options: {
		padding: false,
		required: {
		  templates: {
			map:
			{
			  "HomeControlMain": {
				source: "__app", name: "HomeControlMain"
			  }
			}
		  }
		}
	  },
	  content: [{
		ctl: "spot",
		name: "body",
		text: ""
	  },{
		ctl: "control",
		hidden: true,
		controlname: "AudioMotionAnalyzer",
		name: "audiomotion",
		source: "__app"
	  }
	  
	  ]
	}
  
	var ControlCode = {};
  
	var hasShown = 0;
	 
	  
  
	ControlCode.micOn = function(){
	  this.parts.audiomotion.micOn()
	}	
  
	ControlCode.micOff = function(){
	  this.parts.audiomotion.micOff()
	}	
  
  
	
	function RGBtoHSV(r, g, b) {
	  if (arguments.length === 1) {
		g = r.g,
		b = r.b,
		r = r.r;
	  }
	  var max = Math.max(r, g, b),
	  min = Math.min(r, g, b),
	  d = max - min,
	  h,
	  s = (max === 0 ? 0: d / max),
	  v = max / 255;
  
	  switch (max) {
		case min: h = 0; break;
		case r: h = (g - b) + d * (g < b ? 6: 0); h /= 6 * d; break;
		case g: h = (b - r) + d * 2; h /= 6 * d; break;
		case b: h = (r - g) + d * 4; h /= 6 * d; break;
	  }
  
	  return {
		h: h,
		s: s,
		v: v
	  };
	}
	function HSVtoRGB(h, s, v) {
	  let f = (n, k = (n+h/60)%6) => v - v*s*Math.max(Math.min(k, 4-k, 1), 0);
	  var tmpR = f(5);
	  var tmpG = f(3);
	  var tmpB = f(1);
  
	  return {
		r: tmpR*255,
		g: tmpG*255,
		b: tmpB*255
	  };
	}
  
	
	
	ControlCode.setElemColor = function(theOffset) {
  
	  // var tmpAllColors = ThisApp.getByAttr$({
	  //     svguse: "color"
	  // });
	//   var tmpBC1 = tmpData.b8;
		  // var tmpBC2 = tmpData.b27;
		  // var tmpCol1 = $(this.charElems[1]);
		  // var tmpCol2 = $(this.charElems[11]);
			  
			  console.log('eqData',this.eqData);
  
	  for (var i = 0; i < this.charElems.length; i++) {
		var tmpEntry = $(this.charElems[i]);
		var tmpID = tmpEntry.attr('id');
		//console.log('tmpID',tmpID);
		//var tmpFillRGB = tmpEntry.css('fill');
		var tmpOrig = this.elemIndex[tmpID].colors;
		
		
		var tmpNewH = tmpOrig.h;
		tmpNewH += theOffset;
		if( tmpNewH > 360 ){
		  tmpNewH = tmpNewH - 360;
		}
		var tmpS = tmpOrig.s/255;
		 var tmpV = tmpOrig.v/255;
		//console.log('tmpNewH, tmpS, tmpV',tmpNewH, tmpS, tmpV);
		var tmpBand = (i+1)*2;
		var tmpBandVal = this.eqData['B'+tmpBand];
		var tmpAdjBVal = (tmpBandVal/255)*155;
		
		tmpBandVal = 100 + tmpAdjBVal;
		var tmpV = tmpBandVal/255;
		//console.log('tmpBandVal',tmpBandVal);
		
		var tmpNewRGB = HSVtoRGB(tmpNewH, tmpS, tmpV)
		var tmpNewRGBFill = 'rgb(' + tmpNewRGB.r + ',' + tmpNewRGB.g + ',' + tmpNewRGB.b + ')';
		//console.log('tmpEntry',tmpNewRGBFill);
		tmpEntry.css('fill', tmpNewRGBFill);
	  }
	}
  
	
	ControlCode.testColorChange = function() {
  
	  var tmpAllColors = ThisApp.getByAttr$({
		  svguse: "color"
	  });
	
	
	  for (var i = 0; i < tmpAllColors.length; i++) {
		var tmpEntry = $(tmpAllColors[i]);
		allColors.push(tmpEntry);
	
		var tmpFill = tmpEntry.css('fill');
		var tmpColors = tmpFill.replace('rgb(', '').replace(')', '').replace(' ', '');
		tmpColors = tmpColors.split(',');
		var tmpR = parseInt(tmpColors[0]);
		var tmpG = parseInt(tmpColors[1]);
		var tmpB = parseInt(tmpColors[2]);
		var tmpHSV = RGBtoHSV(tmpR, tmpG, tmpB);
		var tmpH = tmpHSV.h
		var tmpS = tmpHSV.s;
		var tmpV = tmpHSV.v;
		tmpH = 360*tmpH;
		tmpH += hueOffset;
		if (tmpH > 360) {
		  tmpH = tmpH - 360;
		}
		var tmpBrtInt = 255*tmpV;
		tmpBrtInt += brtOffset;
		if (tmpBrtInt > 255) {
		  tmpBrtInt = tmpBrtInt - 255;
		}
		if (tmpBrtInt < 100) {
		  tmpBrtInt = 100;
		}
		tmpV = tmpBrtInt/255;
		var tmpNewRGB = HSVtoRGB(tmpH, tmpS, tmpV)
		console.log('tmpH, tmpS, tmpV',tmpH, tmpS, tmpV);
		var tmpNewRGBFill = 'rgb(' + tmpNewRGB.r + ',' + tmpNewRGB.g + ',' + tmpNewRGB.b + ')';
		tmpEntry.css('fill', tmpNewRGBFill);
	  }
	}
  
	ControlCode.setup = setup;
	function setup() {}
  
	function getColorsFromFillValue(theCSSValue){
	  var tmpColors = theCSSValue.replace('rgb(', '').replace(')', '').replace(' ', '');
		tmpColors = tmpColors.split(',');
		var tmpR = parseInt(tmpColors[0]);
		var tmpG = parseInt(tmpColors[1]);
		var tmpB = parseInt(tmpColors[2]);
		var tmpColors = RGBtoHSV(tmpR, tmpG, tmpB);
  
		tmpColors.r = tmpR;
		tmpColors.g = tmpG;
		tmpColors.b = tmpB;
		
		tmpColors.h = Math.round(tmpColors.h * 360);
		tmpColors.s = Math.round(tmpColors.s * 255 );
		tmpColors.v = Math.round(tmpColors.v * 255 );
		
		return tmpColors
	}
	
	
	ControlCode._onInit = _onInit;
	function _onInit() {
	  window.HomeControlMain = this;
	  this.showDebug = false;
	  this.loadSpot('body', {}, 'HomeControlMain');
  
	  this.winsock = this.parts.winsock;
	  //this.wstool = this.winsock.wstool;
	  
	  // window.addEventListener('contextmenu', (event) => {
	  //   ThisApp.gotoPage('Home');    
	  // })
  
	  
	  //ThisApp.openPage('ThreeJSPlay');
	  this.micOn();
	}
   
  
	var ThisControl = {
	  specs: ControlSpecs,
	  options: {
		proto: ControlCode,
		parent: ThisApp
	  }};
	return ThisControl;
  })(ActionAppCore, $);