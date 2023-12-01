(function (ActionAppCore, $) {

  var ControlSpecs = {
    options: {
      padding: false
    },
    content: [{
      ctl: "spot",
      name: "puppet_stage",
      styles: "min-height:400px;",
      text: ""
    }]
  }
  var ControlCode = {};
  var RGBELoader = ActionAppCore.three.addons.RGBELoader;
  var GLTFLoader = ActionAppCore.three.addons.GLTFLoader;
  var OrbitControls = ActionAppCore.three.addons.OrbitControls;



  //ControlCode.sizeControl = sizeControl;
  var sizeControl = {
    innerWidth: 0,
    innerHeight: 0
  }


  
  
  
  ControlCode.refreshSize = function() {
    sizeControl.innerWidth = 300;
    sizeControl.innerHeight = 300;

  }


  ControlCode.render = function() {
    this.renderer.render();

  }


  ControlCode.toggleBack = function() {
    this.partsBin.part_outline.visible = !this.partsBin.part_outline.visible;
    this.render() 
  }

  ControlCode.toggleInner = function() {
    this.partsBin.part_helmet.visible = !this.partsBin.part_helmet.visible;
    this.partsBin.part_sun.visible = !this.partsBin.part_sun.visible;
    this.partsBin.part_bottom.visible = !this.partsBin.part_bottom.visible;
    this.partsBin.part_top.visible = !this.partsBin.part_top.visible;
    this.render() 
  }

  ControlCode._onResize = function() {
    this.refreshSize();
    //console.log('_onResize', this);
    sizeControl.innerWidth = this.getEl().innerWidth();
    sizeControl.innerHeight = this.getEl().innerHeight();
    this.camera.aspect = sizeControl.innerWidth / sizeControl.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(sizeControl.innerWidth, sizeControl.innerHeight);
    this.render();
  }

  
  
  ControlCode.initMaterials = initMaterials;
  function initMaterials(theScene, thePrefix) {
    this.partsBin = {};
    window.activeControl = this;
    var model = theScene;
    var self = this;
    model.traverse((o) => {

      if (o.isMesh ){
        //o.material =  new THREE.MeshStandardMaterial();
        console.log('o.isMesh',o.name)
        self.partsBin[o.name] = o;
      }
    });
  }

  var voiceBandMin = 20;
  
    
  function amtForVoiceBand(theValue, theBand){
    return theValue;
    var tmpVal = Math.max(voiceBandMin,theValue);
    var tmpRet = tmpVal/255;
    return tmpRet;
  }
  function amtForIntensityBand(theValue, theBand){
    var tmpVal = Math.max(voiceBandMin,mapNumber(theValue, 0,128,0,255));
    var tmpRet = tmpVal/255;
    return tmpRet;
  }
  var tmpCtr = 0;
  
  
  function amtFromXPos(theValue, theBand){
    var tmpVal = Math.max(voiceBandMin,mapNumber(theValue, 0,800,20,255));
    var tmpRet = tmpVal/255;
    return tmpRet;
  }
  
  function amtForLevelBand(theValue, theBand){
    var tmpValue = theValue * 255;
    var tmpVal = Math.max(voiceBandMin,mapNumber(tmpValue, 0,255,30,230));
    var tmpRet = tmpVal/255;
    return tmpRet;
  }
  

  function getAvg(theVals){
    var tmpTot = getTot(theVals);
    return tmpTot/theVals.length;
  }
  function getTot(theVals){
    var tmpTot = 0;
    for( var iPos in theVals ){
      tmpTot += theVals[iPos];
    }
    return tmpTot;
  }


    function cycleByte(theAmt, theOffset){
      theAmt += theOffset;
      if( theAmt > 255){
        theAmt -= 255;
      }
      return theAmt;
    }


  //--- Dance
  //--- ToDo: Make them hot swappable 
    ControlCode.reactionSpeak = function(){
    
    if( !this.mainChar ){
      return;
    }
    this.reactionSpeakInfo = this.reactionSpeakInfo || {};
           // var tmpVol = ThisApp.common.eqData.B15 || 0;
    //var tmpEQ = ThisApp.common.eqData;
    
    var tmpEQMic = ThisApp.common.eqDataMic;
    var tmpLED;
    var tmpMinAmt = .10



    var tmpVoiceTest = getTot([tmpEQMic.lowMid,tmpEQMic.highMid]);
    if( this.reactionSpeakInfo.lastAmt == tmpVoiceTest ){
      return;
    }
    
    
    
    // tmpVoiceTest = tmpVoiceTest * 100;
    // if( tmpVoiceTest < 15){
    //   console.log('tmpVoiceTest no',tmpVoiceTest);  
    //   return;
    // }

    var tmpAmt = (bandVal(13) + bandVal(14) + bandVal(15) + bandVal(16) + bandVal(17) + bandVal(18) + bandVal(19));
    // tmpAmt /= 7;
    // tmpAmt = this.mapNumber(tmpAmt, 30, 255, 0, 20);
    
    // if( tmpAmt > 20 ){
    //   tmpAmt = 20;
    // }
    // if( tmpAmt < 0 ){
    //   tmpAmt = 0;
    // }
    //tmpAmt = Math.round(tmpAmt);

    //tmpAmt = tmpAmt/255;
    // console.log('tmpAmt',tmpAmt);
    // console.log('bandVal(13)',bandVal(13));
    // console.log('tmpEQMic.highMid',tmpEQMic.mid);
    


    if( tmpAmt < 2 ){
      return;
    }
    var tmpScaleAmt = 1 + ((tmpAmt - 2) / 10);
console.log('tmpScaleAmt',tmpScaleAmt);
    
    this.reactionSpeakInfo.lastAmt = tmpVoiceTest;
    
    var tmpScale = tmpScaleAmt; //1 + (tmpEQMic.mid);
    
    console.log('tmpEQMic.mid',tmpEQMic.mid);  
    
    var tmpPart = this.partsBin.part_sun;
    if( !this.partsBin.part_sun.visible ){
      tmpPart = this.partsBin.part_outline;
    }
    tmpPart.scale.x = tmpScale
    tmpPart.scale.y = tmpScale
    tmpPart.scale.z = tmpScale
   
  }
  
  

  function bandVal(theBand){
    if(!(ThisApp.common.eqDataMic)){
      return;
    }
    return amtForLevelBand(ThisApp.common.eqDataMic.bands[theBand].value[0],theBand);
  }

  
  var watchDog1 = 0;
  ControlCode.startMusicResponse = startMusicResponse;
  function startMusicResponse(){
    
    // update the display based on data
    var self = this;
    this.danceInterval = d3.interval(function () {
     
      try {
        
        if((self.reactionSpeak)){
         
          var tmpRefresh = self.reactionSpeak();
          if( tmpRefresh !== false ){
            self.render();
          }
          
        }
        
    } catch (ex) {
        //temp -> 
        if( watchDog1++ > 10){
          self.stopMusicResponse();
          return;
        }
         //console.log('s',self);
        console.error("Error ", ex);
      }
    },
      5);
  }
  
  ControlCode.stopMusicResponse = stopMusicResponse;
  function stopMusicResponse(){
    if( !this.danceInterval ) return;
    console.log( 'Response Stopped');      
    this.danceInterval.stop();
  }


  ControlCode.mapNumber = mapNumber;
  function mapNumber (number, inMin, inMax, outMin, outMax) {
    return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
  }

  var scene,anim,mainRes;

ControlCode.runDemo1 = runDemo1;
  function runDemo1(theScene) {
    var tmpEach = 1/18;
    for (var iRow = 1; iRow <= 4; iRow++) {
      for (var iCol = 0; iCol < 18; iCol++) {
        var tmpColLED = (iCol+1);
        if (tmpColLED < 10) {
          tmpColLED = '0' + tmpColLED;
        }
        //console.log("led_01_" + tmpColLED);
        var tmpLED = theScene.getObjectByName('led_0' + iRow + '_' + tmpColLED);
        var tmpH = (tmpEach*iCol);
        tmpLED.material.emissive.setHSL(tmpH, 1, 1);
        tmpLED.material.emissiveIntensity = (iRow * .85);
      }
    }
    this.render();
  }



  ControlCode.render = render;
  function render() {
    //console.log( 'render', 'this',this);
    if( !(this.renderer)) return;
    
    this.renderer.render(this.scene, this.camera);
  }

  ControlCode.runAnim = function(){
    console.log('runAnim');
    let mesh = mainRes;

// Create an AnimationMixer, and get the list of AnimationClip instances
const mixer = new THREE.AnimationMixer( mesh );
const clips = mesh.animations;

// Update the mixer on each frame
function update () {
mixer.update( deltaSeconds );
}

// Play a specific animation
const clip = THREE.AnimationClip.findByName( clips, 'foot_right_tap' );
console.log('clip',clip)
const action = mixer.clipAction( clip );
action.play();

// Play all animations
clips.forEach( function ( clip ) {
mixer.clipAction( clip ).play();
} );

  }


  ControlCode.initScene = initScene;
  function initScene() {
    let camera,
    renderer;
    let helmet;



    const container = this.getSpot('puppet_stage').get(0);


    camera = new THREE.PerspectiveCamera(45, sizeControl.innerWidth / sizeControl.innerHeight, 0.25, 20);
    camera.position.set(- 4.8, 0.6, 2.7);

    this.camera = camera;
    scene = new THREE.Scene();
    this.scene = scene;

    var self = this;
  
  

  new RGBELoader()
    .setPath('./res/textures/equirectangular/')
    .load('royal_esplanade_1k.hdr', function (texture) {

      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = texture;
      const loader = new GLTFLoader().setPath('./res/models/Logo/');
        loader.load('logo.gltf', function (theRes) {
        mainRes = theRes;
        helmet = theRes.scene;
        anim = theRes.animations;
        window.anim = anim;
        self.mainChar = theRes.scene;
        //debug
        window.helmet = helmet;
        window.render = render;
        scene.add(helmet);
        
        //-->nodaft 
        self.initMaterials(helmet, 'led_');
        //-->nodaft self.runDemo1(helmet);

        self.render()

        //console.log('init render done')

      });

    });
    
    renderer = new THREE.WebGLRenderer( {
      antialias	: true,
      alpha : true,
  });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(sizeControl.innerWidth, sizeControl.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    container.appendChild(renderer.domElement);
    this.renderer = renderer;

    var toRender = render.bind(self);
    window.jsctrl = self;
    const controls = new OrbitControls(camera, renderer.domElement);    
    controls.addEventListener('change', toRender); // use if there is no animation loop
    controls.minDistance = 2;
    controls.maxDistance = 10;
    controls.target.set(0, 0, - 0.2);
    controls.update();
    self.controls = controls;




    //--- initial render
    //this.render();

  }

  ControlCode.setup = setup;
  function setup() {
    //console.log("Ran setup")
  }

  ControlCode._onInit = _onInit;
  function _onInit() {
    window.ThreeDemo = this;
    this.refreshSize();
    this.initScene();
    var tmpSpot = this.getSpot$('puppet_stage');
    console.log('tmpSpot',tmpSpot)
    ThisApp.util.clearToTop(this.getSpot$('puppet_stage').get(0));
    //-->nodaft 
    this.reactionFunction = this.reactionSpeak;
    //-->nodaft 
    this.startMusicResponse();
  }

  var ThisControl = {
    specs: ControlSpecs,
    options: {
      proto: ControlCode,
      parent: ThisApp
    }};
  return ThisControl;
})(ActionAppCore, $);