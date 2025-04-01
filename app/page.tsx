
import Image from "next/image";
import styles from "./page.module.css";
import Hero from "@/components/Hero";
import FeaturedJobs from "@/components/FeaturedJobs"
// import { useEffect, useState } from "react";
export default function Home() {
  return (
   <div>
    <Hero />
    <FeaturedJobs/>
   </div>
  );
}
