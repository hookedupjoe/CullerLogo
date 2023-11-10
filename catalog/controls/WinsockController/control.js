(function (ActionAppCore, $) {

  var ControlSpecs = {
    options: {
      padding: true
    },
    content: [{
      ctl: "div",
      name: "winsockcontrollerspot",
      text: ""
    }]
  }

  var ControlCode = {};

  ControlCode.setup = setup;
  function setup() {}
  var WebSocketControl = window.WebSocket || window.MozWebSocket;

  ControlCode._onInit = _onInit;
  function _onInit() {}


  if (!WebSocketControl) {
    alert("WebSocket not supported by this browser");
  }

  // function GET() {
  //   return document.getElementById(arguments[0]);
  // }
  // function GETVAL() {
  //   return document.getElementById(arguments[0]).value;
  // }

  function getKeyCode(ev) {
    if (window.event)
      return window.event.keyCode;
    return ev.keyCode;
  }

  var wstool = {
    connect: function(theURL) {
      //var location = document.location.toString().replace('http://', 'ws://') + "echo";
      var location = theURL;

      wstool.info("Document URI: " + document.location);
      wstool.info("WS URI: " + location);

      this._scount = 0;

      try {
        this._ws = new WebSocketControl(location);
        this._ws.onopen = this._onopen;
        this._ws.onmessage = this._onmessage;
        this._ws.onclose = this._onclose;
      } catch (exception) {
        wstool.info("Connect Error: " + exception);
      }
    },

    onstream: function(theStream) {
      console.log("Streaming " + theStream)
    },
    close: function() {
      if( this._ws && this._ws.close ){
        this._ws.close(1000);
      }
    },

    _out: function(css, message) {
      console.log('winsock:' + css + ' says ' + message);
      // var console = GET('console');
      // var spanText = document.createElement('span');
      // spanText.className = 'text ' + css;
      // spanText.innerHTML = message;
      // var lineBreak = document.createElement('br');
      // console.appendChild(spanText);
      // console.appendChild(lineBreak);
      // console.scrollTop = console.scrollHeight - console.clientHeight;
    },

    setState: function(enabled) {
      // GET('connect').disabled = enabled;
      // GET('close').disabled = !enabled;
      //GET('hello').disabled = !enabled;
    },

    info: function(message) {
      wstool._out("info", message);
    },

    error: function(message) {
      wstool._out("error", message);
    },

    infoc: function(message) {
      wstool._out("client", "[c] " + message);
    },

    infos: function(message) {
      this._scount++;
      wstool._out("server", "[s" + this._scount + "] " + message);
    },

    _onopen: function() {
      wstool.setState(true);
      wstool.info("Websocket Connected");
    },

    _send: function(message) {
      if (this._ws) {
        this._ws.send(message);
        //            wstool.infoc(message);
      }
    },

    write: function(text) {
      wstool._send(text);
    },

    _onmessage: function(m) {
      if (m.data) {
        wstool.onstream(m.data)
      }
    },

    _onclose: function(closeEvent) {
      this._ws = null;
      wstool.setState(false);
      wstool.info("Websocket Closed");
      wstool.info("  .wasClean = " + closeEvent.wasClean);

      var codeMap = {};
      codeMap[1000] = "(NORMAL)";
      codeMap[1001] = "(ENDPOINT_GOING_AWAY)";
      codeMap[1002] = "(PROTOCOL_ERROR)";
      codeMap[1003] = "(UNSUPPORTED_DATA)";
      codeMap[1004] = "(UNUSED/RESERVED)";
      codeMap[1005] = "(INTERNAL/NO_CODE_PRESENT)";
      codeMap[1006] = "(INTERNAL/ABNORMAL_CLOSE)";
      codeMap[1007] = "(BAD_DATA)";
      codeMap[1008] = "(POLICY_VIOLATION)";
      codeMap[1009] = "(MESSAGE_TOO_BIG)";
      codeMap[1010] = "(HANDSHAKE/EXT_FAILURE)";
      codeMap[1011] = "(SERVER/UNEXPECTED_CONDITION)";
      codeMap[1015] = "(INTERNAL/TLS_ERROR)";
      var codeStr = codeMap[closeEvent.code];
      wstool.info("  .code = " + closeEvent.code + "  " + codeStr);
      wstool.info("  .reason = " + closeEvent.reason);
    }
  };

ControlCode.wstool = wstool;

ControlCode.test = function(){console.log('tests')}






  var ThisControl = {
    specs: ControlSpecs,
    options: {
      proto: ControlCode,
      parent: ThisApp
    }};
  return ThisControl;
})(ActionAppCore, $);