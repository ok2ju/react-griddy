import React, { Component, PropTypes } from 'react';

class Table extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    fixedHeader: PropTypes.bool,
    heigth: PropTypes.string,
    multiSelectable: PropTypes.bool,
    onCellClick: PropTypes.func,
    onCellHover: PropTypes.func,
    onCellHoverExit: PropTypes.func,
    onRowHover: PropTypes.func,
    onRowHoverExit: PropTypes.func,
    onRowSelection: PropTypes.func,
    selectable: PropTypes.bool,
  };

  static defaultProps = {
    fixedHeader: true,
    heigth: 'inherit',
    multiSelectable: false,
    selectable: true,
  };

  onCellClick = (rowNumber, columnNumber, event) => {
    if (this.props.onCellClick) this.props.onCellClick(rowNumber, columnNumber, event);
  };

  onCellHover = (rowNumber, columnNumber, event) => {
    if (this.props.onCellHover) this.props.onCellHover(rowNumber, columnNumber, event);
  };

  onCellHoverExit = (rowNumber, columnNumber, event) => {
    if (this.props.onCellHoverExit) this.props.onCellHoverExit(rowNumber, columnNumber, event);
  };

  onRowHover = (rowNumber) => {
    if (this.props.onRowHover) this.props.onRowHover(rowNumber);
  };

  onRowHoverExit = (rowNumber) => {
    if (this.props.onRowHoverExit) this.props.onRowHoverExit(rowNumber);
  };

  onRowSelection = (selectedRows) => {
    if (this.props.onRowSelection) this.props.onRowSelection(selectedRows);
  };

  createTableBody(base) {
    return React.cloneElement(base, {
      multiSelectable: this.props.multiSelectable,
      onCellClick: this.onCellClick,
      onCellHover: this.onCellHover,
      onCellHoverExit: this.onCellHoverExit,
      onRowHover: this.onRowHover,
      onRowHoverExit: this.onRowHoverExit,
      onRowSelection: this.onRowSelection,
      selectable: this.props.selectable,
    });
  }

  render() {
    const { children, className, fixedHeader } = this.props;

    let tHead;
    let tBody;

    React.Children.forEach(children, (child) => {
      if (!React.isValidElement(child)) return;

      /**
       * TODO: Read about contextType (muiName from ContextType)
       */
      const { muiName } = child.type;
      if (muiName === 'TableBody') {
        tBody = this.createTableBody(child);
      } else if (muiName === 'TableHeader') {
        tHead = child;
      }
    });

    if (!tBody && !tHead) return null;

    let headerTable;
    let inlineHeader;

    if (fixedHeader) {
      headerTable = (
        <div>
          <table>{tHead}</table>
        </div>
      );
    } else {
      inlineHeader = tHead;
    }

    return (
      <div className={className}>
        {headerTable}
        <div>
          <table>
            {inlineHeader}
            {tBody}
          </table>
        </div>
      </div>
    );
  }
}

export default Table;
