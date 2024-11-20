// Initialize variables
let weekChart = null;
let timeEntries = null;
const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function weekdata(entries) {
  if (!entries || !Array.isArray(entries)) {
    return Array(7)
      .fill()
      .map((_, i) => ({
        date: new Date(Date.now() - i * 86400000).toISOString().split("T")[0],
        totalMinutes: 0,
      }));
  }

  const today = new Date();
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(today.getDate() - i);
    return date.toISOString().split("T")[0];
  });

  const dailyTotals = entries.reduce((acc, entry) => {
    const start = new Date(entry.start_time);
    const end = new Date(entry.end_time);
    const date = start.toISOString().split("T")[0];
    const duration = (end - start) / 1000 / 60;

    acc[date] = (acc[date] || 0) + duration;
    return acc;
  }, {});

  return last7Days.map((date) => ({
    date: date,
    totalMinutes: Math.round(dailyTotals[date] || 0),
  }));
}

function monthdata(entries) {
  if (!entries || !Array.isArray(entries)) {
    return Array(30)
      .fill()
      .map((_, i) => ({
        date: new Date(Date.now() - i * 86400000).toISOString().split("T")[0],
        totalMinutes: 0,
      }));
  }

  const today = new Date();
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(today.getDate() - i);
    return date.toISOString().split("T")[0];
  });

  const dailyTotals = entries.reduce((acc, entry) => {
    const start = new Date(entry.start_time);
    const end = new Date(entry.end_time);
    const date = start.toISOString().split("T")[0];
    const duration = (end - start) / 1000 / 60;

    acc[date] = (acc[date] || 0) + duration;
    return acc;
  }, {});

  return last30Days.map((date) => ({
    date: date,
    totalMinutes: Math.round(dailyTotals[date] || 0),
  }));
}

function buildWeekChart(data) {
  if (!weekChart) return;

  const reversedData = data.slice().reverse();

  const option = {
    backgroundColor: "transparent",
    title: {
      text: "Weekly Time Chart",
      textStyle: {
        fontSize: 25,
        fontWeight: "normal",
        color: "#e1e1e1",
        left: "center",
      },
      top: 0,
    },
    tooltip: {
      trigger: "axis",
      formatter: function (params) {
        return `<div style="padding: 4px 8px">
            <strong>${params[0].name}</strong><br/>
            ${params[0].value} hours worked
          </div>`;
      },
      axisPointer: {
        type: "shadow",
      },
      backgroundColor: "rgba(50, 50, 50, 0.95)",
      borderColor: "#555",
      borderWidth: 1,
      textStyle: {
        color: "#e1e1e1",
      },
      extraCssText:
        "box-shadow: 0 0 10px rgba(0, 0, 0, 0.3); border-radius: 4px;",
    },
    grid: {
      top: "15%",
      left: "5%",
      right: "5%",
      bottom: "10%",
      containLabel: true,
    },
    xAxis: {
      data: reversedData.map((item) => weekday[new Date(item.date).getDay()]),
      axisLine: {
        lineStyle: { color: "#555" },
      },
      axisLabel: {
        color: "#e1e1e1",
        fontSize: 18,
        fontWeight: "bold",
      },
    },
    yAxis: {
      type: "value",
      name: " ",
      nameTextStyle: {
        color: "#e1e1e1",
      },
      axisLine: {
        lineStyle: { color: "#555" },
      },
      axisLabel: {
        color: "#e1e1e1",
        fontSize: 16,
        fontWeight: "bold",
      },
      splitLine: {
        lineStyle: {
          color: "#333",
        },
      },
    },
    series: [
      {
        name: "Time",
        type: "bar",
        data: reversedData.map((item) => +(item.totalMinutes / 60).toFixed(2)),
        barWidth: "80%",
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "#AF40FF" },
            { offset: 0.5, color: "#5B42F3" },
            { offset: 1, color: "#00DDEB" },
          ]),
          borderRadius: [10, 10, 0, 0],
        },
        emphasis: {
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "#AF40FF" },
              { offset: 0.5, color: "#5B42F3" },
              { offset: 1, color: "#00DDEB" },
            ]),
          },
        },
      },
    ],
  };

  weekChart.setOption(option);
}

function buildMonthChart(data) {
  if (!monthChart) return;

  const calendarData = data.map((item) => [
    item.date,
    +(item.totalMinutes / 60).toFixed(2),
  ]);

  const option = {
    backgroundColor: "transparent",
    title: {
      text: "Monthly Time Distribution",
      textStyle: {
        fontSize: 25,
        fontWeight: "normal",
        color: "#e1e1e1",
      },
      top: 0,
    },
    tooltip: {
      formatter: function (params) {
        return `<div style="padding: 4px 8px">
            <strong>${params.value[0]}</strong><br/>
            ${params.value[1]} hours worked
          </div>`;
      },
      backgroundColor: "rgba(50, 50, 50, 0.95)",
      borderColor: "#555",
      borderWidth: 1,
      textStyle: {
        color: "#e1e1e1",
      },
      extraCssText:
        "box-shadow: 0 0 10px rgba(0, 0, 0, 0.3); border-radius: 4px;",
    },
    visualMap: {
      min: 0,
      max: Math.max(...data.map((item) => item.totalMinutes / 60)),
      calculable: true,
      orient: "horizontal",
      left: "center",
      top: "8%",
      itemWidth: 20,
      itemHeight: 180,
      inRange: {
        color: ["rgba(22, 27, 34, 1)", "#AF40FF", "#5B42F3", "#00DDEB"],
      },
      textStyle: {
        color: "#e1e1e1",
      },
    },
    calendar: {
      top: "120",
      left: "50",
      right: "50",
      bottom: "40",
      cellSize: ["auto", 20],
      range: getCalendarRange(),
      itemStyle: {
        borderWidth: 2,
        borderColor: "#333",
        borderRadius: 10,
        color: "#1a1a1a",
      },
      yearLabel: { show: false },
      dayLabel: {
        nameMap: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        color: "#e1e1e1",
        fontSize: 16,
        margin: 5,
      },
      monthLabel: {
        show: true,
        color: "#e1e1e1",
        fontSize: 18,
        margin: 8,
      },
      splitLine: {
        show: false,
      },
    },
    series: [
      {
        type: "heatmap",
        coordinateSystem: "calendar",
        data: calendarData,
        animation: true,
        animationDuration: 1000,
        animationEasing: "cubicOut",
        itemStyle: {
          borderRadius: 10,
          borderWidth: 2,
          borderColor: "#333",
          emphasis: {
            opacity: 0.8,
            shadowBlur: 6,
            shadowColor: "rgba(0, 255, 155, 0.2)",
          },
        },
      },
    ],
  };

  monthChart.setOption(option, true);
}

// Helper function to get calendar range for current month
function getCalendarRange() {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  return [
    firstDay.toISOString().split("T")[0],
    lastDay.toISOString().split("T")[0],
  ];
}

// Single event listener for initialization
document.addEventListener("DOMContentLoaded", async () => {
  // Initialize chart first
  weekChart = echarts.init(document.getElementById("week-chart"));
  monthChart = echarts.init(document.getElementById("month-chart"));

  try {
    // Fetch data
    const response = await fetch("/api/time-entries");
    if (!response.ok) throw new Error("Failed to fetch data");

    timeEntries = await response.json();

    // Process and display data
    const weeklyData = weekdata(timeEntries);
    buildWeekChart(weeklyData);
    const monthlyData = monthdata(timeEntries);
    buildMonthChart(monthlyData);
  } catch (error) {
    console.error("Error:", error);
    document.getElementById("output").textContent = "Failed to load data";
    // Show empty chart
    buildWeekChart(weekdata(null));
  }
});

// Initialize feather icons
feather.replace();
