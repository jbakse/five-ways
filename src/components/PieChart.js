import React, { useEffect } from "react";
import { Chart, PieController, ArcElement } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

Chart.register(PieController, ArcElement, ChartDataLabels);

const labels = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];
const colors = ["#cfc", ...Array.from({ length: 25 }, () => "white")];

export function PieChart({ data }) {
  useEffect(() => {
    const context = document.querySelector("#myChart").getContext("2d");

    /* exported myChart */
    const myChart = new Chart(context, {
      type: "pie",

      data: { datasets: [{ data }] },

      options: {
        rotation: 180,
        events: [],
        backgroundColor: colors,
        borderColor: "black",
        borderWidth: 1,
        responsive: true,
        animation: {
          duration: 1000,
          animateScale: true,
        },
        plugins: {
          datalabels: {
            color: "#black",
            font: {
              size: 100,
              family: "'Maxeville-Construct'", // needs both quotes
            },
            formatter(value, context) {
              return labels[context.dataIndex];
            },
            display: (context) => {
              const value = context.dataset.data[context.dataIndex];
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              return value / total >= 0.1;
            },
          },
        },
      },
    });

    return () => {
      myChart.destroy();
    };
  });

  return <canvas id="myChart" width="400" height="400"></canvas>;
}
