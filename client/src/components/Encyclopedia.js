const Encyclopedia = ( {ideas} ) => {
  return (
    <div width={'100%'}>
      <div className="row">
        <h1 className="header light-head">Encyclopedia</h1>
      </div>
      <div className="encyclopedia-container row">
      {ideas.map((idea) => (
        <div className="col-4">
          <Idea 
          key={idea.id}
          {...idea} />
        </div>
      ))}
    </div>
    </div>
  );
};

const Idea = ({ id, title, image, description, url }) => {
    return(
        <a href={url} target="_blank">
        <div className="encyclopedia-entry">
            <img src={image} alt={title} className="encyclopedia-image" />
            <p className="encyclopedia-entry-title">{title}</p>
        </div>
        </a>
    )
}

export default Encyclopedia;
