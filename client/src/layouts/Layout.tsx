import "./Layout.scss";
import Navbar from "../components/navbar/Navbar";

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <div>
      <Navbar />
      <div className="Layout__container">{children}</div>
    </div>
  );
};

export default Layout;
