import React, { Component, PropTypes } from 'react';

class TableHeader extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
  };

  createBaseHeaderRow() {
    const numChildren = React.Children.count(this.props.children);
    const child = numChildren === 1 ? this.props.children : this.props.children[numChildren - 1];
    const props = {
      key: `bh-${numChildren}`,
      rowNumber: numChildren,
    };

    return React.cloneElement(child, props);
  }

  createSuperHeaderRows() {
    const children = this.props.children;
    const numChildren = React.Children.count(children);
    if (numChildren === 1) return undefined;

    const superHeaders = [];
    children.forEach((child, idx) => {
      if (React.isValidElement(child)) {
        const props = {
          key: `sh-${idx}`,
          rowNumber: idx,
        };

        const superHeader = React.cloneElement(child, props);

        superHeaders.push(superHeader);
      }
    });

    if (superHeaders.length) return superHeaders;

    return [];
  }

  render() {
    const { className } = this.props;
    const superHeaderRows = this.createSuperHeaderRows();
    const baseHeaderRow = this.createBaseHeaderRow();

    return (
      <thead className={className}>
        {superHeaderRows}
        {baseHeaderRow}
      </thead>
    );
  }
}

export default TableHeader;
