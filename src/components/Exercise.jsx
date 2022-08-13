import React, { useRef, useState, useEffect } from "react";

const Exercise = ({ exercise }) => {
  const ref = useRef();
  const [isOverflow, setOverflow] = useState(false);

  function isOverflowActive(event) {
    return (
      event.offsetHeight < event.scrollHeight ||
      event.offsetWidth < event.scrollWidth
    );
  }

  useEffect(() => {
    let checkOverflow = isOverflowActive(ref.current);
    setOverflow(checkOverflow);
  }, [exercise]);

  return (
    <div className="workout__container-exercise">
      <span
        className="workout__container-exercise-name overflow"
        title={isOverflow ? exercise.name : undefined}
        ref={ref}
      >
        {exercise.name}
      </span>
      <div className="workout__container-exercise-set overflow">
        <span className="workout__container-exercise-set-value">
          {exercise.number_of_set}x
        </span>
        <span
          className="workout__container-exercise-set-number overflow"
          title={isOverflow ? exercise.set : undefined}
          ref={ref}
        >
          {exercise.set}
        </span>
      </div>
    </div>
  );
};

export default Exercise;
