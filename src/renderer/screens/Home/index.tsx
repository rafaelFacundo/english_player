import React, { useContext } from "react";
import Header from "src/renderer/components/Header/index";
import "./index.css";
import Footer from "src/renderer/components/Footer";
import VideoOption from "src/renderer/components/videoOption";
import { AppContext } from "src/renderer/context/AppContext";

const Home: React.FC = () => {
  const { state } = useContext(AppContext);
  const listOfMovies = state.moviesData;

  return (
    <div id="container">
      <Header />
      <main id="home_main">
        {listOfMovies.length === 0 ? (
          <h2>No movie was found</h2>
        ) : (
          listOfMovies.map((movie) => <VideoOption movie={movie} />)
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Home;
