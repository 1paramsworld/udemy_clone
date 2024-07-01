export default function Jumbotron({title,description="this is description"}){
    return <div className="container-fluid jumbotron">
        <div className="row">
            <div className="col text-center p-5 ">
                <h1 className="fw-bold text-body">{title}</h1>
                <p className="lead">{description}</p>
            </div>
            
        </div>
    </div>
}   