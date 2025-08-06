import { Outlet } from "react-router-dom";
import Header from "./Header/Header";

function Layout() {
  return (
    <>
      <Header />
      <main className="page">
        <Outlet />
      </main>
    </>
  );
}
export default Layout;
