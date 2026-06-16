import { useState } from "react";

const data = [
  { id: 1, name: "A", email: "a@gmail.com" },
  { id: 2, name: "B", email: "b@gmail.com" },
  { id: 3, name: "C", email: "c@gmail.com" },
  { id: 4, name: "D", email: "d@gmail.com" },
  { id: 5, name: "E", email: "e@gmail.com" },
  { id: 6, name: "F", email: "f@gmail.com" },
  { id: 7, name: "G", email: "g@gmail.com" },
  { id: 8, name: "H", email: "h@gmail.com" },
  { id: 9, name: "I", email: "i@gmail.com" },
  { id: 10, name: "J", email: "j@gmail.com" },
  { id: 11, name: "K", email: "k@gmail.com" },
  { id: 12, name: "L", email: "l@gmail.com" }
];

function Users() {
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const start = (page - 1) * rowsPerPage;
  const current = data.slice(start, start + rowsPerPage);

  return (
    <div style={{ marginTop: "30px" }}>
      <table style={{
        width: "100%",
        borderCollapse: "collapse",
        marginTop: "20px"
      }}>
        <thead>
          <tr style={{ background: "#4facfe", color: "white" }}>
            <th style={{ padding: "10px" }}>ID</th>
            <th style={{ padding: "10px" }}>Name</th>
            <th style={{ padding: "10px" }}>Email</th>
          </tr>
        </thead>
        <tbody>
          {current.map((user) => (
            <tr key={user.id} style={{ textAlign: "center", borderBottom: "1px solid #ddd" }}>
              <td style={{ padding: "10px" }}>{user.id}</td>
              <td style={{ padding: "10px" }}>{user.name}</td>
              <td style={{ padding: "10px" }}>{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: "20px" }}>
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          style={{
            padding: "8px 15px",
            marginRight: "10px",
            background: "#ff7eb3",
            border: "none",
            color: "white",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          Prev
        </button>

        <span style={{ fontWeight: "bold" }}>Page {page}</span>

        <button
          onClick={() => setPage(page + 1)}
          disabled={start + rowsPerPage >= data.length}
          style={{
            padding: "8px 15px",
            marginLeft: "10px",
            background: "#42e695",
            border: "none",
            color: "white",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Users;