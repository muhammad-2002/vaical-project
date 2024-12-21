import React from "react";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="flex justify-center items-center my-10">
      <Outlet></Outlet>
    </div>
  );
};

export default MainLayout;
