import React, { Component, PropTypes } from 'react';
import cx from 'classnames';

class TableRow extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    displayBorder: PropTypes.bool,
    hoverable: PropTypes.bool,
    hovered: PropTypes.bool,
    onCellClick: PropTypes.func,
    onCellHover: PropTypes.func,
    onCellHoverExit: PropTypes.func,
    onRowClick: PropTypes.func,
    onRowHover: PropTypes.func,
    onRowHoverExit: PropTypes.func,
    rowNumber: PropTypes.number,
    selectable: PropTypes.bool,
    selected: PropTypes.bool,
    striped: PropTypes.bool,
    theme: PropTypes.shape({
      tableRow: PropTypes.string,
      striped: PropTypes.string,
      selected: PropTypes.string,
      hovered: PropTypes.string,
      bordered: PropTypes.string,
    }),
  };

  static defaultProps = {
    displayBorder: true,
    hoverable: false,
    hovered: false,
    selectable: true,
    selected: false,
    striped: false,
  };

  state = {
    hovered: false,
  };

  onRowClick(event) {
    if (this.props.selectable && this.props.onRowClick) {
      this.props.onRowClick(event, this.props.rowNumber);
    }
  }

  onRowHover(event) {
    if (this.props.onRowHover) this.props.onRowHover(event, this.props.rowNumber);
  }

  onRowHoverExit(event) {
    if (this.props.onRowHoverExit) this.props.onRowHoverExit(event, this.props.rowNumber);
  }

  onCellClick = (event, columnIndex) => {
    if (this.props.selectable && this.props.onCellClick) {
      this.props.onCellClick(event, this.props.rowNumber, columnIndex);
    }
    event.ctrlKey = true;
    this.onRowClick(event);
  };

  onCellHover = (event, columnIndex) => {
    if (this.props.hoverable) {
      this.setState({ hovered: true });
      if (this.props.onCellHover) this.props.onCellHover(event, this.props.rowNumber, columnIndex);
      this.onRowHover(event);
    }
  };

  onCellHoverExit = (event, columnIndex) => {
    if (this.props.hoverable) {
      this.setState({ hovered: false });
      if (this.props.onCellHoverExit) {
        this.props.onCellHoverExit(event, this.props.rowNumber, columnIndex);
      }
      this.onRowHoverExit(event);
    }
  };

  render() {
    const { striped, selected, hovered, displayBorder, className, theme } = this.props;

    const rowColumns = React.Children.map(this.props.children, (child, columnNumber) => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, {
          columnNumber,
          hoverable: this.props.hoverable,
          key: `${this.props.rowNumber}-${columnNumber}`,
          onClick: this.onCellClick,
          onHover: this.onCellHover,
          onHoverExit: this.onCellHoverExit,
        });
      }
    });

    return (
      <tr
        className={cx(theme.tableRow, {
          [theme.striped]: striped,
          [theme.selected]: selected,
          [theme.hovered]: hovered || this.state.hovered,
          [theme.bordered]: displayBorder,
        }, className)}
      >
        {rowColumns}
      </tr>
    );
  }
}

export default TableRow;
