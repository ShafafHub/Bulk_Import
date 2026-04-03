import { useState } from "react";
import Papa from "papaparse";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [rows, setRows] = useState([]);
  const [processed, setProcessed] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];

    if (!selected || !selected.name.endsWith(".csv")) {
      alert("Please select a valid CSV file");
      return;
    }

    setFile(selected);
    setProcessed(false);
  };

  const handleProcess = () => {
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setRows(results.data);
        setProcessed(true);
      },
    });
  };

  return (
    <div className="app">
      <div className="card">
        <h2 className="title">Bulk Import</h2>

        <div className="upload-box">
          <input type="file" onChange={handleFileChange} />
          <button onClick={handleProcess} disabled={!file}>
            Process
          </button>
        </div>
      </div>

      {processed && (
        <>
          <div className="card">
            <h3 className="title">Result</h3>

            <div className="result-box">
              <div className="result-item">
                <p>All Rows</p>
                <h2>{rows.length}</h2>
              </div>

              <div className="result-item">
                <p>Failed Rows</p>
                <h2>0</h2>
              </div>

              <div className="result-item">
                <p>Correct Rows</p>
                <h2>{rows.length}</h2>
              </div>
            </div>
          </div>

          <div className="tables">
            <div className="table-box">
              <h3 className="table-title">Correct Rows</h3>

              {rows.length === 0 ? (
                <p className="empty">No data</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Price</th>
                      <th>Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, i) => (
                      <tr key={i}>
                        <td>{row.name}</td>
                        <td>{row.price}</td>
                        <td>{row.categoryId}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              <button className="export-btn">Export CSV</button>
            </div>
            <div className="table-box">
              <h3 className="table-title">Failed Rows</h3>
              <p className="empty">No errors yet</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
