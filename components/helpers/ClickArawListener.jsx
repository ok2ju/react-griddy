import React, { Component, PropTypes } from 'react';
import events from '../utils/events';

const clickAwayEvents = ['mouseup', 'touchend'];
const bind = (callback) => clickAwayEvents.forEach(event => events.on(document, event, callback));
const unbind = (callback) => clickAwayEvents.forEach(event => events.off(document, event, callback));

class ClickAwayListener extends Component {
  static propTypes = {
    children: PropTypes.node,
    onClickAway: PropTypes.func,
  };

  componentDidMount() {
    this.isCurrentMounted = true;
    if (this.props.onClickAway) bind(this.props.handleClickAway);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.onClickAway !== this.props.onClickAway) {
      unbind(this.handleClickAway);
      if (this.props.onClickAway) bind(this.handleClickAway);
    }
  }
}

export default ClickAwayListener;
