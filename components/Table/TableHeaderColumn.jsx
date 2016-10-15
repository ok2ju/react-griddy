import React, { Component, PropTypes } from 'react';

class TableHeaderColumn extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    columnNumber: PropTypes.number,
    onClick: PropTypes.func,
  };

  onClick = (event) => {
    if (this.props.onClick) {
      this.props.onClick(event, this.props.columnNumber);
    }
  };

  render() {
    const { children, className } = this.props;

    return (
      <th
        className={className}
        onClick={this.onClick}
      >
        {children}
      </th>
    );
  }
}

export default TableHeaderColumn;
