import "./sidebar.scss"
import DashboardIcon from '@mui/icons-material/Dashboard';
import Man4OutlinedIcon from '@mui/icons-material/Man4Outlined';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="sidebar">
        <div className="top">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">Textile PLM Admin</span>
        </Link>

        </div>
        <hr/>
        <div className="center"> 
          <ul>
            <p className="title">Main</p>
            <Link to="/" style={{ textDecoration: "none" }}>
            <li>
                <DashboardIcon/>
                <span>Dashboard</span>
            </li>
            </Link>
            <p className="title">Lists</p>
            <Link to="/order" style={{ textDecoration: "none" }}>
            <li>
                <ProductionQuantityLimitsIcon/>
                <span>Orders</span>
            </li>
            </Link>
            <Link to="/customers" style={{ textDecoration: "none" }}>
            <li>
              <Man4OutlinedIcon />
              <span>Customers</span>
            </li>
          </Link>
          <Link to="/products" style={{ textDecoration: "none" }}>
            <li>
              <StorefrontIcon />
              <span>Products</span>
            </li>
          </Link>
            <p className="title">Alerts</p>
          <Link to="/alerts" style={{ textDecoration: "none" }}>
            <li>
                <CircleNotificationsIcon/>
                <span>Notifications</span>
            </li>
          </Link>
            <p className="title">User</p>
            <Link to="/alerts" style={{ textDecoration: "none" }}>
            <li>
                <AccountCircleIcon/>
                <span>Profile</span>
            </li>
            </Link>
            <Link to="/login" style={{ textDecoration: "none" }}>
            <li>
                <LogoutIcon/>
                <span>Logout</span>
            </li>
            </Link>
          </ul>
        </div>
        
    </div>
  )
}

export default Sidebar