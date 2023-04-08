
const HeroesListItem = ({name, description, element, onDelete}) => {

    let elementClassName;

    switch (element) {
        case 'fire':
            elementClassName = 'bg-danger bg-gradient';
            break;
        case 'water':
            elementClassName = 'bg-primary bg-gradient';
            break;
        case 'wind':
            elementClassName = 'bg-success bg-gradient';
            break;
        case 'earth':
            elementClassName = 'bg-secondary bg-gradient';
            break;
        default:
            elementClassName = 'bg-warning bg-gradient';
    }

    return (
        <li 
            className={`card flex-row mb-4 shadow-lg text-white ${elementClassName}`}>
            <img src="data:image/png;base64,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"
                 className="img-fluid w-25 d-inline" 
                 alt="unknown hero" 
                 style={{'objectFit': 'cover'}}/>
            <div className="card-body">
                
                <h3 className="card-title">{name}</h3>
                <p className="card-text">{description}</p>
            </div>
            <span onClick={onDelete} 
                className="position-absolute top-0 start-100 translate-middle badge border rounded-pill bg-light">
                <button type="button" className="btn-close btn-close" aria-label="Close"></button>
            </span>
        </li>
    )
}

export default HeroesListItem;