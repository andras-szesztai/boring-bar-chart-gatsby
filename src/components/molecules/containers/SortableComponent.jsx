import React, {useState} from 'react';
import {SortableContainer} from 'react-sortable-hoc';
import arrayMove from 'array-move';
import { SortableItem } from '../../atoms';

const SortableList = SortableContainer(({items}) => {
  return (
    <div>
      {items.map((value, index) => (
        <SortableItem key={`item-${value}`} index={index} value={value} />
      ))}
    </div>
  );
});

export default function({items: defaultItems}){
  const [ items, setItems ] = useState(defaultItems)
  function onSortEnd({oldIndex, newIndex}){
    setItems(prev => arrayMove(prev, oldIndex, newIndex))
  }
  return (
    <SortableList items={items} onSortEnd={onSortEnd} />
  );
}