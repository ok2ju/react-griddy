import React, { Component, PropTypes } from 'react';
import cx from 'classnames';

class TableRowColumn extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    columnNumber: PropTypes.number,
    hoverable: PropTypes.bool,
    onClick: PropTypes.func,
    onHover: PropTypes.func,
    onHoverExit: PropTypes.func,
    theme: PropTypes.shape({
      tableRowCol: PropTypes.string,
    }),
  };

  static defaultProps = {
    hoverable: false,
  };

  state = {
    hovered: false,
  };

  onClick = (event) => {
    if (this.props.onClick) this.props.onClick(event, this.props.columnNumber);
  };

  onMouseEnter = (event) => {
    if (this.props.hoverable) {
      this.setState({ hovered: true });
      if (this.props.onHover) this.props.onHover(event, this.props.columnNumber);
    }
  };

  onMouseLeave = (event) => {
    if (this.props.hoverable) {
      this.setState({ hovered: false });
      if (this.props.onHoverExit) this.props.onHoverExit(event, this.props.columnNumber);
    }
  };

  render() {
    const { children, className, theme } = this.props;

    const handlers = {
      onClick: this.onClick,
      onMouseEnter: this.onMouseEnter,
      onMouseLeave: this.onMouseLeave,
    };

    return (
      <td
        className={cx(theme.tableRowCol, className)}
        {...handlers}
      >
        {children}
      </td>
    );
  }
}

export default TableRowColumn;
