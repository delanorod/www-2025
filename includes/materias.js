
  // 🔹 Substitua pelo ID da sua planilha
  const SHEET_ID = "160ARd8yznqu0xcCTh3yXmxtotix9OmPVZfGDdy2uOpU";
  const URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;

  fetch(URL)
    .then(res => res.text())
    .then(txt => {
      // A resposta do Google vem "embrulhada", então limpamos
      const json = JSON.parse(txt.substr(47).slice(0, -2));

      // Montar a tabela
      let html = "<table>";

      // Cabeçalho
      if (json.table.cols) {
        html += "<tr>";
        json.table.cols.forEach(col => {
          if (col.label) {
            html += `<th>${col.label}</th>`;
          }
        });
        html += "</tr>";
      }

      // Linhas de dados
      json.table.rows.forEach(row => {
        html += "<tr>";
        row.c.forEach(cell => {
          html += `<td>${cell ? cell.v : ""}</td>`;
        });
        html += "</tr>";
      });

      html += "</table>";

      document.getElementById("saida").innerHTML = html;
    })
    .catch(err => {
      document.getElementById("saida").innerHTML = "Erro ao carregar a planilha.";
      console.error(err);
    });
