import { useRef } from "react";
import HowItWorks from "../components/HowItWorks";
import InsuranceLandingPage from "../components/InsuranceLandingPage";
import InsuranceDiscovery from "./Insurance";
import Footer from "../components/footer";

export const Home = () => {
  // Create a ref for the Insurance Discovery section
  const insuranceDiscoveryRef = useRef(null);
  
  // Function to scroll to the Insurance Discovery section
  const scrollToDiscovery = () => {
    insuranceDiscoveryRef.current?.scrollIntoView({ 
      behavior: "smooth",
      block: "start"
    });
  };
  
  return (
    <div>
      {/* Pass the scroll function to the landing page */}
      <InsuranceLandingPage scrollToDiscovery={scrollToDiscovery} />
      <HowItWorks />
      {/* Attach the ref to the Insurance Discovery section */}
      <div ref={insuranceDiscoveryRef}>
        <InsuranceDiscovery />
      </div>
      <Footer/>
    </div>
  );
};

export default Home;