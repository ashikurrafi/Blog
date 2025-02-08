import MainLayout from "../../components/MainLayout";
import Articles from "./container/Articles";
import Hero from "./container/Hero";

const HomePage = () => {
  return (
    <>
      <MainLayout>
        <Hero />
        <Articles />
      </MainLayout>
    </>
  );
};

export default HomePage;
