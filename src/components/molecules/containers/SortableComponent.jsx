import React, {useState} from 'react';
import {SortableContainer} from 'react-sortable-hoc';
import arrayMove from 'array-move';
import { SortableItem, GridContainer } from '../../atoms';

const SortableList = SortableContainer((props) => {
  const { items } = props
  return (
    <GridContainer
      {...props}
    >
      {items.map((value, index) => (
        <SortableItem key={`item-${value}`} index={index} value={value} />
      ))}
    </GridContainer>
  );
});

export default function(props){
  const { items: defaultItems } = props
  const [ items, setItems ] = useState(defaultItems)
  function onSortEnd({oldIndex, newIndex}){
    setItems(prev => arrayMove(prev, oldIndex, newIndex))
  }
  return (
    <SortableList items={items} onSortEnd={onSortEnd} {...props}/>
  );
}