Vue.component('ui-inspector', {
    props:{
        uri:String,
        caps: String,
        result: String,
        sessionid: String,
        imagedata:  String,
        rtcpc: undefined,
    },
    data:()=>Object.assign({
            channel:   undefined,
            interval:  undefined,
            image: undefined,
            imageRaw: undefined,
            elementJSON: null,
            elementXmlRaw: undefined,
            currentElementID: undefined,
            shellOutputChannel:  "",
            sessionID: "",
            loading: false,
            clickEvent:{X:-1,Y:-1},
            controlClickInterval:null,
            expandDepth: 1000,
        },{}),
    computed: {
        musthaveImg(){
            if(this.imagedata) {
                return this.imagedata
            }
            return "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
        },
        localUri(){
            return "http://localhost:"+this.uri.split(":")[2]
        },
        localCaps(){
            obj = JSON.parse(this.caps)
            obj.newCommandTimeout = 0
            return JSON.stringify(obj)
        },
        refreshImageCmd(){
            //GET http://127.0.0.1:8201/wd/hub/session/5dd29a53-5718-4b39-97e7-827ab29036b0/screenshot
            // {"sessionId":"5dd29a53-5718-4b39-97e7-827ab29036b0","value":"iVBORw0KGg
            return "curl -XGET "+this.localUri+"/session/"+this.sessionID+"/screenshot 2>/dev/null | openssl base64"
            //take screenshot from the video
            //this.$emit("screenshot")
        },
        delSessionCmd(){
            return "curl -XDELETE "+this.localUri+"/session/"+this.sessionID + " 2>/dev/null | openssl base64"
        },
        refreshElementsCmd(){
            return "curl -XGET "+this.localUri+"/session/"+this.sessionID+"/source 2>/dev/null | openssl base64"
        },
        createSessionCmd(){
            return `curl --location --request POST '`+this.localUri+`/session'  --header 'Content-Type: application/json' --data-raw '{"capabilities": {"alwaysMatch": `+this.localCaps+`}}' 2>/dev/null | openssl base64`
        },
        pc(){
            return this.rtcpc
        }
    },
    methods: {
        // begin of loading function
        refreshImage(){
            if(this.sessionID){
                //this.runHostShell(this.refreshImageCmd, "ui-inspector-image")
                this.$emit("screenshot")
                return
            }
            alert("could not find the sessionId, refer to fix this issue")
        },
        refreshElements(){
            if(this.sessionID){
                this.runHostShell(this.refreshElementsCmd, "ui-inspector-elements")
                return
            }
            alert("could not find the sessionId, refer to fix this issue")
        },
        refresh(){
            this.clickEvent = {X:-1, Y: -1}
            this.refreshImage()
            this.refreshElements()
        },
        runHostShell(command, backChannel) {
            if(backChannel == undefined || backChannel == "") {
              backChannel = "**channel**hostshell**"
            }
            if(this.channel != null && this.channel.readyState == "open") {
              this.channel.send("echo **channel**"+backChannel+"** &&"+command)
              console.log("runHostShell", command)
              return
            }
            console.log("runHostShell:", " cmdChannel is not ready")
        },
        createSession(){
            this.runHostShell(this.createSessionCmd, "ui-inspector-session")
        },
        deleteSession(){
            this.runHostShell(this.delSessionCmd, "ui-inspector-del-session")
        },
        tapElement(elementID){
            if(this.sessionID){
                let cmd =  "curl -XPOST "+this.localUri+"/session/"+this.sessionID+"/element/"+elementID+"/click" + " 2>/dev/null | openssl base64"
                this.runHostShell(cmd, "ui-inspector-tap-element")
                return
            }
            alert("could not find the sessionId, refer to fix this issue")
            
        },
        getElementByAccId(accID){
            if(this.sessionID){
                alert("could not find the sessionId, refer to fix this issue")
                return
            }
            
            // new format 1.21.0
            // curl -XPOST http://127.0.0.1:20006/wd/hub/session/e85fb6ab-d392-4a8e-aab6-c259cf3acbd5/elements \
            // --header 'Content-Type: application/json' \
            // --data-raw '{"using":"accessibility id","value":"设置"}'
            // {"value":[{"element-6066-11e4-a52e-4f735466cecf":"b73aefa5-0abc-4d11-868f-bbce826bd5ff","ELEMENT":"b73aefa5-0abc-4d11-868f-bbce826bd5ff"}]}
            let cmd = `curl -XPOST `+this.localUri+`/session/`+this.sessionID+`/elements --header 'Content-Type: application/json' --data-raw '{"using":"accessibility id","value":"`+accID+`"}'` + ` 2>/dev/null | openssl base64`
            this.runHostShell(cmd, "ui-inspector-getelement")
        },
        getElementByXPath(selector){
            if(this.sessionID){
                alert("could not find the sessionId, refer to fix this issue")
                return
            }
            // new format
            // curl -XPOST http://127.0.0.1:20006/wd/hub/session/e85fb6ab-d392-4a8e-aab6-c259cf3acbd5/elements \
            // --header 'Content-Type: application/json' \
            // --data-raw '{"using":"xpath","value":"/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.view.ViewGroup/android.widget.FrameLayout[2]/android.widget.LinearLayout/android.widget.FrameLayout/com.zte.mifavor.support.v7.widget.RecyclerView/android.widget.FrameLayout[4]/android.widget.LinearLayout/android.widget.LinearLayout/android.widget.LinearLayout[2]"}'
            // {"value":null}
            // xpath non full path //android.widget.TextView[@content-desc=\"设置\"]
            let cmd = `curl -XPOST `+this.localUri+`/session/`+this.sessionID+`/elements --header 'Content-Type: application/json' --data-raw '{"using":"xpath","value":"`+selector+`"}'`  + ` 2>/dev/null | openssl base64`
            this.runHostShell(cmd, "ui-inspector-getelement")
        },
        processMsg(msg){
            if(!msg){
                return
            }
            let component = this
            let outputChannel = component.shellOutputChannel
            if(msg.indexOf("**channel**")>-1) {
                msgpart = msg.replace("\n", "").replace("**channel**", "").split("**")
                component.shellOutputChannel = msgpart[0]
                outputChannel = msgpart[0]
                console.log("Set Output Channel to '"+outputChannel+"'")
                switch(outputChannel){
                    // init if needed
                    case "ui-inspector-elements":
                        this.elementXmlRaw = ""
                        break
                    case "ui-inspector-image":
                        this.imageRaw = ""
                        this.loading=true
                        break
                    default:
                    break
                }
                if(msgpart.length == 2 && msgpart[1]  ==  "") {
                  return
                }
                msg = msgpart[1]
            }
            switch(outputChannel) {
                case "ui-inspector-session":
                  // decode from base64 first, 
                  try{
                    let obj = JSON.parse(Base64.decode(msg))
                    if(obj && obj.value && obj.value.sessionId) {
                        component.sessionID = obj.value.sessionId
                        console.log("sessionId is "+component.sessionID)
                    } else {
                        console.log("could not extract sessionId")
                    }
                  }catch(err){
                      console.log(err)
                  }
                  break
                case "ui-inspector-elements":
                    try{
                        this.elementXmlRaw +=msg
                        let obj = JSON.parse(Base64.decode(this.elementXmlRaw))
                        if(obj && obj.value) {
                            let x2js=new X2JS()
                            let jobj = x2js.xml_str2json(obj.value)
                            this.elementJSON = jobj
                        }
                    }catch(err){
                        console.log(err)
                    }
                    break
                case "ui-inspector-image":
                    try{
                        this.imageRaw += msg
                        let obj = JSON.parse(Base64.decode(this.imageRaw))
                        if(obj && obj.value) {
                            this.image  = obj.value
                            this.loading=false
                        }
                    }catch(err){
                        // do nothing, since not complete image data  cause this. 
                        // console.log(err)
                    }
                    break
                case "ui-inspector-getelement":
                    try{
                        let obj = JSON.parse(Base64.decode(msg))
                        if(obj && obj.value && obj.value.length > 0) {
                            if (obj.value.length>1) {
                                alert("found more than 1 elements, please adjust the selector", + JSON.stringify(obj))
                            }
                            this.currentElementID  = obj.value[0].ELEMENT
                        }
                    }catch(err){
                        // do nothing, since not complete xml data  cause this. 
                        // console.log(err)
                    }
                    break
                default:
                  console.log(msg)
                  break
            }
        },
        // end of loading function

        // begin of image click processing
        clickOnImage(e){
            let inspector = this
            let jobj = this.elementJSON
            if(e.srcElement&&jobj) {
                imgW = e.target.clientWidth
                imgH = e.target.clientHeight
                x = e.offsetX
                y = e.offsetY
                let phoneW=1
                let phoneH = 1
                if (jobj.hierarchy){
                    phoneW= jobj.hierarchy._width
                    phoneH= jobj.hierarchy._height
                }
                if(jobj.AppiumAUT&&jobj.AppiumAUT.XCUIElementTypeApplication){
                    phoneW= jobj.AppiumAUT.XCUIElementTypeApplication._width
                    phoneH= jobj.AppiumAUT.XCUIElementTypeApplication._height
                }
                phoneX = x*phoneW/imgW
                phoneY = y*phoneH/imgH
                inspector.clickEvent = {X:phoneX, Y: phoneY}
                return
            }
            inspector.clickEvent = {X:-1, Y: -1}
        },
        clickOnMark(e){
            let inspector = this
            let jobj = this.elementJSON
            if(e.srcElement&&jobj) {
                imgW = e.target.clientWidth
                imgH = e.target.clientHeight
                x = e.offsetX+e.target.offsetLeft
                y = e.offsetY+e.target.offsetTop
                let phoneW=1
                let phoneH = 1
                if (jobj.hierarchy){
                    phoneW= jobj.hierarchy._width
                    phoneH= jobj.hierarchy._height
                }
                if(jobj.AppiumAUT&&jobj.AppiumAUT.XCUIElementTypeApplication){
                    phoneW= jobj.AppiumAUT.XCUIElementTypeApplication._width
                    phoneH= jobj.AppiumAUT.XCUIElementTypeApplication._height
                }
                phoneX = x*phoneW/imgW
                phoneY = y*phoneH/imgH
                inspector.clickEvent = {X:phoneX, Y: phoneY}
                return
            }
            inspector.clickEvent = {X:-1, Y: -1}
        },
        //end of image click processing
        // begin of click on certain element, circle it on the image
        translateToImageSize(x1, x2, y1, y2) {
            //e.g.
            // pw 1080
            // ph  1776
            // iw  358
            // ih  636
            // x1:left 540, x2:right 804  y1:top 102  y2:bottom 387
            let inspector = this
            let jobj = this.elementJSON
            try{
                let phoneW=1
                let phoneH = 1
                if (jobj.hierarchy){
                    phoneW= jobj.hierarchy._width
                    phoneH= jobj.hierarchy._height
                }
                if(jobj.AppiumAUT&&jobj.AppiumAUT.XCUIElementTypeApplication){
                    phoneW= jobj.AppiumAUT.XCUIElementTypeApplication._width
                    phoneH= jobj.AppiumAUT.XCUIElementTypeApplication._height
                }
                let el = this.$refs["snapshot"]
                this.$refs["jsonViewer"].style.height = el.clientHeight.toString() + "px"
                imgW = el.clientWidth
                imgH = el.clientHeight
                console.log(el, el.offsetX, el.top)
                imgTop = el.offsetTop
                imgLeft = el.offsetLeft
                xr1 = x1==0?imgLeft:(imgLeft+x1*imgW/phoneW)
                xr2 = x2==0?0:x2*imgW/phoneW
                yr1 = y1==0?imgTop:(imgTop+y1*imgH/phoneH)
                yr2 = y2==0?0:y2*imgH/phoneH
                return [xr1, xr2, yr1, yr2]
            }catch(e){
            }
            return [0,0,0,0]
        },
        emitClick(x1, x2, y1, y2){
            console.log(x1,x2,y1,y2)
            let inspector = this
            if(inspector.controlClickInterval) {
                return
            }
            // inspector.$emit("elementClickedAt", x1, x2, y1, y2)
            // draw red circly
            let mark = inspector.$refs["mark"]
            // left, right, top,  bottom
            let [rx1, rx2, ry1, ry2] = this.translateToImageSize(x1, x2, y1, y2)
            let floatToStylePt = function(f){
                return f.toString()+"px"
            }
            mark.style.left = floatToStylePt(rx1)
            mark.style.top = floatToStylePt(ry1)
            mark.style.width = floatToStylePt(rx2-rx1)
            mark.style.height= floatToStylePt(ry2-ry1)
            // control wil bubble multi event, block them for 100 ms
            let interval = setInterval(function(){
                clearInterval(inspector.controlClickInterval)
                inspector.controlClickInterval = null
            },100)
            inspector.controlClickInterval = interval
        },
        // end of click on certain element
        // begin init channel
        addChannel(){
            let component = this
            if(!this.pc) {
                return
            }
            if(!this.channel){
                let dec = new TextDecoder("utf-8")
                let cmdChannel = this.pc.createDataChannel('CMD')
                cmdChannel.onclose = () => console.log('cmdChannel2 has closed')
                cmdChannel.onopen = () => {
                    console.log('cmdChannel2 has opened')
                    this.createSession()
                }
                cmdChannel.onmessage = e => {
                    let msg = e.data
                    if (typeof(msg) !== "string"){
                        console.log('decoding')
                        msg = dec.decode(msg)
                        component.processMsg(msg)
                    }
                    // console.log(`Message from DataChannel2 '${cmdChannel.label}' payload <br>'${msg}'`)
                }
                this.channel = cmdChannel
            }
            if(this.channel && this.interval){
                clearInterval(this.interval)
            }
        }
        // end init channel
    },
    mounted: function () {
        this.interval = setInterval(this.addChannel, 500)
    },
    beforDestroy:function(){
        if(this.sessionID){
            this.deleteSession()
        }
        if(this.channel) {
            this.channel.close()
        }
    },
    components:{
    },
    template:`
    <div>
        <div>SessionID:{{sessionID}}</div>
        <div class="card" style="width:49%; max-width:400px;float:left">
            <div class="card-header">
            Snapshot
            <span class="float-right">
                <i v-if="loading">loading</i>
                <i class="fas fa-sync float-right cursor-pointer" @click="refresh" v-if="sessionID"> Refresh</i>
            </span>
            </div>
            <div class="card-body" style="padding:0;">
                <div ref="mark" id="mark" style="border:5px solid red;z-index:1000;position:absolute;" @click="clickOnMark"></div>
                <img ref="snapshot" :src="musthaveImg" alt="image of ui" style="width:100%;" @click="clickOnImage">
            </div>
        </div>
        <div class="card" style="width:49%;max-height:100%;float:left">
            <div class="card-header">
              Elements
            </div>
            <div class="card-body" style="overflow:scroll;max-height:800px;" ref="jsonViewer">
            {{JSON.stringify(clickEvent)}}
               <json-viewer v-if="elementJSON" :value="elementJSON" :eventPos="clickEvent" :expandDepth="expandDepth" @elementclickedat="emitClick"></json-viewer>
            </div>
        </div>

    </div>
    `
  })