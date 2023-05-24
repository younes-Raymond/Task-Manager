import React from "react";
import "./aboutUs.css";

const AboutUs = () => {

  function toggleVideo() {
    var videoFrame = document.getElementById("videoFrame");
    if (videoFrame.style.display === "none") {
      videoFrame.style.display = "block";
    } else {
      videoFrame.style.display = "none";
    }
  }
  return (
    <div className="containerrr">
      <main>
        <div className="intro">
        <h1 className="text-dark">Hello world, we are AllMarT:</h1>
          <h2 className="text-dark">How to use this app?</h2>
        </div>
        <article>
          <section>
            <h3>How to use Add material + </h3>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Blanditiis, dolorum maiores magni aperiam harum vitae, odio minima
              ad obcaecati perspiciatis aliquam rerum consectetur suscipit quo
              modi, eius ducimus eligendi sit.
            </p>
          </section>
          <section>
            <h3>How to use see material</h3>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Blanditiis, dolorum maiores magni aperiam harum vitae, odio minima
              ad obcaecati perspiciatis aliquam rerum consectetur suscipit quo
              modi, eius ducimus eligendi sit.
            </p>
          </section>
          
          <section onClick={toggleVideo}>
            <h3>Video</h3>
            <div className="embed-responsive embed-responsive-16by9">
              <iframe title="explainig uses app for"
                className="embed-responsive-item"
                src="https://www.youtube.com/embed/Jd2GK0qDtRg"
                allowFullScreen
                autoplay
                muted
              ></iframe>
            </div>
          </section>

          
          <section>
            <h3>Contact Us</h3>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Blanditiis, dolorum maiores magni aperiam harum vitae, odio minima
              ad obcaecati perspiciatis aliquam rerum consectetur suscipit quo
              modi, eius ducimus eligendi sit.
            </p>
            <a href="www.google.com">Younes_Dev</a>
          </section>
        </article>
      </main>
    </div>
  );
};

export default AboutUs;
