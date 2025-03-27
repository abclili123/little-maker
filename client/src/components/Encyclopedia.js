const Encyclopedia = ( {ideas} ) => {
  return (
    <div width={'100%'}>
      <h1 className="header light-head">Encyclopedia</h1>
      <div className="encyclopedia-container">
      {ideas.map((idea) => (
        <Idea 
        key={idea.id}
        {...idea} />
      ))}
    </div>
    </div>
  );
};

const Idea = ({ id, title, image, description }) => {
    return(
        <div className="encyclopedia-entry">
            <img src={image} alt={title} className="encyclopedia-image" />
            <p className="encyclopedia-entry-title">{title}</p>
        </div>
    )
}

export default Encyclopedia;
