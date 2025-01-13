import Sidebar from "../../components/siderbar/Sidebar"
import Navbar from "../../components/navbar/Navbar"
import Widgets from "../../components/widgets/Widgets"
import Featured from "../../components/featured/Featured";
import Chart from "../../components/chart/Chart";
import List from "../../components/table/Table";
import "./home.scss"
const Home = () => {
  return (
    <div className="home">
        <Sidebar/>
        <div className=" homeContainer">
            <Navbar/>
            <div className="widgets">
              <Widgets type="user" />
              <Widgets type="order" />
              <Widgets type="product" /> 
            </div>
           <div className="charts">
              <Featured />
              <Chart/>
           </div>
           <div className="listContainer">
             <div className="listTitle">Pictures Uploaded</div>
             <List/>
           </div>
        </div>
    </div>
  )
}

export default Home