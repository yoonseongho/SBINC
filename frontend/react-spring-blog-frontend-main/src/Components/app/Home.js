import React from "react";
import "../../css/Home.css";

function Home() {
    return (
        <div className="container mt-5">
            <div className="jumbotron">
                <img className="logo" src={process.env.PUBLIC_URL + '/images/Companylogo.png'} alt="회사 로고" />
            </div>
        </div>
    );
}

export default Home;