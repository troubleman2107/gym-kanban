import React, { useState, useEffect, useRef } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { v4 as uuidv4 } from "uuid";
import { convertDate, datesInWeek } from "./utils/helpers/function";
import AddButton from "./styles/imgs/AddButton.png";
import Exercise from "./components/Exercise";

const itemsFromBackend = [
  {
    id: uuidv4(),
    content: "Chest day",
    exercises: [
      {
        name: "Bench Press",
        set: "50lb x 6, 50lb x 6, 50lb x 6",
        number_of_set: "3",
      },
    ],
  },
  {
    id: uuidv4(),
    content: "Legs day",
    exercises: [
      {
        name: "Squat",
        set: "50lb x 6,50lb x 6, 50lb x 6, 50lb x 6",
        number_of_set: "4",
      },
    ],
  },
  {
    id: uuidv4(),
    content: "Back day",
    exercises: [
      {
        name: "Pull up",
        set: "50lb x 6, 50lb x 6, 50lb x 6",
        number_of_set: "3",
      },
    ],
  },
];

const dates = datesInWeek(new Date());
const columnsFromBackend = {};
for (var x = 0; x < dates.length; x++) {
  columnsFromBackend[x] = {
    name: convertDate(dates[x]),
    day: dates[x].getDate(),
    items: x === 0 ? itemsFromBackend : [],
    isNow:
      new Date(Date.now()).toString() === dates[x].toString() ? true : false,
  };
}

console.log(columnsFromBackend);

// const columnsFromBackend = {
//   [uuidv4()]: {
//     name: "Mon",
//     items: itemsFromBackend,
//   },
//   [uuidv4()]: {
//     name: "Tue",
//     items: [],
//   },
//   [uuidv4()]: {
//     name: "Wed",
//     items: [],
//   },
//   [uuidv4()]: {
//     name: "Thu",
//     items: [],
//   },
//   [uuidv4()]: {
//     name: "Fri",
//     items: [],
//   },
//   [uuidv4()]: {
//     name: "Sat",
//     items: [],
//   },
//   [uuidv4()]: {
//     name: "Sun",
//     items: [],
//   },
// };

const onDragEnd = (result, columns, setColumns) => {
  console.log("drag");
  if (!result.destination) return;
  const { source, destination } = result;

  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems,
      },
      [destination.droppableId]: {
        ...destColumn,
        items: destItems,
      },
    });
  } else {
    const column = columns[source.droppableId];
    const copiedItems = [...column.items];
    const [removed] = copiedItems.splice(source.index, 1);
    copiedItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...column,
        items: copiedItems,
      },
    });
  }
};

function App() {
  const [addingCard, setAddingCard] = useState({});
  const [itemAdd, setItemAdd] = useState({});
  const [columns, setColumns] = useState(columnsFromBackend);

  const ref = useRef();
  const [isOverflow, setOverflow] = useState(false);

  function isOverflowActive(event) {
    return (
      event.offsetHeight < event.scrollHeight ||
      event.offsetWidth < event.scrollWidth
    );
  }

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setItemAdd({
      ...itemAdd,
      [name]: value,
    });
  };

  // useEffect(() => {
  //   console.log(columns);
  // }, [columns]);

  const handleAddItem = async (columnId, itemId) => {
    const columnValue = [...columns[columnId].items];
    columnValue.map((value) => {
      if (value.id === itemId) {
        return value.exercises.push({
          ...itemAdd,
          number_of_set: itemAdd.set.split(",").length,
        });
      }
    });
    console.log(itemAdd);
    // console.log("afterAdd", afterAdd);
    setColumns({
      ...columns,
      [columnId]: {
        ...columns[columnId],
        items: columnValue,
      },
    });
    setAddingCard({
      ...addingCard,
      columns: columnId,
      isAdding: false,
    });
  };

  const handleShowAddItem = (conlumnId, itemId) => {
    console.log(itemId);
    setAddingCard({
      ...addingCard,
      columns: conlumnId,
      itemId: itemId,
      isAdding: true,
    });
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", height: "100%" }}>
      <DragDropContext
        onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
      >
        {Object.entries(columns).map(([columnId, column], index) => {
          return (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
              key={columnId}
            >
              <div style={{ margin: 8 }}>
                <Droppable droppableId={columnId} key={columnId}>
                  {(provided, snapshot) => {
                    return (
                      <>
                        <span className="day_name">{column.name}</span>
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="workout__container"
                        >
                          <span
                            className={`workout__container-item-day ${
                              column.isNow ? "day-now" : ""
                            }`}
                          >
                            {column.day}
                          </span>
                          {column.items.map((item, index) => {
                            return (
                              <Draggable
                                key={item.id}
                                draggableId={item.id}
                                index={index}
                              >
                                {(provided, snapshot) => {
                                  return (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      style={{
                                        userSelect: "none",
                                        minHeight: "50px",
                                        color: "white",
                                        ...provided.draggableProps.style,
                                      }}
                                      className="workout__container-item"
                                    >
                                      <div className="overflow">
                                        <span className="workout__container-item-title">
                                          {item.content}
                                        </span>
                                      </div>

                                      {item.exercises.map((exercise, index) => {
                                        return (
                                          <Exercise
                                            exercise={exercise}
                                            key={index}
                                          />
                                        );
                                      })}
                                      {addingCard.columns == columnId &&
                                      addingCard.itemId == item.id &&
                                      addingCard.isAdding ? (
                                        <div className="add_form">
                                          <input
                                            className="form-control"
                                            id="exampleFormControlInput1"
                                            placeholder="Exercise Name"
                                            name="name"
                                            onChange={handleOnChange}
                                          />
                                          <input
                                            className="form-control"
                                            id="exampleFormControlInput1"
                                            placeholder="Set Information"
                                            name="set"
                                            onChange={handleOnChange}
                                          />
                                          <button
                                            className="btn btn-primary mb-1"
                                            onClick={() =>
                                              handleAddItem(columnId, item.id)
                                            }
                                          >
                                            Add
                                          </button>
                                          <button
                                            className="btn btn-danger mb-1"
                                            onClick={() => setAddingCard(false)}
                                          >
                                            Cancel
                                          </button>
                                        </div>
                                      ) : (
                                        <div className="add_button">
                                          <img
                                            src={AddButton}
                                            onClick={() =>
                                              handleShowAddItem(
                                                columnId,
                                                item.id
                                              )
                                            }
                                          />
                                        </div>
                                      )}
                                    </div>
                                  );
                                }}
                              </Draggable>
                            );
                          })}
                          {provided.placeholder}
                        </div>
                      </>
                    );
                  }}
                </Droppable>
              </div>
            </div>
          );
        })}
      </DragDropContext>
    </div>
  );
}

export default App;
