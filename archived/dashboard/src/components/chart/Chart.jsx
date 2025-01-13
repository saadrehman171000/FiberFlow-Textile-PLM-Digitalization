import "./chart.scss"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
const data = [
    { name: "Monday", Progress: 0 },
    { name: "Tuesday", Progress: 10 },
    { name: "Wed", Progress: 60 },
    { name: "Thursday", Progress: 40 },
    { name: "Friday", Progress: 80 },
    { name: "Saturday", Progress: 90 },
    { name: "Sunday", Progress: 100 },
  ];
  
const Chart = () => {
  return (
    <div className='charts'>
        <div className="title">Last Week Orders</div>
        <ResponsiveContainer width="100%" height="100%">
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" className="chartGrid" />
          <XAxis dataKey="name" />
          <YAxis dataKey="Progress" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Progress" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
        
    </div>
  )
}

export default Chart