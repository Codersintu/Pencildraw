import { strokeColorType, ToolType } from "@/component/Canvas/CanvasBoard";
import { existingCanvasShape } from "./http";
import { sign } from "crypto";

export type ShapeData = {
    tool:"rect",
    startX:number,
    startY:number,
    width:number,
    height:number,
    color:string
    strokeWidth:number,
    backgroundColor:string,
    strokeStyle:number[]
}|{
    tool:"circle",
    centerX:number,
    centerY:number,
    radius:number
    color:string
    strokeWidth:number,
    backgroundColor:string,
    strokeStyle:number[]
    
}|{
    tool:"line",
    startX:number,
    startY:number,
    endX:number,
    endY:number,
    color:string
    strokeWidth:number,
    backgroundColor:string,
    strokeStyle:number[]
}|{ 
    tool:"triangle",
    point1X:number,
    point1Y:number,
    point2X:number,
    point2Y:number,
    point3X:number,
    point3Y:number,
    color:string
    strokeWidth:number,
    backgroundColor:string,
    strokeStyle:number[]
}|{
    tool:"pentagon",
    centerX:number,
    centerY:number,
    radius:number,
    color:string
    strokeWidth:number,
    backgroundColor:string,
    strokeStyle:number[]

}|{
    tool:"pencil",
    points:{pX:number,pY:number}[],
    color:string
    strokeWidth:number,
    backgroundColor:string,
    strokeStyle:number[]
}|{
    tool:"eraser",
    points:{pX:number,pY:number}[],
    color:string
    strokeWidth:number,
    backgroundColor:string,
    strokeStyle:number[]
}|{
    tool:"arrow",
    startX:number,
    startY:number,
    endX:number,
    endY:number,
    rightX:number,
    rightY:number,
    leftX:number,
    leftY:number,
    color:string,
    strokeWidth:number,
    backgroundColor:string,
    strokeStyle:number[]
}


export class CanvasEngine {
    private canvas:HTMLCanvasElement;
    private ctx:CanvasRenderingContext2D;
    private socket:WebSocket;
    private roomId:number;
    private drawing:boolean;
    private startX:number;
    private startY:number;
    private token:string;
    private existingShapes:ShapeData[];
    private currentTool:React.RefObject<ToolType>;
    private viewTransform:{scale:number,offsetX:number,offsetY:number};
    private activeStroke: ShapeData | null=null;
    private isPanning:boolean;
    private strokeColor:React.RefObject<string>;
    private strokeBackgroundColor:React.RefObject<string>;
    private StrokeWidth:React.RefObject<number>;
    private StrokeStyle:React.RefObject<number[]>;
    private Mode:React.RefObject<string |null>;

    private async boot(){
        await this.loadExistingShapes();
        this.clearCanvas();
         this.initHandler();
        this.mouseHandler();
    };


    constructor(canvas:HTMLCanvasElement,socket:WebSocket,roomId:number,toolsRef:React.RefObject<ToolType>,token:string,strokeRef:React.RefObject<string>,strokeBackgroundRef:React.RefObject<string>,strokeWidthRef:React.RefObject<number>,strokeStyleRef:React.RefObject<number[]>,ModeRef:React.RefObject<string|null>){
        console.log("CanvasEngine class constructor called with canvas toolsRef:",toolsRef,strokeRef);
        this.canvas=canvas;
        this.ctx=canvas.getContext("2d")!;
        this.socket=socket;
        this.roomId=roomId;
        this.currentTool=toolsRef;
        this.strokeColor=strokeRef;
        this.strokeBackgroundColor=strokeBackgroundRef;
        this.StrokeWidth=strokeWidthRef;
        this.StrokeStyle=strokeStyleRef;
        this.Mode=ModeRef;
        this.drawing=false;
        this.startX=0;
        this.token=token;
        this.startY=0;
        this.existingShapes=[];
        this.viewTransform={scale:1,offsetX:0,offsetY:0};
        this.isPanning=false;
        void this.boot();
    };

  //  load existing shapes from DB and render them on canvas
    async loadExistingShapes(){
       this.existingShapes = await existingCanvasShape(String(this.roomId),this.token);
       
    };

    initHandler() {
        this.socket.onmessage = (event) => {
            const messages = JSON.parse(event.data);
            console.log("Received message from socket event:", messages);
            if (!messages || messages.type !== "broadcast") return;
            if (messages.type === "broadcast") {
                const parsed = JSON.parse(messages.message);
                if (!parsed?.shapes) return;
                this.existingShapes.push(parsed.shapes);
                this.clearCanvas();
            }
        };
    }

 
// clear the canvas and redraw all existing shapes
    clearCanvas(){
        const ctx=this.ctx
        ctx.setTransform(1,0,0,1,0,0);
        ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        ctx.fillStyle="white";
        ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
        ctx.setTransform(this.viewTransform.scale,0,0,this.viewTransform.scale,this.viewTransform.offsetX,this.viewTransform.offsetY);

        this.existingShapes.map(shape=>{
            if(!shape) return;
            if(shape.tool==="rect"){
                ctx.beginPath();
                ctx.fillStyle=shape.backgroundColor || "";
                ctx.strokeStyle=shape.color;
                ctx.lineWidth=shape.strokeWidth;
                ctx.setLineDash(shape.strokeStyle || []);
                ctx.fill();
                ctx.strokeRect(shape.startX,shape.startY,shape.width,shape.height);
                
            }else if(shape.tool==="circle"){
                ctx.beginPath();
                ctx.fillStyle=shape.backgroundColor;
                ctx.strokeStyle=shape.color;
                ctx.lineWidth=shape.strokeWidth;
                ctx.setLineDash(shape.strokeStyle || []);
                ctx.arc(shape.centerX,shape.centerY,shape.radius,0, Math.PI * 2);
                 ctx.fill();
                ctx.stroke();
            }else if(shape.tool==="line"){
                ctx.beginPath();
                ctx.fillStyle=shape.backgroundColor;
                ctx.strokeStyle=shape.color;
                ctx.lineWidth=shape.strokeWidth;
                ctx.setLineDash(shape.strokeStyle || []);
                ctx.moveTo(shape.startX,shape.startY);
                ctx.lineTo(shape.endX,shape.endY);
                ctx.fill();
                ctx.stroke();
            }else if(shape.tool==="arrow"){
                const x2=shape.endX;
                const y2=shape.endY;

                ctx.beginPath();
                ctx.fillStyle=shape.backgroundColor;
                ctx.strokeStyle=shape.color;
                ctx.lineWidth=shape.strokeWidth;
                ctx.setLineDash(shape.strokeStyle || []);
                ctx.moveTo(shape.startX,shape.startY);
                ctx.lineTo(shape.endX,shape.endY);
                ctx.fill();
                ctx.stroke();
               

               ctx.beginPath();

               ctx.moveTo(x2, y2);

               ctx.lineTo(shape.leftX, shape.leftY);

               ctx.moveTo(x2, y2);

               ctx.lineTo(shape.rightX, shape.rightY);

               ctx.stroke();


            }else if(shape.tool==="triangle"){
                ctx.beginPath();
                 ctx.fillStyle=shape.backgroundColor;
                ctx.strokeStyle=shape.color;
                ctx.lineWidth=shape.strokeWidth;
                ctx.setLineDash(shape.strokeStyle || []);
                ctx.moveTo(shape.point1X,shape.point1Y);
                ctx.lineTo(shape.point2X,shape.point2Y);
                ctx.lineTo(shape.point3X,shape.point3Y);
                ctx.lineTo(shape.point1X,shape.point1Y);
                    ctx.fill();
                ctx.stroke();
            }else if(shape.tool==="pentagon"){
                const centerX=shape.centerX;
                const centerY=shape.centerY;
                const radius=shape.radius;
                 ctx.beginPath();
                 ctx.fillStyle=shape.backgroundColor;
                ctx.strokeStyle=shape.color;
                ctx.lineWidth=shape.strokeWidth;
                ctx.setLineDash(shape.strokeStyle || []);
                 for(let i=0; i<5;i++){
                    const angle=(i * 2 * Math.PI) / 5 - Math.PI / 2;
                    const xPos=centerX + radius * Math.cos(angle);
                    const yPos=centerY + radius * Math.sin(angle);

                    if(i===0){
                        ctx.moveTo(xPos,yPos);
                    }else{
                        ctx.lineTo(xPos,yPos);
                    }
                 }
                 ctx.closePath();
                    ctx.fill();
                 ctx.stroke();
            }else if(shape.tool==="pencil"){
                if(shape.points.length < 2) return;
                const points=shape.points;
                ctx.beginPath();
                
                ctx.strokeStyle=shape.color;
                ctx.lineWidth=shape.strokeWidth;
                ctx.setLineDash(shape.strokeStyle || []);
                ctx.moveTo(points[0].pX,points[0].pY);
                for(let i=0;i<points.length;i++){
                    ctx.lineTo(points[i].pX,points[i].pY);
                }
                 
                ctx.stroke();
            }else if(shape.tool==="eraser"){
                if(shape.points.length < 2) return;

                const points=shape.points;
                ctx.save();
                ctx.globalCompositeOperation="destination-out";
                ctx.lineWidth=20;
                ctx.lineCap='round';

                ctx.beginPath();
                ctx.moveTo(points[0].pX,points[0].pY);
                for(let i=0; i< points.length; i++){
                    ctx.lineTo(points[i].pX,points[i].pY);
                }
                ctx.stroke();
                ctx.restore();
            }
        })

        
    }
   
    // get mouse position relative to canvas, accounting for view transform
    getMousePos(e:MouseEvent){
        if(!e) return {x:0,y:0};
        const rect=this.canvas.getBoundingClientRect();

        return {
            x:(e.clientX-rect.left - this.viewTransform.offsetX)/this.viewTransform.scale,
            y:(e.clientY-rect.top - this.viewTransform.offsetY)/this.viewTransform.scale
        }
    }
 
    // handle mouse events for drawing shapes
    mouseHandler(){

        const MouseDown=(e:MouseEvent)=>{
            if(this.Mode.current==="view") return;
            this.drawing=true;
            const {x,y}=this.getMousePos(e);
            this.startX=x;
            this.startY=y;

            if(this.currentTool.current==="pencil"){
                this.activeStroke={tool:"pencil",points:[{pX:this.startX,pY:this.startY}],color:this.strokeColor.current,strokeWidth:this.StrokeWidth.current,backgroundColor:this.strokeBackgroundColor.current,strokeStyle:this.StrokeStyle.current};
            }else if(this.currentTool.current==="eraser"){
                this.activeStroke={tool:"eraser",points:[{pX:this.startX,pY:this.startY}],color:this.strokeColor.current,strokeWidth:this.StrokeWidth.current,backgroundColor:this.strokeBackgroundColor.current,strokeStyle:this.StrokeStyle.current};
            } else if(this.currentTool.current==="zoom"){
                   this.isPanning=true;
                   return;
            }
        }

        
          const onMouseUp = (e: MouseEvent) => {
             if(this.Mode.current==="view") return;
            this.drawing = false;
            const { x, y } = this.getMousePos(e);
            const width = x - this.startX;
            const height = y - this.startY;

             let shapes:ShapeData|null = null;
             console.log("current bro",this.currentTool.current)
            if (this.currentTool.current === "rect") {
                shapes={tool:"rect",startX:this.startX,startY:this.startY,width,height,color:this.strokeColor.current,strokeWidth:this.StrokeWidth.current,backgroundColor:this.strokeBackgroundColor.current,strokeStyle:this.StrokeStyle.current};
            } else if (this.currentTool.current === "circle") {
                shapes={tool:"circle",centerX:this.startX,centerY:this.startY,radius: Math.hypot(width, height),color:this.strokeColor.current,strokeWidth:this.StrokeWidth.current,backgroundColor:this.strokeBackgroundColor.current,strokeStyle:this.StrokeStyle.current};
            }else if(this.currentTool.current==="line"){
                shapes={tool:"line",startX:this.startX,startY:this.startY,endX:x,endY:y,color:this.strokeColor.current,strokeWidth:this.StrokeWidth.current,backgroundColor:this.strokeBackgroundColor.current,strokeStyle:this.StrokeStyle.current}
            }else if(this.currentTool.current==="triangle"){
                shapes={tool:"triangle",point1X:this.startX,point1Y:this.startY,point2X:x,point2Y:y,point3X:2*this.startX -x,point3Y:y,color:this.strokeColor.current,strokeWidth:this.StrokeWidth.current,backgroundColor:this.strokeBackgroundColor.current,strokeStyle:this.StrokeStyle.current}
            }else if(this.currentTool.current==="pentagon"){
               const radius=Math.hypot(width,height)
               shapes={tool:"pentagon",centerX:this.startX,centerY:this.startY,radius,color:this.strokeColor.current,strokeWidth:this.StrokeWidth.current,backgroundColor:this.strokeBackgroundColor.current,strokeStyle:this.StrokeStyle.current}
            }else if(this.currentTool.current==="pencil" && this.activeStroke?.tool==="pencil"){
            if(this.activeStroke.points.length >= 2){
              shapes=this.activeStroke;
            }
            }else if(this.currentTool.current==="eraser" && this.activeStroke?.tool==="eraser"){
            if(this.activeStroke.points.length >= 2){
              shapes=this.activeStroke;
            }
            }else if(this.currentTool.current==="zoom"){
                this.isPanning=false;
                return;
            }else if(this.currentTool.current === "arrow"){
                const x1=this.startX;
                const y1=this.startY;

                const x2=x;
                const y2=y;
                const headLength = 20;

               const angle =
               Math.atan2(y2 - y1, x2 - x1);

               const leftX =
               x2 - headLength *
               Math.cos(angle - Math.PI / 6);

               const leftY =
               y2 - headLength *
               Math.sin(angle - Math.PI / 6);

               const rightX =
               x2 - headLength *
               Math.cos(angle + Math.PI / 6);

               const rightY =
               y2 - headLength *
               Math.sin(angle + Math.PI / 6);
              shapes={tool:"arrow",startX:this.startX,startY:this.startY,endX:x,endY:y,rightX:rightX,rightY:rightY,leftX:leftX,leftY:leftY,color:this.strokeColor.current,strokeWidth:this.StrokeWidth.current,backgroundColor:this.strokeBackgroundColor.current,strokeStyle:this.StrokeStyle.current}
            }

            if(!shapes) return;

            this.existingShapes.push(shapes);
            this.clearCanvas();

            // send the new shape data to the socket server
            console.log("Sending shape data to socket server:", shapes);
            this.socket.send(JSON.stringify({
                type:"broadcast",
                roomId:Number(this.roomId),
                message:JSON.stringify({shapes}),
            }));

        }

        const MouseMove=(e:MouseEvent)=>{
       if(this.Mode.current==="view") return;
        if(!this.drawing) return;
         console.log("current tool",this.currentTool.current)
           const ctx=this.ctx;
            const {x,y}=this.getMousePos(e);

            const width=x-this.startX;
            const height=y-this.startY;
             
            this.clearCanvas();

            if(this.currentTool.current==="rect"){
                ctx.beginPath();
                ctx.fillStyle=this.strokeBackgroundColor.current;
                ctx.fill();
               ctx.strokeStyle=this.strokeColor.current;
               ctx.lineWidth=this.StrokeWidth.current;
               ctx.setLineDash(this.StrokeStyle.current || [])
               ctx.strokeRect(this.startX,this.startY,width,height);
            }else if(this.currentTool.current==="circle"){
                const radius=Math.hypot(width,height);
               ctx.beginPath();
              ctx.fillStyle=this.strokeBackgroundColor.current;
                ctx.fill();
               ctx.strokeStyle=this.strokeColor.current;
               ctx.lineWidth=this.StrokeWidth.current;
               ctx.setLineDash(this.StrokeStyle.current || [])
               ctx.arc(this.startX, this.startY, radius, 0, Math.PI * 2);
               ctx.stroke();
            }else if(this.currentTool.current ==="line"){
               ctx.beginPath();
               ctx.fillStyle=this.strokeBackgroundColor.current;
                ctx.fill();
               ctx.strokeStyle=this.strokeColor.current;
               ctx.lineWidth=this.StrokeWidth.current;
               ctx.setLineDash(this.StrokeStyle.current || [])
               ctx.moveTo(this.startX,this.startY);
               ctx.lineTo(x,y);
               ctx.stroke();
            }else if(this.currentTool.current==="arrow"){
                const x1=this.startX;
                const y1=this.startY;

                const x2=x;
                const y2=y;

                ctx.beginPath();
               ctx.fillStyle=this.strokeBackgroundColor.current;
               ctx.fill();
               ctx.strokeStyle=this.strokeColor.current;
               ctx.lineWidth=this.StrokeWidth.current;
               ctx.setLineDash(this.StrokeStyle.current || [])
               ctx.moveTo(x1,y1);
               ctx.lineTo(x2,y2);
               ctx.stroke();

              const headLength = 20;

               const angle =
               Math.atan2(y2 - y1, x2 - x1);

               const leftX =
               x2 - headLength *
               Math.cos(angle - Math.PI / 6);

               const leftY =
               y2 - headLength *
               Math.sin(angle - Math.PI / 6);

               const rightX =
               x2 - headLength *
               Math.cos(angle + Math.PI / 6);

               const rightY =
               y2 - headLength *
               Math.sin(angle + Math.PI / 6);

               // draw head
               ctx.beginPath();

               ctx.moveTo(x2, y2);

               ctx.lineTo(leftX, leftY);

               ctx.moveTo(x2, y2);

               ctx.lineTo(rightX, rightY);

               ctx.stroke();
            }else if(this.currentTool.current==="triangle"){
                const point1X = this.startX;
                const point1Y = this.startY;
                const point2X = x;
                const point2Y = y;
                const point3X = 2 * this.startX - x;
                const point3Y = y;

                ctx.beginPath();
                ctx.fillStyle=this.strokeBackgroundColor.current;
                ctx.fill();
               ctx.strokeStyle=this.strokeColor.current;
               ctx.lineWidth=this.StrokeWidth.current;
               ctx.setLineDash(this.StrokeStyle.current || [])
                ctx.moveTo(point1X,point1Y);
                ctx.lineTo(point2X,point2Y);
                ctx.lineTo(point3X,point3Y);
                ctx.lineTo(point1X,point1Y);
                ctx.stroke();
            }else if(this.currentTool.current==="pentagon"){
                 const radius=Math.hypot(width,height);
                const centerX=this.startX;
                const centerY=this.startY;
                ctx.beginPath();
               ctx.fillStyle=this.strokeBackgroundColor.current;
                ctx.fill();
               ctx.strokeStyle=this.strokeColor.current;
               ctx.lineWidth=this.StrokeWidth.current;
               ctx.setLineDash(this.StrokeStyle.current || [])
                for(let i = 0;i < 5; i++){
                 const angle=(i * 2 * Math.PI) / 5 - Math.PI / 2;
                 const xPos=centerX + radius * Math.cos(angle);
                 const yPos=centerY + radius * Math.sin(angle);

                 if(i===0){
                    ctx.moveTo(xPos,yPos);
                 }else{
                    ctx.lineTo(xPos,yPos);
                 }
                }

                ctx.closePath();
                ctx.stroke();
            }else if(this.currentTool.current==="pencil" && this.activeStroke?.tool==="pencil"){
                const points=this.activeStroke.points;
                const last=points[points.length - 1];
                if(Math.hypot(x-last.pX,y-last.pY) >=2){
                    points.push({pX: x, pY: y});
                };

                ctx.beginPath();
                ctx.fillStyle=this.strokeBackgroundColor.current;
                ctx.fill();
               ctx.strokeStyle=this.strokeColor.current;
               ctx.lineWidth=this.StrokeWidth.current;
               ctx.setLineDash(this.StrokeStyle.current || [])
                ctx.moveTo(points[0].pX,points[0].pY);
                for(let i=1;i < points.length;i++){
                    ctx.lineTo(points[i].pX,points[i].pY);
                }
                ctx.stroke();
            }else if(this.currentTool.current==="eraser" && this.activeStroke?.tool==="eraser"){
                const points=this.activeStroke.points;
                const last=points[points.length - 1];
                if(Math.hypot(x-last.pX,y-last.pY) >= 2){
                    points.push({pX:x,pY:y});
                };

                if(points.length < 2) return;
                ctx.save();
                ctx.globalCompositeOperation='destination-out';
                ctx.lineWidth=20;
                ctx.lineCap='round';

                ctx.beginPath();
                ctx.moveTo(points[0].pX,points[0].pY);
                for(let i=1;i < points.length; i++){
                    ctx.lineTo(points[i].pX,points[i].pY);
                }
                ctx.stroke();
                ctx.restore();

            }else if(this.currentTool.current==="zoom" && this.isPanning===true){
               this.viewTransform.offsetX += e.movementX;
               this.viewTransform.offsetY += e.movementY;
               this.clearCanvas();
               
            }
        }

         this.canvas.addEventListener("wheel", (e) => {
            e.preventDefault();

            const zoomIntensity = 0.1;

            const rect = this.canvas.getBoundingClientRect();

            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            const worldX = (mouseX - this.viewTransform.offsetX) / this.viewTransform.scale;
            const worldY = (mouseY - this.viewTransform.offsetY) / this.viewTransform.scale;

            // change scale
            const direction = e.deltaY > 0 ? -1 : 1;
            const factor = 1 + zoomIntensity * direction;

            this.viewTransform.scale *= factor;

            this.viewTransform.offsetX = mouseX - worldX * this.viewTransform.scale;
            this.viewTransform.offsetY = mouseY - worldY * this.viewTransform.scale;

            this.clearCanvas();
        });



        this.canvas.addEventListener("mousedown",MouseDown);
        this.canvas.addEventListener("mousemove",MouseMove);
        this.canvas.addEventListener("mouseup",onMouseUp);

        return () => {
        this.canvas.removeEventListener("mousedown", MouseDown);
        this.canvas.removeEventListener("mousemove", MouseMove);
        this.canvas.removeEventListener("mouseup", onMouseUp);
        };
}

}