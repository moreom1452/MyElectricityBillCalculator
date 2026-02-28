let tariffs = {};

fetch("tariffs.json")
  .then((res) => res.json())
  .then((data) => {
    tariffs = data;
    const stateSelect = document.getElementById("state");
    Object.keys(tariffs).forEach((state) => {
      const opt = document.createElement("option");
      opt.value = state;
      opt.textContent = state;
      stateSelect.appendChild(opt);
    });
  });

function calculateBill() {
  const state = document.getElementById("state").value;
  const category = document.getElementById("category").value;
  const units = parseInt(document.getElementById("units").value);
  const resultDiv = document.getElementById("result");

  if (!state || !units) {
    resultDiv.innerHTML = "<p>Please select state and enter valid units.</p>";
    return;
  }

  const tariff = tariffs[state][category];
  if (!tariff) {
    resultDiv.innerHTML = "<p>No data available for this selection.</p>";
    return;
  }

  let total = 0;
  let breakdownHtml = "<h3>Bill Breakdown</h3><ul>";

  tariff.slabs.forEach((slab) => {
    if (units > slab.min) {
      const consumed = Math.min(
        units,
        slab.max === "Infinity" ? units : slab.max
      ) - slab.min;
      if (consumed > 0) {
        const amount = consumed * slab.rate;
        breakdownHtml += `<li>${consumed} units × ₹${slab.rate} = ₹${amount}</li>`;
        total += amount;
      }
    }
  });

  if (tariff.fixedCharges) {
    tariff.fixedCharges.forEach((fc) => {
      total += fc.charge;
      breakdownHtml += `<li>Fixed Charge = ₹${fc.charge}</li>`;
    });
  }

  breakdownHtml += `</ul><p><b>Total Bill: ₹${total}</b></p>`;
  resultDiv.innerHTML = breakdownHtml;
}
