import React from "react";
import { useTable } from "react-table";

// Table Component
const TableComponent = ({ data, currentPage, usersPerPage, onEdit, onDelete, onViewMap }) => {
  const columns = React.useMemo(
    () => [
      { 
        Header: "No", 
        accessor: (row, i) => (currentPage - 1) * usersPerPage + i + 1 // Auto-increment with pagination 
      }, 
      { Header: "Name", accessor: "name" },
      { Header: "Longitude", accessor: "longitude" },
      { Header: "Latitude", accessor: "latitude" },
      {
        Header: "Image",
        accessor: "image",
        Cell: ({ value }) => (
          <img
            src={`http://localhost:5000/public/images/${value}`} // Adjust as needed
            alt="user"
            style={{ width: "50px", height: "50px", objectFit: "cover" }}
          />
        ),
      },
      {
        Header: "Actions",
        Cell: ({ row }) => (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
            <button 
              onClick={() => onEdit(row.original.id)} // Pass only the ID to onEdit
              className="button is-small is-info"
            >
              Edit
            </button>
            <button 
              onClick={() => onDelete(row.original.id)}
              className="button is-small is-danger"
            >
              Delete
            </button>
            <button 
              onClick={() => onViewMap(row.original)} 
              className="button is-small is-primary is-bold"
            >
              View on Map
            </button>
          </div>
        )
      }
    ],
    [currentPage, usersPerPage, onEdit, onDelete, onViewMap] // Include handlers in dependencies
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data });

  // Styling for the table and rows
  const tableStyle = {
    width: "100%",
    maxWidth: "900px",
    borderCollapse: "collapse",
    margin: "20px auto",
    fontSize: "1em",
    boxShadow: "0 0 20px rgba(0, 0, 0, 0.1)",
    borderRadius: "5px",
    overflow: "hidden",
    textAlign: "center",
  };

  const thTdStyle = {
    padding: "12px 15px",
    textAlign: "center",
  };

  const theadStyle = {
    backgroundColor: "#072570",
    color: "#ffffff",
    fontWeight: "bold",
    padding: '10px'
  };

  const rowStyleEven = {
    backgroundColor: "#f3f3f3",
  };

  const rowStyleHover = {
    backgroundColor: "#f1f1f1",
  };

  return (
    <table style={tableStyle} {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th style={theadStyle} {...column.getHeaderProps()}>
                {column.render("Header")}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <tr
              {...row.getRowProps()}
              style={i % 2 === 0 ? rowStyleEven : {}}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = rowStyleHover.backgroundColor}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ""}
            >
              {row.cells.map(cell => (
                <td style={thTdStyle} {...cell.getCellProps()}>
                  {cell.render("Cell")}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default TableComponent;
