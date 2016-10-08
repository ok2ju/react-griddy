import React, { Component, PropTypes } from 'react';
import cx from 'classnames';

class TableBody extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    deselectOnClickaway: PropTypes.bool,
    multiSelectable: PropTypes.bool,
    onCellClick: PropTypes.func,
    onCellHover: PropTypes.func,
    onCellHoverExit: PropTypes.func,
    onRowHover: PropTypes.func,
    onRowHoverExit: PropTypes.func,
    onRowSelection: PropTypes.func,
    selectable: PropTypes.bool,
    showRowHover: PropTypes.bool,
    stripedRows: PropTypes.bool,
    theme: PropTypes.shape({
      tableBody: PropTypes.string,
    }),
  };

  static defaultProps = {
    deselectOnClickaway: true,
    multiSelectable: false,
    selectable: true,
  };

  static isValueInRange(value, range) {
    if (!range) return false;

    if ((range.start <= value && value <= range.end) ||
        (range.end <= value && value <= range.start)) {
      return true;
    }

    return false;
  }

  static getRangeOfValues(start, offset) {
    const values = [];
    const dir = (offset > 0) ? -1 : 1;
    while (offset !== 0) {
      values.push(start + offset);
      offset += dir;
    }

    return values;
  }

  // TODO: remove this method
  static getColumnId(columnNumber) {
    const columnId = columnNumber;
    return columnId;
  }

  state = {
    selectedRows: [],
  };

  onRowClick = (event, rowNumber) => {
    event.stopPropagation();

    if (this.props.selectable) {
      window.getSelection().removeAllRanges();
      this.processRowSelection(event, rowNumber);
    }
  };

  onCellClick = (event, rowNumber, columnNumber) => {
    event.stopPropagation();
    if (this.props.onCellClick) {
      this.props.onCellClick(rowNumber, this.getColumnId(columnNumber), event);
    }
  };

  onCellHover = (event, rowNumber, columnNumber) => {
    if (this.props.onCellHover) {
      this.props.onCellHover(rowNumber, this.getColumnId(columnNumber), event);
    }
    this.onRowHover(event, rowNumber);
  };

  onCellHoverExit = (event, rowNumber, columnNumber) => {
    if (this.props.onCellHoverExit) {
      this.props.onCellHoverExit(rowNumber, this.getColumnId(columnNumber), event);
    }
    this.onRowHoverExit(event, rowNumber);
  };

  onRowHover = (event, rowNumber) => {
    if (this.props.onRowHover) {
      this.props.onRowHover(rowNumber);
    }
  };

  onRowHoverExit = (event, rowNumber) => {
    if (this.props.onRowHoverExit) {
      this.props.onRowHoverExit(rowNumber);
    }
  };

  isRowSelected(rowNumber) {
    for (let i = 0; i < this.state.selectedRows.length; i++) {
      const selection = this.state.selectedRows[i];

      if (typeof selection === 'object') {
        if (this.isValueInRange(rowNumber, selection)) return true;
      } else {
        if (selection === rowNumber) return true;
      }
    }

    return false;
  }

  createRows() {
    const numChildren = React.Children.count(this.props.children);
    let rowNumber = 0;
    const handlers = {
      onCellClick: this.onCellClick,
      onCellHover: this.onCellHover,
      onCellHoverExit: this.onCellHoverExit,
      onRowHover: this.onRowHover,
      onRowHoverExit: this.onRowHoverExit,
      onRowClick: this.onRowClick,
    };

    return React.Children.map(this.props.children, (child) => {
      if (React.isValidElement(child)) {
        const props = {
          hoverable: this.props.showRowHover,
          selected: this.isRowSelected(rowNumber),
          striped: this.props.stripedRows && (rowNumber % 2 === 0),
          rowNumber: rowNumber++,
        };

        if (rowNumber === numChildren) {
          props.displayBorder = false;
        }

        return React.cloneElement(child, { ...props, ...handlers });
      }
    });
  }

  handleClickAway = () => {
    if (this.props.deselectOnClickaway && this.state.selectedRows.length) {
      this.setState({ selectedRows: [] });

      if (this.props.onRowSelection) this.props.onRowSelection([]);
    }
  };

  processRowSelection(event, rowNumber) {
    let selectedRows = this.start.selectedRows;

    if (event.shiftKey && this.props.multiSelectable && selectedRows.length) {
      const lastIndex = selectedRows.length - 1;
      const lastSelection = selectedRows[lastIndex];

      if (typeof lastSelection === 'object') {
        lastSelection.end = rowNumber;
      } else {
        selectedRows.splice(lastIndex, 1, { start: lastSelection, end: rowNumber });
      }
    } else if (((event.ctrlKey && !event.metaKey) || (event.metaKey && !event.ctrlKey)) && this.props.multiSelectable) {
      const idx = selectedRows.indexOf(rowNumber);
      if (idx < 0) {
        let foundRange = false;
        for (let i = 0; i < selectedRows.length; i++) {
          const range = selectedRows[i];
          if (typeof range !== 'object') continue;

          if (this.isValueInRange(rowNumber, range)) {
            foundRange = true;
            const values = this.splitRange(range, rowNumber);
            selectedRows.splice(i, 1, ...values);
          }
        }

        if (!foundRange) selectedRows.push(rowNumber);
      } else {
        selectedRows.splice(idx, 1);
      }
    } else {
      if (selectedRows.length === 1 && selectedRows[0] === rowNumber) {
        selectedRows = [];
      } else {
        selectedRows = [rowNumber];
      }
    }

    this.setState({ selectedRows });
    if (this.props.onRowSelection) this.props.onRowSelection(this.flattenRanges(selectedRows));
  }

  splitRange(range, splitPoint) {
    const splitValues = [];
    const startOffset = range.start - splitPoint;
    const endOffset = range.end - splitPoint;

    splitValues.push(...this.getRangeOfValues(splitPoint, startOffset));
    splitValues.push(...this.getRangeOfValues(splitPoint, endOffset));

    return splitValues;
  }

  flattenRanges(selectedRows) {
    const rows = [];
    for (const selection of selectedRows) {
      if (typeof selection === 'object') {
        const values = this.getRangeOfValues(selection.end, selection.start - selection.end);
        rows.push(selection.end, ...values);
      } else {
        rows.push(selection);
      }
    }

    return rows.sort();
  }

  render() {
    const { className, theme } = this.props;

    return (
      <ClickAwayListener onClickAway={this.handleClickAway}>
        <tbody className={cx(theme.tableBody, className)}>
          {this.createRows()}
        </tbody>
      </ClickAwayListener>
    );
  }
}

export default TableBody;
