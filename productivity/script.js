const API_BASE = "https://script.google.com/macros/s/AKfycbw6AtQIuedTWyYKAZZ0ild3UKegJRfgndsKqAiDgBgOin4hbhAA0eJ_xq-TwEcl97sL/exec";

window.addEventListener("DOMContentLoaded", () => {
  fetch(`${API_BASE}?action=get-records`)
    .then(res => res.json())
    .then(data => renderRecords(data))
    .catch(err => {
      document.getElementById("record-list").innerText = "เกิดข้อผิดพลาดในการโหลดข้อมูล";
      console.error(err);
    });

  document.getElementById("editRecordForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const payload = {
      id: document.getElementById("edit-id").value,
      name: document.getElementById("edit-name").value,
      department: document.getElementById("edit-department").value,
      unit: document.getElementById("edit-unit").value,
      date: document.getElementById("edit-date").value,
      key_project: document.getElementById("edit-project").value,
      key_activity: document.getElementById("edit-activity").value,
      detail: document.getElementById("edit-detail").value,
      manday: parseFloat(document.getElementById("edit-manday").value),
      month: document.getElementById("edit-month").value
    };

    fetch(`${API_BASE}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "update-record", record: payload })
    })
    .then(res => res.json())
    .then(result => {
      if (result.success) {
        alert("บันทึกการแก้ไขเรียบร้อยแล้ว");
        location.reload();
      } else {
        alert("เกิดข้อผิดพลาดในการอัปเดต");
      }
    });
  });
});

function renderRecords(data) {
  const container = document.getElementById("record-list");
  if (data.length === 0) {
    container.innerText = "ไม่พบข้อมูลย้อนหลัง";
    return;
  }

  const table = document.createElement("table");
  table.innerHTML = `<thead>
    <tr>
      <th>ชื่อ</th>
      <th>ฝ่าย</th>
      <th>วันที่</th>
      <th>เดือน</th>
      <th>Project</th>
      <th>Activity</th>
      <th>รายละเอียด</th>
      <th>Man Day</th>
      <th>แก้ไข</th>
    </tr>
  </thead>`;
  const tbody = document.createElement("tbody");

  data.forEach(r => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${r["ชื่อ-สกุล"]}</td>
      <td>${r["ฝ่าย"]}</td>
      <td>${r["วันที่"]}</td>
      <td>${r["เดือนที่รายงาน"]}</td>
      <td>${r["Key Project"]}</td>
      <td>${r["Key Activity"]}</td>
      <td>${r["รายละเอียดกิจกรรม"]}</td>
      <td>${r["Man Day"]}</td>
      <td><button onclick='loadEdit(${JSON.stringify(r)})'>Edit</button></td>
    `;
    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  container.innerHTML = "";
  container.appendChild(table);
}

function loadEdit(record) {
  document.getElementById("edit-form").style.display = "block";
  document.getElementById("edit-id").value = record.id;
  document.getElementById("edit-name").value = record["ชื่อ-สกุล"];
  document.getElementById("edit-department").value = record["ฝ่าย"];
  document.getElementById("edit-unit").value = record["งาน"];
  document.getElementById("edit-date").value = record["วันที่"];
  document.getElementById("edit-month").value = record["เดือนที่รายงาน"];
  document.getElementById("edit-project").value = record["Key Project"];
  document.getElementById("edit-activity").value = record["Key Activity"];
  document.getElementById("edit-detail").value = record["รายละเอียดกิจกรรม"];
  document.getElementById("edit-manday").value = record["Man Day"];
}

function cancelEdit() {
  document.getElementById("edit-form").style.display = "none";
}
