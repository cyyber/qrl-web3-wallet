import { Outlet } from "react-router-dom";

const Body = () => {
  return (
    <div className="relative mt-16 w-[23rem]">
      <Outlet />
    </div>
  );
};

export default Body;
