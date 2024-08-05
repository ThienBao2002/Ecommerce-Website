import React, { useState,useRef , useEffect,useMemo  } from 'react';
import { ListManager } from "react-beautiful-dnd-grid";
import { Input, Button } from "reactstrap";



const DragAndDropGridVariant = ({ onSortedListChange,productListVariantChild,defaultSortedList,isUseDefault,isEditMode }) => {
  const initialSortedList = useMemo(() => {
    if (isUseDefault&&!isEditMode) {
      return defaultSortedList.map((item, index) => ({
        ...item,
        _id: item._id || index + 1, // Add _id if it doesn't exist, starting from 1
        index: index,
        autoFocus: false, // Initialize autoFocus as false for all items
      }));
    } else if (isEditMode && productListVariantChild && productListVariantChild.length > 0) {
      return productListVariantChild.map((item, index) => ({
        ...item,
        _id: item._id || index + 1, // Add _id if it doesn't exist, starting from 1
        index: index,
        autoFocus: false, // Initialize autoFocus as false for all items
      }));
    } else {
      return productListVariantChild.map((item, index) => ({
        ...item,
        _id: item._id || index + 1, // Add _id if it doesn't exist, starting from 1
      }));
    }
  }, [isUseDefault, productListVariantChild, isEditMode, defaultSortedList]);

  const [sortedList, setSortedList] = useState(initialSortedList);

  useEffect(() => {
    // Only update when sortedList changes and it's not due to adding an empty item
    if (sortedList.length === 0 || sortedList[sortedList.length - 1].name !== "") {
      setSortedList(prev => [...prev, { _id: prev.length + 1, name: "", index: prev.length,position:prev.length, autoFocus: true }]);
    }
  }, [sortedList.length]); // Only depend on the length of sortedList

  useEffect(() => {
    // Notify the change of sortedList
    onSortedListChange(sortedList);
  }, [sortedList]);



  const handleInputChange = (newValue, name, shouldFocusNext = false) => {
    // Check if newValue duplicates any existing name in the list
    const isDuplicate = sortedList.some(item => item.name === newValue);

    if (isDuplicate) {
      console.log("Name already exists, cannot add");
      return; // Stop function execution if duplicate found
    }

    let newList = sortedList.map(item => {
      if (item.name === name) {
        return { ...item, name: newValue };
      }
      return item;
    });

    // Add an empty item if adding a new item
    if (name === "" && newValue !== "") {
      newList = [...newList, { _id: newList.length + 1, name: "", index: newList.length, position: newList.length, autoFocus: true }];
    }

    setSortedList(newList);

    if (shouldFocusNext) {
      // Logic to focus the next input if needed
      const nextIndex = newList.findIndex(item => item.name === "");
      if (nextIndex !== -1) {
        newList = newList.map((item, idx) => ({
          ...item,
          autoFocus: idx === nextIndex
        }));
        setSortedList(newList);
      }
    }
  };



  const handleDeleteColumn = (name) => {
    const newList = sortedList.filter(item => item.name !== name).map((item, index) => ({
      ...item,
      index: index
    }));
    setSortedList(newList);
  };

  const reorderList = (sourceIndex, destinationIndex) => {
    if (destinationIndex === sourceIndex) {
      return;
    }
    const newList = [...sortedList];
    // Lấy ra phần tử được kéo
    const [removed] = newList.splice(sourceIndex, 1);
    // Chèn phần tử đó vào vị trí mới
    newList.splice(destinationIndex, 0, removed);

    // Cập nhật 'order' cho tất cả phần tử dựa vào vị trí mới trong mảng
    const updatedList = newList.map((item, index) => ({
      ...item,
      index: index
    }));

    setSortedList(updatedList);
};


  return (
    <div className="App">
      <ListManager
        items={sortedList}
        direction="horizontal"
        maxItems={3}
        render={(item) => (
          <ListElement
            item={item}
            handleInputChange={handleInputChange}
            handleDeleteColumn={handleDeleteColumn}
          />
        )}
        onDragEnd={reorderList}
      />
      <style>
        {`
          .App {
            font-family: 'Arial';
          }
          .item {
            width: 200px;
            height: 50px;
            margin: 10px;
            background-color: #e6e6e6;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 2em;
            font-weight: bold;
            color: white;   
          }
          .item > div {
            flex-grow: 1;
          }
        `}
      </style>
    </div>
  );
};

const ListElement = ({ item, handleInputChange, handleDeleteColumn }) => {
  const [inputValue, setInputValue] = useState(item.name);
  const inputRef = useRef(null);
  useEffect(() => {
    if (item.autoFocus) {
      inputRef.current?.focus();
    }
  }, [item.autoFocus]);
  const handleKeyDown = (event) => {
    if ((event.key === "Tab" && !event.shiftKey) || event.key === "Enter") {
      event.preventDefault(); // Ngăn không cho tab mặc định chuyển đi
      handleInputChange(inputValue, item.name, true); // Chuyển true làm tham số thứ ba để biết là chuyển từ Tab
    }
  };

  return (
    <div className="item">
      <Input
        style={{ marginLeft: "10px" }}
        type="text"
        placeholder="ví dụ: Trắng, Đỏ v.v"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onFocus={() => handleInputChange(inputValue, item.name)}
        onKeyDown={handleKeyDown}
        innerRef={inputRef} // Sử dụng innerRef cho thư viện như reactstrap
        key={item.index}
      />
      <Button
        className="btn btn-soft-danger"
        style={{ marginRight: "10px", marginLeft: "10px" }}
        onClick={() => handleDeleteColumn(item.name)}
      >
        <i className="ri-delete-back-2-line"></i>
      </Button>
    </div>
  );
};



export default DragAndDropGridVariant;
