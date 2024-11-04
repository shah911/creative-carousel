"use client";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import img1 from "../../public/img-1.jpg";
import img2 from "../../public/img-2.jpg";
import img3 from "../../public/img-3.jpg";
import img4 from "../../public/img-4.jpg";
import img5 from "../../public/img-5.jpg";
import img6 from "../../public/img-6.jpg";
import { AnimateTextByWord } from "./Animate";

const data = [
  {
    title: "Albert Einstein",
    desc: "Life is like riding a bicycle. To keep your balance, you must keep moving.",
    url: img1,
  },
  {
    title: "Oscar Wilde",
    desc: "Be yourself, everyone else is already taken.",
    url: img2,
  },
  {
    title: "Maya Angelou",
    desc: "You will face many defeats in life, but never let yourself be defeated.",
    url: img3,
  },
  {
    title: "Mark Twain",
    desc: "The secret of getting ahead is getting started.",
    url: img4,
  },
  {
    title: "Nelson Mandela",
    desc: "It always seems impossible until it's done.",
    url: img5,
  },
  {
    title: "Friedrich Nietzsche",
    desc: "He who has a why to live can bear almost any how.",
    url: img6,
  },
];

const bar = {
  initial: ([visible, remainingTime]: [boolean, number]) => ({
    clipPath: visible
      ? "inset(0 100% 0 0)"
      : `inset(0 ${Math.floor(remainingTime / 6000) * 100}% 0 0)`,
  }),
  animate: {
    clipPath: "inset(0 0 0 0)",
    transition: {
      duration: 6,
    },
  },
  exit: {
    clipPath: "inset(0 0 0 100%)",
    transition: {
      duration: 1,
    },
  },
};

const variants = {
  initial: (direction: string) => ({
    clipPath: direction === "next" ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)",
    scale: 2,
    rotate: direction === "next" ? 10 : -10,
  }),
  animate: {
    clipPath: "inset(0 0 0 0)",
    scale: 1,
    rotate: 0,
    transition: {
      duration: 1.5,
      ease: [0.645, 0.075, 0.275, 0.995],
    },
  },
  exit: (direction: string) => ({
    scale: 2,
    rotate: direction === "next" ? -10 : 10,
    transition: {
      duration: 1.5,
      ease: [0.645, 0.075, 0.275, 0.995],
    },
  }),
};

function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState("next");
  const [isAnimating, setIsAnimating] = useState(false);
  const [visible, setVisible] = useState(true);
  const [remainingTime, setRemainingTime] = useState(6000);
  const pauseTimestamp = useRef<number>(0);
  const intervalId = useRef<NodeJS.Timeout | undefined>();

  const handlePrev = () => {
    if (!isAnimating) {
      setDirection("prev");
      setIsAnimating(true);
      setCurrentIndex((prev) => (prev <= 0 ? data.length - 1 : prev - 1));
    }
  };

  const handleNext = () => {
    if (!isAnimating) {
      setDirection("next");
      setIsAnimating(true);
      setCurrentIndex((prev) => (prev >= data.length - 1 ? 0 : prev + 1));
    }
  };

  const handleAnimationComplete = () => {
    setIsAnimating(false);
  };

  useEffect(() => {
    if (!visible) return;

    intervalId.current = setInterval(() => {
      setDirection("next");
      setCurrentIndex((prevIndex) => (prevIndex + 1) % data.length);
      setRemainingTime(6000); // Reset remaining time after each slide change
    }, remainingTime);

    return () => clearInterval(intervalId.current);
  }, [visible, remainingTime, currentIndex]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState !== "visible") {
        // Save the remaining time when user switches away
        clearInterval(intervalId.current);
        pauseTimestamp.current = Date.now();
        setRemainingTime(
          (prev) => prev - (Date.now() - pauseTimestamp.current)
        );
        setVisible(false);
      } else {
        // Calculate remaining time and set a timeout to resume where it left off
        setVisible(true);
        const timeSincePause = Date.now() - pauseTimestamp.current;
        if (remainingTime - timeSincePause > 0) {
          setRemainingTime(remainingTime - timeSincePause);
        } else {
          // Set interval if it needs to continue from a fresh cycle
          setCurrentIndex((prevIndex) => (prevIndex + 1) % data.length);
          setRemainingTime(6000); // Reset back to original interval time
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearInterval(intervalId.current);
    };
  }, [remainingTime]);

  return (
    <>
      <div className="relative min-h-[600px] h-screen overflow-hidden bg-black">
        <div className="z-20 py-10 w-full absolute top-[10%] left-1/2 -translate-x-1/2 flex items-center justify-center gap-4">
          {data.map((_, i: number) => (
            <div
              onClick={() => {
                if (!isAnimating) {
                  setIsAnimating(true);
                  setCurrentIndex(i);
                }
              }}
              key={i}
              className="h-[1px] w-[10%] lg:w-[5%] bg-[#797979] z-20 cursor-pointer"
            >
              <AnimatePresence mode="sync">
                {currentIndex === i && (
                  <motion.div
                    variants={bar}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="bg-white w-full h-full"
                    custom={[visible, remainingTime]}
                  ></motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
        <div className="absolute top-0 left-0 h-full w-full flex z-10">
          <div
            onClick={handlePrev}
            className="flex-[1] h-full cursor-pointer"
          ></div>
          <div
            onClick={handleNext}
            className="flex-[1] h-full cursor-pointer"
          ></div>
        </div>
        {data.map((item, i) => (
          <div
            key={i}
            className="absolute top-0 left-0 h-full w-full bg-black -z-10 hidden"
          >
            <Image
              src={item.url}
              alt={item.title}
              placeholder="blur"
              priority={true}
              fill
              className="object-cover"
            />
          </div>
        ))}
        <AnimatePresence initial={false} custom={direction} mode="sync">
          {data.map(
            (item, i) =>
              i === currentIndex && (
                <motion.div
                  key={i}
                  className="absolute top-0 left-0 h-full w-full"
                  variants={variants}
                  custom={direction}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  onAnimationComplete={handleAnimationComplete}
                >
                  <Image
                    src={item.url}
                    alt={item.title}
                    placeholder="blur"
                    priority={true}
                    fill
                    className="object-cover brightness-75"
                  />
                  <motion.div
                    exit={{
                      opacity: 0,
                    }}
                    className="z-30 w-[90%] md:w-[50%] absolute top-1/2 text-white left-1/2 -translate-x-1/2"
                  >
                    <p className="capitalize overflow-hidden flex flex-wrap gap-1 text-xl md:text-2xl font-semibold">
                      <AnimateTextByWord pharse={item.desc} />
                    </p>
                    <h3 className="md:text-lg text-right uppercase mt-4">
                      {item.title}
                    </h3>
                  </motion.div>
                </motion.div>
              )
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

export default Carousel;
