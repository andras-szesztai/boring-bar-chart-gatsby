import React from 'react';
import {SortableElement} from 'react-sortable-hoc';

import Container from "./Container"

export default SortableElement(({value}) => <Container>{value}</Container>);