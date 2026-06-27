import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";
import axios from "axios";

import "../styles/Dashboard.css";

function Dashboard() {

  const [history, setHistory] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [regenerationData, setRegenerationData] = useState(null);

  useEffect(() => {

  fetchAnalytics();

}, []);

const fetchAnalytics = async () => {

  try {

    const response =
      await axios.get(
        "https://ai-product-launch-generator.onrender.com/analytics"
      );
    const regenResponse =
      await axios.get(
        "https://ai-product-launch-generator.onrender.com/regeneration-analytics"
      );

    setRegenerationData(
      regenResponse.data
    );

    setAnalytics(response.data);

    setHistory(
      response.data.recentCampaigns
    );

  } catch (error) {

    console.log(error);

  }

};

if (!analytics || !regenerationData) {

  return (
    <div
      style={{
        color: "white",
        padding: "30px"
      }}
    >
      Loading Analytics...
    </div>
  );

}

const totalCampaigns =
  analytics.totalCampaigns;

const totalProducts =
  analytics.totalProducts;

const latestCampaign =
  analytics.latestCampaign;

const lastCampaignTime =
  analytics.lastCampaignTime;

const topOccasion =
  analytics.topOccasion;

const topProduct =
  analytics.topProduct;

const chartData =
  analytics.chartData;
const monthlyData =
  analytics.monthlyData;

const occasionCounts = {};

chartData.forEach((item) => {

  occasionCounts[item.occasion] =
    item.count;

});

const trendText =
  totalCampaigns >= 10
    ? "Campaign activity is growing rapidly 🚀"
    : totalCampaigns >= 5
    ? "Campaign activity is steadily increasing 📈"
    : "Need more campaign data 📊";
  const COLORS = [
    "#ff7a18",
    "#7b2ff7",
    "#00c49f",
    "#0088fe",
    "#ffbb28",
    "#ff4f81"
  ];

  return (

    <div className="dashboard-container" style={{
    paddingLeft: "40px"
  }}>
        
      <h1 style={{
          marginLeft:"20px"
      }}>
        📊 Analytics Dashboard
      </h1>

      <div className="stats-grid">

        <div className="stat-card">
          <h2>{totalCampaigns}</h2>
          <p>Total Campaigns</p>
        </div>

        <div className="stat-card">
          <h2>{totalProducts}</h2>
          <p>Unique Products</p>
        </div>

        <div className="stat-card">
          <h2>{latestCampaign}</h2>
          <p>Latest Campaign</p>
        </div>

        <div className="stat-card">
          <h2>{lastCampaignTime}</h2>
          <p>Last Campaign Time</p>
        </div>

        <div className="stat-card">
          <h2>{topOccasion}</h2>
          <p>Top Occasion</p>
        </div>

        <div className="stat-card">
          <h2>{topProduct}</h2>
          <p>Top Product</p>
        </div>

        <div className="stat-card">
          <h2>
            {regenerationData.totalRegenerations}
          </h2>

          <p>
            Total Regenerations
          </p>
        </div>

        <div className="stat-card">
          <h2>
            {regenerationData.mostRegenerated}
          </h2>

          <p>
            Most Regenerated Platform
          </p>
        </div>

      </div>

      <div className="chart-grid">

        <div className="chart-card">

          <h2>
            🥧 Occasion Distribution
          </h2>

          <ResponsiveContainer
            width="100%"
            height={300}
          >

            <PieChart>

              <Pie
                data={chartData}
                dataKey="count"
                nameKey="occasion"
                outerRadius={100}
                label
              >

                {chartData.map(
                  (entry, index) => (

                    <Cell
                      key={index}
                      fill={
                        COLORS[
                          index %
                          COLORS.length
                        ]
                      }
                    />

                  )
                )}

              </Pie>

              <Tooltip />

            </PieChart>

          </ResponsiveContainer>

        </div>

        <div className="chart-card">

          <h2>
            📈 Campaign Count
          </h2>

          <ResponsiveContainer
            width="100%"
            height={300}
          >

            <BarChart
              data={chartData}
            >

              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="occasion"
              />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="count"
                fill="#7b2ff7"
              />

            </BarChart>

          </ResponsiveContainer>

        </div>
        <div className="chart-card">

          <h2>
            📈 Monthly Trend
          </h2>

          <ResponsiveContainer
            width="100%"
            height={300}
          >

          <BarChart data={monthlyData}>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="month" />

          <YAxis />

          <Tooltip />

          <Bar
            dataKey="count"
            fill="#ff7a18"
            radius={[8,8,0,0]}
          />

          </BarChart>

          </ResponsiveContainer>

        </div>

        <div className="chart-card">

          <h2>
            🔄 Regeneration Distribution
          </h2>

          <ResponsiveContainer
            width="100%"
            height={300}
          >

          <PieChart>

            <Pie
              data={regenerationData.chartData}
              dataKey="count"
              nameKey="platform"
              outerRadius={100}
              label
            >

          {
          regenerationData.chartData.map(
          (entry,index)=>(
          <Cell
          key={index}
          fill={
          COLORS[
          index %
          COLORS.length
          ]
          }
          />
          ))
          }

          </Pie>

          <Tooltip/>

          </PieChart>

          </ResponsiveContainer>

        </div>

      </div>
      <div className="insights-card">

  <h2>
    🤖 AI Business Insights
  </h2>

  <div className="insight-item">
    🔥 Most Popular Occasion:
    <strong> {topOccasion}</strong>
  </div>

  <div className="insight-item">
    🛍 Most Used Product:
    <strong> {topProduct}</strong>
  </div>

  <div className="insight-item">
    📈 Growth Trend:
    <strong> {trendText}</strong>
  </div>

</div>

      <div className="analytics-table">

        <h2>
          📅 Occasion Analytics
        </h2>

        <table>

          <thead>

            <tr>
              <th>Occasion</th>
              <th>Campaign Count</th>
            </tr>

          </thead>

          <tbody>

            {Object.entries(
              occasionCounts
            ).map(
              ([occasion, count]) => (

                <tr key={occasion}>
                  <td>{occasion}</td>
                  <td>{count}</td>
                </tr>

              )
            )}

          </tbody>

        </table>

      </div>
      <div className="analytics-table">

        <h2>
          🔄 Recent Regeneration Logs
        </h2>

        <table>

        <thead>

        <tr>
        <th>ID</th>
        <th>Launch ID</th>
        <th>Platform</th>
        </tr>

        </thead>

        <tbody>

        {
        regenerationData.recentLogs.map(
        (item)=>(
        <tr key={item.id}>
        <td>{item.id}</td>
        <td>{item.launch_id}</td>
        <td>{item.platform}</td>
        </tr>
        ))
        }

        </tbody>

        </table>

      </div>

      <div className="analytics-table">

        <h2>
          📜 Recent Campaigns
        </h2>

        <table>

          <thead>

            <tr>
              <th>Product</th>
              <th>Occasion</th>
              <th>Date</th>
            </tr>

          </thead>

          <tbody>

            {history.map(
              (item, index) => (

                <tr key={index}>
                  <td>{item.product}</td>
                  <td>{item.occasion}</td>
                  <td>
                    {new Date(item.date).toLocaleString("en-IN", {
                      timeZone: "Asia/Kolkata"
                    })}
                  </td>
                </tr>

              )
            )}

          </tbody>

        </table>

      </div>

    </div>

  );

}

export default Dashboard;