import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/HomePage.css"; // Ensure you have this CSS file

const HomePage = () => {
  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero-section text-white text-center d-flex align-items-center justify-content-center">
        <div>
          <h1>Welcome to CrowdfundX</h1>
          <p>Support projects that matter to you.</p>
          <button className="btn btn-warning btn-lg">Explore Campaigns</button>
        </div>
      </section>

      {/* Categories */}
      <section className="categories text-center py-5">
        <h2 className="mb-4">Discover Categories</h2>
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <div className="category-box bg-danger text-white">Tech</div>
            </div>
            <div className="col-md-4">
              <div className="category-box bg-success text-white">Education</div>
            </div>
            <div className="col-md-4">
              <div className="category-box bg-primary text-white">Health</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="featured py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-4">Featured Projects</h2>
          <div className="row">
            <div className="col-md-4">
              <div className="card">
                <img src="https://source.unsplash.com/300x200/?startup" alt="Project 1" className="card-img-top" />
                <div className="card-body">
                  <h5 className="card-title">Innovative Tech Project</h5>
                  <p className="card-text">Help fund the next big innovation.</p>
                  <button className="btn btn-primary">Support</button>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card">
                <img src="https://source.unsplash.com/300x200/?education" alt="Project 2" className="card-img-top" />
                <div className="card-body">
                  <h5 className="card-title">Education for All</h5>
                  <p className="card-text">Support underprivileged students.</p>
                  <button className="btn btn-primary">Support</button>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card">
                <img src="https://source.unsplash.com/300x200/?medical" alt="Project 3" className="card-img-top" />
                <div className="card-body">
                  <h5 className="card-title">Healthcare Initiative</h5>
                  <p className="card-text">Fund life-saving treatments.</p>
                  <button className="btn btn-primary">Support</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
