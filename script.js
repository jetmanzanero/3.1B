let studentData = [];

// Load data from JSON
document.addEventListener('DOMContentLoaded', function () {
  fetch('data.json')
    .then(response => response.json())
    .then(data => {
      studentData = data;
      populateTable(studentData);
      renderChart(studentData);
    })
    .catch(error => console.error('Error loading data:', error));
});

function populateTable(data) {
  const tableBody = document.getElementById('studentTableBody');
  tableBody.innerHTML = '';

  if (data.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="5">No results found</td></tr>';
    return;
  }

  data.forEach(student => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${student.studentNumber}</td>
      <td class="clickable" data-id="${student.studentNumber}">${student.studentName}</td>
      <td>${calculateAverage([student.tp1, student.act1, student.assign, student.grpAct1])}</td>
      <td>${calculateAverage([student.q1, student.q2, student.q3, student.q4])}</td>
      <td>${student.exam}</td>
    `;
    tableBody.appendChild(row);
  });

  document.querySelectorAll('.clickable').forEach(element => {
    element.addEventListener('click', function () {
      const student = studentData.find(s => s.studentNumber === this.dataset.id);
      if (student) showDetails(student);
    });
  });
}

function calculateAverage(scores) {
  const validScores = scores.filter(score => score !== null && score !== undefined);
  const total = validScores.reduce((sum, score) => sum + score, 0);
  return validScores.length ? (total / validScores.length).toFixed(2) : '-';
}

// Show details in modal
function showDetails(student) {
  const modal = document.getElementById('studentModal');
  document.getElementById('modalStudentName').innerText = student.studentName;

  const detailsList = document.getElementById('modalDetails');
  detailsList.innerHTML = `
    <li>06TP1: ${student.tp1 || '-'}</li>
    <li>05Act1: ${student.act1 || '-'}</li>
    <li>05Assign: ${student.assign || '-'}</li>
    <li>05Quiz1: ${student.quiz1 || '-'}</li>
    <li>06GrpAct1: ${student.grpAct1 || '-'}</li>
    <li>Q1: ${student.q1 || '-'}</li>
    <li>Q2: ${student.q2 || '-'}</li>
    <li>Q3: ${student.q3 || '-'}</li>
    <li>Q4: ${student.q4 || '-'}</li>
    <li>Exam: ${student.exam || '-'}</li>
  `;

  modal.style.display = 'flex';

  document.getElementById('closeModal').onclick = () => {
    modal.style.display = 'none';
  };
}

// Render chart
function renderChart(data) {
  const ctx = document.getElementById('gradesChart').getContext('2d');
  const labels = data.map(student => student.studentName);
  const tp1Grades = data.map(student => student.tp1 || 0);

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: '06TP1 Grades',
          data: tp1Grades,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

document.getElementById('searchInput').addEventListener('input', function () {
  const searchValue = this.value.trim().toLowerCase();
  const filteredData = studentData.filter(student =>
    (student.studentNumber || '').toString().toLowerCase().includes(searchValue) ||
    (student.studentName || '').toLowerCase().includes(searchValue)
  );
  populateTable(filteredData);
});
