import React, { useEffect, useState } from 'react';
import { Bar, Doughnut, Pie } from 'react-chartjs-2';
import { Chart } from 'react-chartjs-2';
import { ArcElement, Tooltip, Legend } from 'chart.js';
import { CategoryScale, LinearScale } from 'chart.js';
import { getAllUsers, getAllMaterialRequester, getAllJobs } from '../../actions/userAction';
import { getProducts } from '../../actions/productaction';
import './MainData.css';

const MainData = () => {
  const [Workers, setWorkers] = useState([]);
  const [MaterialRequester, setMaterialRequester] = useState([]);
  const [Jobs, setJobs] = useState([]);
  const [Materials, setMaterials] = useState([]);

  useEffect(() => {
    Chart.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale);

    const fetchData = async () => {
      try {
        const usersResponse = await getAllUsers();
        setWorkers(usersResponse.users);

        const materialRequesterResponse = await getAllMaterialRequester();
        setMaterialRequester(materialRequesterResponse);

        const jobsResponse = await getAllJobs();
        setJobs(jobsResponse.data);

        const materialsResponse = await getProducts();
        setMaterials(materialsResponse.products);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  console.log('Jobs: => ', Jobs);
  console.log('Materials: => ', Materials);
  console.log('Workers: => ', Workers);
  console.log('MaterialRequester: =>', MaterialRequester);

  const workersBarChartData = {
    labels: Workers.map(worker => worker.name),
    datasets: [
      {
        label: 'Salary',
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        data: Workers.map(worker => worker.salary),
      },
    ],
  };
 
  const materialsBarChartData = {
    labels: Materials.map(material => material.name),
    datasets: [
      {
        label: 'Stock',
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
        data: Materials.map(material => material.stock),
      },
    ],
  };
  const usersDoughnutChartData = {
    labels: Materials.map(material => material.users.map(user => user.name).join(', ')),
    datasets: [
      {
        data: Materials.map(material => material.users.length),
        backgroundColor: ['rgba(255, 159, 64, 0.6)', 'rgba(75, 192, 192, 0.6)', 'rgba(255, 205, 86, 0.6)'],
        borderColor: ['rgba(255, 159, 64, 1)', 'rgba(75, 192, 192, 1)', 'rgba(255, 205, 86, 1)'],
        borderWidth: 1,
      },
    ],
  };
  
  const materialRequesterPieChartData = {
    labels: MaterialRequester.map(requester => requester.requesterName),
    datasets: [
      {
        data: MaterialRequester.map(requester => 1),
        backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(75, 192, 192, 0.6)', 'rgba(255, 205, 86, 0.6)'],
        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(75, 192, 192, 1)', 'rgba(255, 205, 86, 1)'],
        borderWidth: 1,
      },
    ],
  };

  const jobsBarChartData = {
    labels: Jobs.map(job => job.title),
    datasets: [
      {
        label: 'Counter',
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
        data: Jobs.map(job => job.counter),
      },
    ],
  };


  return (
    <>
      <div className="Chart-container">
        <div>
          <h3>Workers Chart</h3>
          <Bar data={workersBarChartData} />
        </div>

        <div>
          <h3>Materials Chart</h3>
          <Bar data={materialsBarChartData} />
        </div>

        <div>
          <h3>Users Chart</h3>
          <Doughnut data={usersDoughnutChartData} />
        </div>

        <div>
          <h3>Material Requester Chart</h3>
          <Pie data={materialRequesterPieChartData} />
        </div>

        <div>
          <h3>Jobs Chart</h3>
          <Bar data={jobsBarChartData} />
        </div>
        <div>
          <h3>Jobs Chart2..</h3>
          <Bar data={jobsBarChartData} />
        </div>
      </div>
    </>
  );
};

export default MainData;
