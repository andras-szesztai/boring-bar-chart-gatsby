import React, {useState} from 'react';
import {SortableContainer} from 'react-sortable-hoc';
import arrayMove from 'array-move';
import { SortableItem, GridContainer } from '../../atoms';

const SortableList = SortableContainer((props) => {
  const { sortedItems } = props
  return (
    <GridContainer
      {...props}
    >
      {sortedItems.map((comp, index) => (
        <SortableItem key={`item-${comp}`} index={index} value={comp} />
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
    <SortableList sortedItems={items} onSortEnd={onSortEnd} {...props}/>
  );
}