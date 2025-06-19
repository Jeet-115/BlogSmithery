import { useSelector } from "react-redux";

const AdminHome = () => {
  const { token } = useSelector((state) => state.auth);


  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-[#007ea7] to-[#00c2cb]">
        Welcome, Admin!
      </h1>
    </div>
  );
};

export default AdminHome;
