import Image from "next/image";
import { useRef } from "react";

const InventoryItemComponent = (props: {
  imageUrl: string;
  selectHandler: () => void;
  dragStartHandler: () => void;
}) => {
  const dragStartPos = useRef<{ x: number; y: number } | null>(null);

  const onMouseDown = (event: React.MouseEvent) => {
    dragStartPos.current = { x: event.clientX, y: event.clientY };
  };

  const onMouseMove = (event: React.MouseEvent) => {
    if (dragStartPos.current) {
      const dx = event.clientX - dragStartPos.current.x;
      const dy = event.clientY - dragStartPos.current.y;
      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
        dragStartPos.current = null;
        props.dragStartHandler();
      }
    }
  };

  const onMouseUp = () => {
    dragStartPos.current = null;
  };

  return (
    <Image
      width={80}
      height={80}
      src={props.imageUrl}
      draggable={false}
      alt="Inventory Icon"
      className="rounded-[8px] cursor-pointer"
      style={{
        maxWidth: 80,
        maxHeight: 80,
        objectFit: "contain",
      }}
      onClick={props.selectHandler}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    />
  );
};

export { InventoryItemComponent };
