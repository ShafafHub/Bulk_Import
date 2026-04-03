import { useState } from "react";
import Papa from "papaparse";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [processed, setProcessed] = useState(false);

  const [correctRows, setCorrectRows] = useState([]);
  const [wrongRows, setWrongRows] = useState([]);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];

    if (!selected || !selected.name.endsWith(".csv")) {
      alert("Please select a valid CSV file");
      return;
    }

    setFile(selected);
    setProcessed(false);
    setCorrectRows([]);
    setWrongRows([]);
  };

  const validateRow = (row) => {
    const errors = [];

    if (!row.name || row.name.trim() === "") {
      errors.push("Name is empty");
    }

    if (!row.price || isNaN(row.price) || Number(row.price) < 0) {
      errors.push("Invalid price");
    }

    return errors;
  };

  const handleProcess = () => {
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data;

        const correct = [];
        const wrong = [];

        data.forEach((row) => {
          const errors = validateRow(row);

          if (errors.length > 0) {
            wrong.push({ ...row, error: errors.join(", ") });
          } else {
            correct.push(row);
          }
        });

        setCorrectRows(correct);
        setWrongRows(wrong);
        setProcessed(true);
      },
    });
  };

  return (
    <div className="app">
      <div className="card">
        <h2 className="title"> Bulk Import</h2>

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
                <h2>{correctRows.length + wrongRows.length}</h2>
              </div>

              <div className="result-item">
                <p>Failed Rows</p>
                <h2>{wrongRows.length}</h2>
              </div>

              <div className="result-item">
                <p>Correct Rows</p>
                <h2>{correctRows.length}</h2>
              </div>
            </div>
          </div>

          <div className="tables">
            <div className="table-box">
              <h3 className="table-title">✅ Correct Rows</h3>

              {correctRows.length === 0 ? (
                <p className="empty">No valid data</p>
              ) : (
                <>
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Category</th>
                      </tr>
                    </thead>
                    <tbody>
                      {correctRows.map((row, i) => (
                        <tr key={i} className="row-success">
                          <td>{row.name}</td>
                          <td>{row.price}</td>
                          <td>{row.categoryId}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <button className="export-btn">⬇ Export CSV</button>
                </>
              )}
            </div>

            <div className="table-box">
              <h3 className="table-title">❌ Wrong Rows</h3>

              {wrongRows.length === 0 ? (
                <p className="empty">No errors</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Price</th>
                      <th>Category</th>
                      <th>Error</th>
                    </tr>
                  </thead>
                  <tbody>
                    {wrongRows.map((row, i) => (
                      <tr key={i} className="row-error">
                        <td>{row.name || "-"}</td>
                        <td>{row.price}</td>
                        <td>{row.categoryId}</td>
                        <td>{row.error}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
