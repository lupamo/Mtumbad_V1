import React from "react";
import Hero from "../components/Hero";
import LatestCollection from "../components/LatestCollection";
import BestSelling from "../components/BestSelling";
import OurPolicy from "../components/OurPolicy";


const Home = () => {
	return (
		<div>
			<Hero />
			<LatestCollection />
			<BestSelling />
			<OurPolicy />
		</div>
	);
}

export default Home;