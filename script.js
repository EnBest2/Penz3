let transactions = JSON.parse(localStorage.getItem("transactions") || "[]");
let savings = parseFloat(localStorage.getItem("savings") || "0");

function update() {
  let balance = 0;
  let list = document.getElementById("list");
  list.innerHTML = "";

  [...transactions].reverse().forEach((tx, index) => {
    let li = document.createElement("li");
    li.innerHTML = `${tx.date} - ${tx.title} - ${tx.amount.toLocaleString()} Ft [${tx.category}]
      <br><button onclick="remove(${transactions.length - 1 - index})">Törlés</button>`;
    list.appendChild(li);

    if (["Fizetés", "Gift"].includes(tx.category)) {
      balance += tx.amount;
    } else if (["Berakás"].includes(tx.category)) {
      balance -= tx.amount;
      savings += tx.amount;
    } else if (["Kivétel"].includes(tx.category)) {
      balance += tx.amount;
      savings -= tx.amount;
    } else if (["Kp be"].includes(tx.category)) {
      savings += tx.amount;
    } else if (["Kp ki"].includes(tx.category)) {
      savings -= tx.amount;
    } else {
      balance -= tx.amount;
    }
  });

  document.getElementById("balance").innerText = balance.toLocaleString();
  document.getElementById("savings").innerText = savings.toLocaleString();
  localStorage.setItem("transactions", JSON.stringify(transactions));
  localStorage.setItem("savings", savings.toString());
}

function add() {
  let title = document.getElementById("title").value;
  let amount = parseFloat(document.getElementById("amount").value);
  let date = document.getElementById("date").value;
  let category = document.getElementById("category").value;

  if (!title || isNaN(amount) || !date) {
    alert("Tölts ki minden mezőt!");
    return;
  }

  transactions.push({ title, amount, date, category });
  update();
}

function remove(index) {
  transactions.splice(index, 1);
  update();
}

function showSummary() {
  const summary = {};
  transactions.forEach(tx => {
    const month = tx.date.slice(0, 7); // év-hónap
    if (!summary[month]) summary[month] = {};
    if (!summary[month][tx.category]) summary[month][tx.category] = 0;
    summary[month][tx.category] += tx.amount;
  });

  let html = "";
  for (const [month, cats] of Object.entries(summary)) {
    html += `<h4>${month}</h4><ul>`;
    for (const [cat, amt] of Object.entries(cats)) {
      html += `<li>${cat}: ${amt.toLocaleString()} Ft</li>`;
    }
    html += "</ul>";
  }

  document.getElementById("popupContent").innerHTML = html;
  document.getElementById("summaryPopup").style.display = "block";
}

function showMonthlyBreakdown() {
  const byMonth = {};
  transactions.forEach(tx => {
    const month = tx.date.slice(0, 7);
    if (!byMonth[month]) byMonth[month] = {};
    if (!byMonth[month][tx.category]) byMonth[month][tx.category] = 0;
    byMonth[month][tx.category] += tx.amount;
  });

  let html = "";
  for (const month in byMonth) {
    html += `<h4>${month}</h4><ul>`;
    for (const cat in byMonth[month]) {
      html += `<li>${cat}: ${byMonth[month][cat].toLocaleString()} Ft</li>`;
    }
    html += "</ul>";
  }

  document.getElementById("popupContent").innerHTML = html;
  document.getElementById("summaryPopup").style.display = "block";
}

function closePopup() {
  document.getElementById("summaryPopup").style.display = "none";
}

update();