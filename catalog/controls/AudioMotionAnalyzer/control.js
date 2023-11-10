(function (ActionAppCore, $) {

	var ControlSpecs = { 
		options: {
			padding: true
		},
		content: [
		{
			ctl: "spot",
			name: "AudioMotionAnalyzerBody",
			text: '<div id="containermic"></div>'
		}
		]
	}

	var ControlCode = {};

  var currStream = false,
     audioMotion = false;
     
  

  ControlCode.initSetup = initSetup;
  function initSetup() {

    // instantiate analyzer
    audioMotion = new AudioMotionAnalyzer(
      document.getElementById('containermic'),
      {
        gradient: 'rainbow',
        height: window.innerHeight - 40,
        showScaleY: true,
        useCanvas: true,
        onCanvasDraw: function(instance){
          ThisApp.common.eqDataMic = {
            bands: instance.getBars(),
            peak: instance.getEnergy('peak'),
            bass: instance.getEnergy('bass'),
            lowMid: instance.getEnergy('lowMid'),
            mid: instance.getEnergy('mid'),
            highMid: instance.getEnergy('highMid'),
            treble: instance.getEnergy('treble')
          }


          // for (const bar of instance.getBars()) {

          //   const value = bar.value[0],
          //   peak = bar.peak[0],
          //   hold = bar.hold[0],
          //   isPeakUp = hold > 0 && peak > 0; // if hold < 0 the peak is falling down

          //   // // build our visualization using only DIVs
          //   // html += `<div class="bar" style="height: ${ value * 100 }%; background: rgba( 255, 255, 255, ${ value } )">
          //   // 		<div class="peak" style="bottom: ${ ( peak - value ) * -maxHeight }px; ${ isPeakUp ? 'box-shadow: 0 0 10px 1px #f00' : 'opacity: ' + ( peak > 0 ? .7 : 0 ) }"></div>
          //   // 	 </div>`;
          // }

        }

      }
    );
    window.audioMotionInUse = audioMotion;

    audioMotion.mode = 6;

  }


ControlCode.micOn = micOn;
  function micOn() {
    console.log( 'micOn ctl');

    if ( navigator.mediaDevices ) {
    navigator.mediaDevices.getUserMedia( {
      audio: true, video: false
    }).then(function(stream){
        const micStream = audioMotion.audioCtx.createMediaStreamSource(stream);
        audioMotion.connectInput(micStream);
        audioMotion.volume = 0;
      })
      .catch(function(err){
        console.error('Error accessing mic',err);
      });

    } else {
      console.error('Mic not supported');      
    }
  }

  ControlCode.micOff = micOff;
  function micOff() {
    if( audioMotion ){
      audioMotion.disconnectInput(false, true);
    }
  }



     



























    ControlCode.setup = setup;
    function setup(){
        console.log("Ran setup")
    }

    ControlCode._onInit = _onInit;
    function _onInit(){
        initSetup();
    }

	var ThisControl = {specs: ControlSpecs, options: { proto: ControlCode, parent: ThisApp }};
	return ThisControl;
})(ActionAppCore, $);