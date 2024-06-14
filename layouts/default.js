//import component Navbar
import Navbar from "../components/navbar.jsx";
import Footer from "../components/footer.jsx";

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      {/* <Footer /> */}
    </>
  );
}
