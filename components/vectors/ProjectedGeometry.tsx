"use client";

import { useRef, useState, type ReactNode } from "react";
import type { Interactive3DPlaneProps, Vector3Value } from "./Interactive3DPlane";
import type { DisplayVector } from "./VectorCanvas2D";

const add = (a:Vector3Value,b:Vector3Value,k=1):Vector3Value=>[a[0]+k*b[0],a[1]+k*b[1],a[2]+k*b[2]];
const dot = (a:Vector3Value,b:Vector3Value)=>a.reduce((sum,x,i)=>sum+x*b[i],0);
const cross = (a:Vector3Value,b:Vector3Value):Vector3Value=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const unit=(a:Vector3Value):Vector3Value=>{const length=Math.hypot(...a);return length>1e-10?a.map(x=>x/length)as Vector3Value:[0,0,0];};
const number=(x:number)=>Number(x.toFixed(2));

function Projection({view,extent,children}:{view:string;extent:number;children:(p:(v:Vector3Value)=>[number,number])=>ReactNode}) {
  const [rotation,setRotation]=useState<[number,number]>([.64,.4]);
  const [zoom,setZoom]=useState(1);
  const drag=useRef<{x:number;y:number;rotation:[number,number]}|null>(null);
  const scale=Math.min(42,300/Math.max(5,extent))*zoom;
  const project=(v:Vector3Value):[number,number]=>{
    if(view==="front")return[v[0]*scale,-v[1]*scale];
    if(view==="side")return[v[2]*scale,-v[1]*scale];
    if(view==="top")return[v[0]*scale,-v[2]*scale];
    const [yaw,pitch]=rotation,depth=Math.sin(yaw)*v[0]+Math.cos(yaw)*v[1];
    return[(Math.cos(yaw)*v[0]-Math.sin(yaw)*v[1])*scale,(Math.sin(pitch)*depth-Math.cos(pitch)*v[2])*scale];
  };
  return <div className="flex h-full min-h-[320px] w-full flex-col bg-[#0c0c0c]">
    <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-white/10 px-3 py-2 text-xs text-zinc-400"><span>Projected 3D view. {view==="isometric"?"Drag to rotate.":"Choose Isometric to rotate."} Use numeric controls to change the geometry.</span><div className="flex gap-2"><button type="button" onClick={()=>setZoom(x=>Math.max(.35,x/1.2))} className="border border-white/20 px-2 py-1">Zoom out</button><button type="button" onClick={()=>setZoom(x=>Math.min(3,x*1.2))} className="border border-white/20 px-2 py-1">Zoom in</button></div></div>
    <svg role="img" aria-label="Projected three-dimensional mathematical scene" viewBox="-400 -300 800 600" className="min-h-0 flex-1 w-full touch-none" onPointerDown={event=>{if(view!=="isometric")return;drag.current={x:event.clientX,y:event.clientY,rotation};event.currentTarget.setPointerCapture(event.pointerId);}} onPointerMove={event=>{const start=drag.current;if(start)setRotation([start.rotation[0]+(event.clientX-start.x)*.007,Math.max(-1.25,Math.min(1.25,start.rotation[1]+(event.clientY-start.y)*.007))]);}} onPointerUp={()=>{drag.current=null;}} onPointerCancel={()=>{drag.current=null;}}>
      <defs><marker id="projected-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10z" fill="context-stroke"/></marker></defs>
      {children(project)}
    </svg>
  </div>;
}
type Project=(v:Vector3Value)=>[number,number];
function Segment({a,b,p,color="#555",width=1,dashed=false,arrow=false}:{a:Vector3Value;b:Vector3Value;p:Project;color?:string;width?:number;dashed?:boolean;arrow?:boolean}) {const[x1,y1]=p(a),[x2,y2]=p(b);return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={width} strokeDasharray={dashed?"5 5":undefined} markerEnd={arrow?"url(#projected-arrow)":undefined}/>;}
function Label({v,p,children,color="#ddd"}:{v:Vector3Value;p:Project;children:ReactNode;color?:string}){const[x,y]=p(v);return<text x={x+8} y={y-9} fill={color} fontSize="12" paintOrder="stroke" stroke="#0c0c0c" strokeWidth="3" strokeLinejoin="round">{children}</text>;}
function Point({v,p,label,color="#7dd3fc",onSelect}:{v:Vector3Value;p:Project;label:string;color?:string;onSelect?:(label:string,position:Vector3Value)=>void}) {const[x,y]=p(v);return<g onClick={()=>onSelect?.(label,v)} role={onSelect?"button":undefined} tabIndex={onSelect?0:undefined} onKeyDown={e=>{if(e.key==="Enter"||e.key===" ")onSelect?.(label,v);}} aria-label={`${label} (${v.map(number).join(", ")})`}><circle cx={x} cy={y} r={5} fill={color}/><Label v={v} p={p} color={color}>{label} ({v.map(number).join(", ")})</Label></g>;}
function Axes({p,extent,numbers=true}:{p:Project;extent:number;numbers?:boolean}){return<>{([0,1,2]as const).map(axis=>{const a:Vector3Value=[0,0,0],b:Vector3Value=[0,0,0];a[axis]=-extent;b[axis]=extent;return<g key={axis}><Segment a={a} b={b} p={p} arrow color="#56616a"/><Label v={b} p={p}>{["x","y","z"][axis]}</Label>{numbers&&[-4,-2,2,4].filter(n=>Math.abs(n)<extent).map(n=>{const v:Vector3Value=[0,0,0];v[axis]=n;return<Label key={n} v={v} p={p} color="#707982">{n}</Label>;})}</g>;})}</>;}
function Plane({normal,k,p,extent,color,label}:{normal:Vector3Value;k:number;p:Project;extent:number;color:string;label:string}){
 const n2=dot(normal,normal);if(n2<1e-10)return null;
 const center=normal.map(x=>x*k/n2)as Vector3Value,n=unit(normal),reference:Vector3Value=Math.abs(n[2])<.85?[0,0,1]:[0,1,0],a=unit(cross(n,reference)),b=unit(cross(n,a));
 const vertices=[[-1,-1],[1,-1],[1,1],[-1,1]].map(([u,v])=>add(add(center,a,u*extent*.55),b,v*extent*.55));
 return<g><polygon points={vertices.map(v=>p(v).join(",")).join(" ")} fill={color} fillOpacity=".13" stroke={color} strokeOpacity=".6" strokeWidth="1.4"/><Label v={vertices[2]} p={p} color={color}>{label}</Label></g>;
}
export function ProjectedGeometry(props:Interactive3DPlaneProps){
 const extent=Math.max(5,props.gridSize/2),planeVisible=props.mode!=="line",lineVisible=props.mode!=="plane";
 const select=(label:string,position:Vector3Value)=>props.onSelectPoint({label,position});
 const current=add(props.linePoint,props.lineDirection,props.parameter);
 let foot:Vector3Value|null=null;
 if(props.distanceMode==="point-line"&&dot(props.lineDirection,props.lineDirection)>1e-10){const t=dot(add(props.externalPoint,props.linePoint,-1),props.lineDirection)/dot(props.lineDirection,props.lineDirection);foot=add(props.linePoint,props.lineDirection,t);}
 if(props.distanceMode==="point-plane"&&dot(props.planeNormal,props.planeNormal)>1e-10){foot=add(props.externalPoint,props.planeNormal,-(dot(props.planeNormal,props.externalPoint)-props.planeConstant)/dot(props.planeNormal,props.planeNormal));}
 return<Projection view={props.cameraView} extent={extent}>{p=><>
   {props.showAxes&&<Axes p={p} extent={extent} numbers={props.showNumberLabels}/>}
   {planeVisible&&<Plane normal={props.planeNormal} k={props.planeConstant} p={p} extent={extent} color="#38bdf8" label="Plane 1"/>}
   {planeVisible&&props.secondPlaneEnabled&&<Plane normal={props.secondPlaneNormal} k={props.secondPlaneConstant} p={p} extent={extent} color="#f5f5f5" label="Plane 2"/>}
   {planeVisible&&props.thirdPlaneEnabled&&<Plane normal={props.thirdPlaneNormal??[0,0,1]} k={props.thirdPlaneConstant??3} p={p} extent={extent} color="#c4b5fd" label="Plane 3"/>}
   {lineVisible&&dot(props.lineDirection,props.lineDirection)>1e-10&&<><Segment a={add(props.linePoint,unit(props.lineDirection),-extent)} b={add(props.linePoint,unit(props.lineDirection),extent)} p={p} color="#f5f5f5" width={2}/><Point v={props.linePoint} p={p} label="A" onSelect={select}/><Point v={current} p={p} label="P(t)" color="#86efac" onSelect={select}/></>}
   {planeVisible&&props.showNormalVectors&&dot(props.planeNormal,props.planeNormal)>1e-10&&(()=>{const start=props.planeNormal.map(x=>x*props.planeConstant/dot(props.planeNormal,props.planeNormal))as Vector3Value;return<Segment a={start} b={add(start,unit(props.planeNormal),3)} p={p} color="#7dd3fc" width={2.5} arrow/>;})()}
   {props.showPlaneSpans&&(()=>{const a=props.planeAnchor??[1,0,2],u=props.planeSpanA??[1,1,0],v=props.planeSpanB??[0,1,1],end=add(add(a,u,props.planeParameterS??0),v,props.planeParameterT??0);return<><Segment a={a} b={add(a,u)} p={p} color="#86efac" width={2.5} arrow/><Segment a={a} b={add(a,v)} p={p} color="#c4b5fd" width={2.5} arrow/><Point v={end} p={p} label="P(s,t)" color="#f5f5f5" onSelect={select}/></>;})()}
   {props.showTraces&&[0,1,2].map(fixed=>{const coordinate:Vector3Value=[0,0,0];coordinate[fixed]=1;const direction=unit(cross(props.planeNormal,coordinate));const free=[0,1,2].find(i=>i!==fixed&&Math.abs(props.planeNormal[i])>1e-10);if(!direction.some(x=>x!==0)||free===undefined)return null;const anchor:Vector3Value=[0,0,0];anchor[free]=props.planeConstant/props.planeNormal[free];return<g key={fixed}><Segment a={add(anchor,direction,-extent)} b={add(anchor,direction,extent)} p={p} color={["#c4b5fd","#7dd3fc","#86efac"][fixed]} width={2.5}/><Label v={add(anchor,direction,extent*.65)} p={p}>{["yz","xz","xy"][fixed]} trace</Label></g>;})}
   {props.showTraces&&props.planeNormal.map((n,axis)=>{if(Math.abs(n)<1e-10)return null;const point:Vector3Value=[0,0,0];point[axis]=props.planeConstant/n;return<Point key={axis} v={point} p={p} label={`${["x","y","z"][axis]} intercept`} onSelect={select}/>;})}
   {(props.showExternalPoint||foot)&&<><Point v={props.externalPoint} p={p} label="P" color="#f5f5f5" onSelect={select}/>{props.showCoordinateGuides&&<><Segment a={[0,0,0]} b={[props.externalPoint[0],0,0]} p={p} dashed/><Segment a={[props.externalPoint[0],0,0]} b={[props.externalPoint[0],props.externalPoint[1],0]} p={p} dashed/><Segment a={[props.externalPoint[0],props.externalPoint[1],0]} b={props.externalPoint} p={p} dashed/></>}</>}
   {foot&&<><Segment a={props.externalPoint} b={foot} p={p} color="#f5f5f5" width={2} dashed/><Point v={foot} p={p} label="H" onSelect={select}/></>}
   {props.thirdPlaneEnabled&&props.commonSet==="point"&&props.commonPoint&&<Point v={props.commonPoint} p={p} label="Common point" color="#86efac" onSelect={select}/>}
   {props.thirdPlaneEnabled&&props.commonSet==="line"&&props.commonPoint&&props.commonDirection&&<Segment a={add(props.commonPoint,unit(props.commonDirection),-extent)} b={add(props.commonPoint,unit(props.commonDirection),extent)} p={p} color="#86efac" width={3}/>}
   {!props.thirdPlaneEnabled&&props.secondPlaneEnabled&&(()=>{const direction=cross(props.planeNormal,props.secondPlaneNormal),denominator=dot(direction,direction);if(denominator<1e-10)return null;const start=add(cross(props.secondPlaneNormal,direction).map(x=>x*props.planeConstant/denominator)as Vector3Value,cross(direction,props.planeNormal).map(x=>x*props.secondPlaneConstant/denominator)as Vector3Value);return<Segment a={add(start,unit(direction),-extent)} b={add(start,unit(direction),extent)} p={p} color="#86efac" width={3}/>;})()}
 </>}</Projection>;
}
export function ProjectedVectors({vectors,view,showNumbers,onSelect}:{vectors:DisplayVector[];view:string;showNumbers:boolean;onSelect:(id:string)=>void}){const extent=Math.max(5,...vectors.map(v=>Math.hypot(...v.value)*1.2));return<Projection view={view} extent={extent}>{p=><><Axes p={p} extent={extent} numbers={showNumbers}/>{vectors.map(v=><g key={v.id} onClick={()=>onSelect(v.id)}><Segment a={[0,0,0]} b={v.value} p={p} color={v.color} width={3} arrow/><Label v={v.value} p={p} color={v.color}>{v.label} ({v.value.map(number).join(", ")})</Label></g>)}</>}</Projection>;}
