import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import Resetpassword from "./pages/Login/Resetpassword";
import Forgotpassword from "./pages/Login/Forgotpassword";
import MainLayout from "./components/MainLayout";
import Dashboard from "./pages/Dashboard/Dashboard";
import Bloglist from "./pages/Blog/Bloglist";
import Blogcatlist from "./pages/BlogCat/Blogcatlist";
import Orderslist from "./pages/Order/Orderslist";
import Orderdetails from "./pages/Order/Orderdetails";
import Customerslist from "./pages/Customer/Customerslist";
import CustomerDetail from "./pages/Customer/Customerdetail";
import Productlist from "./pages/Product/Productlist";
import Brandlist from "./pages/Brand/Brandlist";
import Categorylist from "./pages/Category/Categorylist";
import Addblog from "./pages/Blog/Addblog";
import Addblogcat from "./pages/BlogCat/Addblogcat";
import Addcat from "./pages/Category/Addcat";
import Addbrand from "./pages/Brand/Addbrand";
import Addproduct from "./pages/Product/Addproduct";
import EditProduct from "./pages/Product/EditProduct";
import EditCategory from "./pages/Category/EditCategory";
import EditBrand from "./pages/Brand/EditBrand";
import EditBlog from "./pages/Blog/EditBlog";
import Editblogcat from "./pages/BlogCat/Editblogcat";
import Productdetails from "./pages/Product/Productdetails";
import BlogDetails from "./pages/Blog/BlogDetails";
import EmployeeList from "./pages/Employee/Employeelist";
import EditEmployee from "./pages/Employee/EditEmployee";
import AddEmployee from "./pages/Employee/Addemployee";
import EmployeeDetails from "./pages/Employee/Employeedetails";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import Policy from "./pages/Policy/Policies";
import EditCustomer from "./pages/Customer/EditCustomer";
import EditContact from "./pages/Contact/Editcontact";
import AddPolicy from "./pages/Policy/Addpolicy";
import EditPolicy from "./pages/Policy/Editpolicy";
import EditAbout from "./pages/About/Editabout";
import Conditionlist from "./pages/Condition/Conditionlist";
import Addcondition from "./pages/Condition/AddCondition";
import EditCondition from "./pages/Condition/EditCondition";
import Taglist from "./pages/Tag/Taglist";
import Addtag from "./pages/Tag/AddTag";
import EditTag from "./pages/Tag/EditTag";
import AdvertisementList from "./pages/Advertisement/Advertisementlist";
import AddAdvertisement from "./pages/Advertisement/AddAdvertisement";
import EditAdvertisement from "./pages/Advertisement/EditAdvertisement";
import Couponlist from "./pages/Coupon/Couponlist";
import AddCoupon from "./pages/Coupon/Addcoupon";
import EditCoupon from "./pages/Coupon/EditCoupon";

function App() {
  return (
    <Router>
      <Routes>
        {/* LOGIN */}
        <Route path="/" element={<Login />} />
        <Route
          path="/reset-password/:type/:token"
          element={<Resetpassword />}
        />
        <Route path="/forgot-password" element={<Forgotpassword />} />

        <Route path="/admin" element={<MainLayout />}>
          {/* MainLayout */}
          <Route index element={<Dashboard />} />

          {/* Customer */}
          <Route path="customers-list" element={<Customerslist />} />
          <Route path="customer-detail/:id" element={<CustomerDetail />} />
          <Route path="edit-customer/:id" element={<EditCustomer />} />

          {/* Employee */}
          <Route path="employee-list" element={<EmployeeList />} />
          <Route path="edit-employee/:id" element={<EditEmployee />} />
          <Route path="add-employee" element={<AddEmployee />} />
          <Route path="employee-detail/:id" element={<EmployeeDetails />} />

          {/* Product */}
          <Route path="product-list" element={<Productlist />} />
          <Route path="add-product" element={<Addproduct />} />
          <Route path="edit-product/:id" element={<EditProduct />} />
          <Route
            path="product-detail/:productName"
            element={<Productdetails />}
          />

          {/* Brand */}
          <Route path="brand-list" element={<Brandlist />} />
          <Route path="add-brand" element={<Addbrand />} />
          <Route path="edit-brand/:brandName" element={<EditBrand />} />

          {/* Category */}
          <Route path="category-list" element={<Categorylist />} />
          <Route path="add-category" element={<Addcat />} />
          <Route path="edit-category/:cateName" element={<EditCategory />} />

          {/* Tag */}
          <Route path="tag-list" element={<Taglist />} />
          <Route path="add-tag" element={<Addtag />} />
          <Route path="edit-tag/:name" element={<EditTag />} />

          {/* Condition */}
          <Route path="condition-list" element={<Conditionlist />} />
          <Route path="add-condition" element={<Addcondition />} />
          <Route
            path="edit-condition/:conditionName"
            element={<EditCondition />}
          />

          {/* Coupon */}
          <Route path="coupon-list" element={<Couponlist />} />
          <Route path="add-coupon" element={<AddCoupon />} />
          <Route path="edit-coupon/:id" element={<EditCoupon />} />

          {/* Order */}
          <Route path="orders-list" element={<Orderslist />} />
          <Route path="order-details/:id" element={<Orderdetails />} />

          {/* Blog */}
          <Route path="add-blog" element={<Addblog />} />
          <Route path="blog-list" element={<Bloglist />} />
          <Route path="edit-blog/:id" element={<EditBlog />} />
          <Route path="blog-detail/:id" element={<BlogDetails />} />

          {/* Blog Category */}
          <Route path="blog-category-list" element={<Blogcatlist />} />
          <Route path="add-blog-category" element={<Addblogcat />} />
          <Route path="edit-blog-cat/:id" element={<Editblogcat />} />

          {/* About */}
          <Route path="about" element={<About />} />
          <Route path="edit-about/:id" element={<EditAbout />} />

          {/* Contact */}
          <Route path="contact" element={<Contact />} />
          <Route path="edit-contact/:id" element={<EditContact />} />

          {/* Policy */}
          <Route path="policies" element={<Policy />} />
          <Route path="add-policy" element={<AddPolicy />} />
          <Route path="edit-policy/:id" element={<EditPolicy />} />

          {/* Advertisement */}
          <Route path="advertisement-list" element={<AdvertisementList />} />
          <Route path="add-advertisement" element={<AddAdvertisement />} />
          <Route
            path="edit-advertisement/:id"
            element={<EditAdvertisement />}
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
