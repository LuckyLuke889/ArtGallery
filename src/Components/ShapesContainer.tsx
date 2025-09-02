import React from 'react';

interface ShapesContainerProps {
  ref: React.RefObject<HTMLDivElement>,
  height?: string,
  width?: string
}

const ShapesContainer = (props: ShapesContainerProps) => {

  return (
    <div
      ref={props.ref}
      style={{
        position: 'relative',
        height: props.height,
        width: props.width,
      }}
    >
    </div>
  );
};

export default ShapesContainer;
