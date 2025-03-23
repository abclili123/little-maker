import { motion, useMotionValue, useTransform } from "framer-motion";

const Ideas = ({ ideas, setIdeas, onClose, addToEncyclopedia }) => {
  return (
    <div 
      className="ideas-container"
      style={{
        position: "absolute",  // Position it relative to .left-content
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)", // Center it
        display: "grid",
        placeItems: "center",
        width: "100%", 
        height: "100%",
        pointerEvents: "auto", // Ensure interactions work
      }}
    >
      {ideas.map((idea) => (
        <Idea 
        key={idea.id} 
        ideas={ideas} 
        setIdeas={setIdeas} 
        onClose={onClose}
        addToEncyclopedia={addToEncyclopedia}
        {...idea} />
      ))}
    </div>
  );
};

const Idea = ({ id, title, image, description, ideas, setIdeas, onClose, addToEncyclopedia }) => {
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
      if (x.get() > 0) {
        addToEncyclopedia({ id, title, image, description });
      }

      setIdeas((prev) => {
        const updatedIdeas = prev.filter((idea) => idea.id !== id);
        if (updatedIdeas.length === 0) {
          onClose();
        }
        return updatedIdeas;
      });
    }
  };

  return (
    <motion.div
      className="idea-card"
      style={{
        zIndex: id,
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
      animate={{ scale: isFront ? 1 : 0.98 }}
      drag={isFront ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
    >
      <img src={image} alt={title} className="card-image" />
      <div className="card-content">
        <h2 className="card-title">{title}</h2>
        <p className="card-description">{description}</p>
      </div>
    </motion.div>
  );
};

export default Ideas;