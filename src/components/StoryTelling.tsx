import { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

import "./StoryTelling.css";

gsap.registerPlugin(ScrollTrigger);

export default function StoryTelling() {
    const container = useRef(null);

    const { scrollYProgress } = useScroll({
        target: container,
        offset: ["start start", "end end"]
    });

    // Define different scale motion values for each image
    const scale1 = useTransform(scrollYProgress, [0, 1], [1, 2]);
    const scale2 = useTransform(scrollYProgress, [0, 1], [1, 2]);

    const pictures = [
        { src: "/Guro.jpeg", scale: scale1, className: "image1" },
        { src: "/ManInHanbok.jpeg", scale: scale2, className: "image2" }
    ];

    return (
        <div ref={container} className="container">
            <div className="sticky">
                {pictures.map(({ src, scale, className }, index) => (
                    <div key={index} className={`el ${className}`}>
                        <div className="imageContainer">
                            <motion.img src={src} alt="" style={{ scale }} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}


