import Navbar from "../../components/navbar/Navbar"
import OrderTable from "../../components/ordertable/OrderTable"
import Sidebar from "../../components/siderbar/Sidebar"
import "./list.scss"

const List = () => {
  return (
    <div className="list">
      <Sidebar/>
      <div className="listContainer">
        <Navbar/>
        <OrderTable/>
      </div>
    </div>
  )
}

export default List