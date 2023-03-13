import { ChangeEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ITutorialData from "../@types/Tutorial";
import TutorialService from "../services/TutorialService";

function TutorialsList() {
  const [tutorials, setTutorials] = useState<Array<ITutorialData>>([]);
  const [currentTutorial, setCurrentTutorial] = useState<ITutorialData | null>(
    null
  );
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [searchTitle, setSearchTitle] = useState<string>("");

  const retrieveTutorials = async (search: string) => {
    try {
      let response = await TutorialService.getAll(search);
      setTutorials(response.data);
      console.log(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    retrieveTutorials(searchTitle);
  }, [searchTitle]);

  const onChangeSearchTitle = (e: ChangeEvent<HTMLInputElement>) => {
    const searchTitle = e.target.value;
    setSearchTitle(searchTitle);
  };

  const refreshList = () => {
    retrieveTutorials('');
    setCurrentTutorial(null);
    setCurrentIndex(-1);
  };

  const setActiveTutorial = (tutorial: ITutorialData, index: number) => {
    setCurrentTutorial(tutorial);
    setCurrentIndex(index);
  };

  const removeAllTutorials = async () => {
    try {
      let response = await TutorialService.removeAll();
      console.log(response.data);
      refreshList();
    } catch (e) {
      console.log(e);
    }
  };

  const findByTitle = async () => {
    try {
      let response = await TutorialService.findByTitle(searchTitle);
      setTutorials(response.data);
      setCurrentTutorial(null);
      setCurrentIndex(-1);
      console.log(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <div className="list row">
        <div className="col-md-8">
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search by title"
              value={searchTitle}
              onChange={onChangeSearchTitle}
            />
            <div className="input-group-append">
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={findByTitle}
              >
                Search
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <h4>Tutorials List</h4>

          <ol className="list-group">
            {tutorials &&
              tutorials.map((tutorial, index) => (
                <li
                  className={
                    "list-group-item " +
                    (index === currentIndex ? "active" : "")
                  }
                  onClick={() => setActiveTutorial(tutorial, index)}
                  key={index}
                >
                  {tutorial.title}
                </li>
              ))}
          </ol>

          <button
            className="m-3 btn btn-sm btn-danger"
            onClick={removeAllTutorials}
          >
            Remove All
          </button>
        </div>
        <div className="col-md-6">
          {currentTutorial ? (
            <div>
              <h4>Tutorial</h4>
              <div>
                <label>
                  <strong>Title:</strong>
                </label>{" "}
                {currentTutorial.title}
              </div>
              <div>
                <label>
                  <strong>Description:</strong>
                </label>{" "}
                {currentTutorial.description}
              </div>
              <div>
                <label>
                  <strong>Status:</strong>
                </label>{" "}
                {currentTutorial.published ? "Published" : "Pending"}
              </div>

              <Link
                to={"/tutorials/" + currentTutorial.id}
                className="badge badge-warning"
              >
                Edit
              </Link>
            </div>
          ) : (
            <div>
              <br />
              <p>Please click on a Tutorial...</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default TutorialsList;
