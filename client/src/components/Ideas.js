import React, { useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

const Ideas = (ideasData) => {
  const [ideas, setIdeas] = useState(ideasData);

  return (
    <div>
      {ideas.map((idea) => {
        return (
          <Idea key={idea.id} ideas={ideas} setIdeas={setIdeas} {...idea} />
        );
      })}
    </div>
  );
};

const Idea = ({ id, url, setIdeas, ideas }) => {
  const x = useMotionValue(0);

  const rotateRaw = useTransform(x, [-150, 150], [-18, 18]);
  const opacity = useTransform(x, [-150, 0, 150], [0, 1, 0]);

  const isFront = id === ideas[ideas.length - 1].id;

  const rotate = useTransform(() => {
    const offset = isFront ? 0 : id % 2 ? 6 : -6;

    return `${rotateRaw.get() + offset}deg`;
  });

  const handleDragEnd = () => {
    if (Math.abs(x.get()) > 100) {
        setIdeas((pv) => pv.filter((v) => v.id !== id));
    }
  };

  return (
    <motion.div
      alt="Placeholder alt"
      className="h-96 w-72 origin-bottom rounded-lg bg-white object-cover hover:cursor-grab active:cursor-grabbing"
      style={{
        gridRow: 1,
        gridColumn: 1,
        x,
        opacity,
        rotate,
        transition: "0.125s transform",
        boxShadow: isFront
          ? "0 20px 25px -5px rgb(0 0 0 / 0.5), 0 8px 10px -6px rgb(0 0 0 / 0.5)"
          : undefined,
      }}
      animate={{
        scale: isFront ? 1 : 0.98,
      }}
      drag={isFront ? "x" : false}
      dragConstraints={{
        left: 0,
        right: 0,
      }}
      onDragEnd={handleDragEnd}
    />
  );
};

export default Ideas;