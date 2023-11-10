(function (ActionAppCore, $) {

    var SiteMod = ActionAppCore.module("site");

    //~thisPageSpecs//~
var thisPageSpecs = {
	"pageName": "Home",
	"pageTitle": "Home",
	"navOptions": {
		"topLink": false,
		"sideLink": true
	}
}
//~thisPageSpecs~//~

    var pageBaseURL = 'app/pages/' + thisPageSpecs.pageName + '/';

    //~layoutOptions//~
thisPageSpecs.layoutOptions = {
  baseURL: pageBaseURL,
  north: false,
  east: { html: "east" },
  west: false,
  center: { control: "HomeControl", source: "__app" },
  south: false
}
//~layoutOptions~//~

    //~layoutConfig//~
thisPageSpecs.layoutConfig = {
        west__size: "500"
        , east__size: "250"
    }
//~layoutConfig~//~
    //~required//~
thisPageSpecs.required = {

    }
//~required~//~

    var ThisPage = new SiteMod.SitePage(thisPageSpecs);

    var actions = ThisPage.pageActions;

    ThisPage._onPreInit = function (theApp) {
        //~_onPreInit//~

//~_onPreInit~//~
    }

    ThisPage._onInit = function () {
        //~_onInit//~

//~_onInit~//~
    }


    ThisPage._onFirstActivate = function (theApp) {
        //~_onFirstActivate//~

//~_onFirstActivate~//~
        ThisPage.initOnFirstLoad().then(
            function () {
                //~_onFirstLoad//~

ThisApp.openPage({page:"Logo"});

//~_onFirstLoad~//~
                ThisPage._onActivate();
            }
        );
    }


    ThisPage._onActivate = function () {
        //~_onActivate//~

//~_onActivate~//~
    }

    ThisPage._onResizeLayout = function (thePane, theElement, theState, theOptions, theName) {
        //~_onResizeLayout//~

//~_onResizeLayout~//~
    }

    //------- --------  --------  --------  --------  --------  --------  -------- 
    //~YourPageCode//~
actions.runTest = function() {
  alert('home runTest');
}


actions.connect = function(){
   ThisPage.parts.center.connect()
}
actions.disconnect = function(){
   ThisPage.parts.center.disconnect()
}

actions.micOn = function(){
    console.log( 'micOn actions');
   ThisPage.parts.center.micOn()
}
actions.micOff = function(){
   ThisPage.parts.center.micOff()
}



actions.doRefresh = function() {
  window.location = window.location;
}


// actions.localMicOn = function(){
//   ThisPage.parts.center.connect()
// }
// actions.localMicOff = function(){
//   ThisPage.parts.center.disconnect()
// }
//~YourPageCode~//~

})(ActionAppCore, $);
