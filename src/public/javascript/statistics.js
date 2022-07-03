const randomColor = function (length) {
  const colors = [];
  for (i = 0; i < length; i++) {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    colors.push("rgba(" + r + ", " + g + ", " + b + ", " + "0.2" + ")");
  }
  return colors;
};

// chart 1
const ctx = document.getElementById("statistic-1").getContext("2d");
const labels = statistics.monthly.labels;
const data = {
  labels: labels,
  datasets: [
    {
      label: "Monthly profit",
      data: statistics.monthly.data,
      backgroundColor: randomColor(statistics.monthly.data.length),
      borderWidth: 1,
    },
  ],
};
const config = {
  type: "bar",
  data: data,
};

const chart_1 = new Chart(ctx, config);

// chart 2
const pieData = {
  labels: statistics.categories.labels,
  datasets: [
    {
      label: "Categories profit",
      data: statistics.categories.data,
      backgroundColor: randomColor(statistics.categories.data.length),
      borderWidth: 1,
    },
  ],
};
const pieConfig = {
  type: "pie",
  data: pieData,
};
console.log(pieData);
const ctx_2 = document.getElementById("statistic-2").getContext("2d");
const chart_2 = new Chart(ctx_2, pieConfig);
