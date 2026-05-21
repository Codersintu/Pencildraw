import CanvasRoom from "@/component/Canvas/CanvasRoom";

export default async function Page({params}:{params:{roomId:number}}) {
  const roomId=(await params).roomId;
  console.log("Room ID:", roomId);
  return (
     <CanvasRoom roomId={roomId} />
  );
}