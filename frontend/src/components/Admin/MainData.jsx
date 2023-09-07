import React, { useEffect, useState } from 'react';
import { Bar, Doughnut, Pie } from 'react-chartjs-2';
import { Chart } from 'react-chartjs-2';
import { ArcElement, Tooltip, Legend } from 'chart.js';
import { CategoryScale, LinearScale } from 'chart.js';
import { getAllUsers, getAllMaterialRequester, getAllJobs, fetchTasks } from '../../actions/userAction';
import { getProducts } from '../../actions/productaction';
import './MainData.css'
import { formatDate } from '../../utils/DateFormat';


const MainData = () => {
  const [Workers, setWorkers] = useState([]);
  const [MaterialRequester, setMaterialRequester] = useState([]);
  const [Jobs, setJobs] = useState([]);
  const [Materials, setMaterials] = useState([]);
  const [Tasks, setTasks] = useState([]);

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

        const tasksResponse = await fetchTasks();
        console.log(tasksResponse.data)
        setTasks(tasksResponse.data); 


      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

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
        label: 'Applied Job',
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
        data: Jobs.map(job => job.counter),
      },
    ],
  };

const getStatusValue = status => {
  switch (status) {
    case 'pending':
      return 1;
    case 'in progress':
      return 2;
    case 'completed':
      return 3;
    default:
      return 0;
  }
};
  
const taskLabels = Tasks.map(task => `${formatDate(task.createdAt)}`);

const tasksBarChartData = {
  labels: taskLabels,
  datasets: [
    {
      label: 'Tasks',
      backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)', 'rgba(153, 102, 255, 0.6)'],
      borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)', 'rgba(153, 102, 255, 1)'],
      borderWidth: 1,
      data: Tasks.map(task => getStatusValue(task.status)),
    },
  ],
};

const options = {
  maintainAspectRatio: false, 
  responsive: true, 
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1,
      },
    },
  },
  plugins: {
    legend: {
      display: true,
      position: 'top',    },
    datalabels: {
      align: 'bottom',
      anchor: 'end',
      formatter: value => value,
      color: '#333',
      font: {
        weight: 'normal',
        size: 5, 
      },
    },
    tooltip: {
      enabled: true,
      callbacks: {
        label: context => {
          const task = Tasks[context.dataIndex];
          return  `Task: ${task.title}   Status: ${task.status}`;
        },
      },
    },
  },
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
        <div className="Chart">
    <h3>Tasks Chart</h3>
    <Bar data={tasksBarChartData} options={options} />
  </div>
      </div>
    </>
  );

};


export default MainData;


