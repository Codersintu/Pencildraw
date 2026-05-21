import { About } from "./About";
import { Bottom } from "./Bottom";
import Feature from "./Feature";
import Hero from "./Hero";
import Navbar from "./Navbar";

export default function HomePage(){

    return(
        <div className="">
            <Navbar/>
            <Hero/>
            <Feature/>
            <About/>
            <Bottom/>
        </div>
    )
}