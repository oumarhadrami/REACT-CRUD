import React, { useState, useEffect, ChangeEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ITutorialData from "../@types/Tutorial";
import TutorialService from "../services/TutorialService";

function OneTutorial() {
  const { id } = useParams();
  let navigate = useNavigate();
  const [currentTutorial, setCurrentTutorial] = useState<ITutorialData>({
    id: null,
    title: "",
    description: "",
    published: false,
  });
  const [message, setMessage] = useState<string>("");

  const getTutorial = async (id: string) => {
    try {
      let response = await TutorialService.get(id);
      setCurrentTutorial(response.data);
      console.log(response.data);
      await delay(4000);
    } catch (e) {
      console.log(e);
    }
  };

  function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  useEffect(() => {
    if (id) getTutorial(id);
    console.log(id);
  }, [id]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setCurrentTutorial({ ...currentTutorial, [name]: value });
  };

  const updatePublished = async (status: boolean) => {
    var data = {
      id: currentTutorial.id,
      title: currentTutorial.title,
      description: currentTutorial.description,
      published: status,
    };

    try {
      let response = await TutorialService.update(currentTutorial.id, data);
      console.log(response.data);
      setCurrentTutorial({ ...currentTutorial, published: status });
      setMessage("The status was updated successfully!");
    } catch (e) {
      console.log(e);
    }
  };

  const updateTutorial = async () => {
    try {
      let response = await TutorialService.update(
        currentTutorial.id,
        currentTutorial
      );
      console.log(response.data);
      setMessage("The tutorial was updated successfully!");
    } catch (e) {
      console.log(e);
    }
  };

  const deleteTutorial = async () => {
    try {
      let response = await TutorialService.remove(currentTutorial.id);
      console.log(response.data);
      navigate("/tutorials");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      {currentTutorial ? (
        <div className="edit-form">
          <h4>Tutorial</h4>
          <form>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                className="form-control"
                id="title"
                name="title"
                value={currentTutorial.title}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <input
                type="text"
                className="form-control"
                id="description"
                name="description"
                value={currentTutorial.description}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>
                <strong>Status:</strong>
              </label>
              {currentTutorial.published ? "Published" : "Pending"}
            </div>
          </form>

          {currentTutorial.published ? (
            <button
              className="badge-primary mr-2"
              onClick={() => updatePublished(false)}
            >
              UnPublish
            </button>
          ) : (
            <button
              className="badge-primary mr-2"
              onClick={() => updatePublished(true)}
            >
              Publish
            </button>
          )}

          <button className="badge-danger mr-2" onClick={deleteTutorial}>
            Delete
          </button>

          <button
            type="submit"
            className="badge-success"
            onClick={updateTutorial}
          >
            Update
          </button>
          <p>{message}</p>
        </div>
      ) : (
        <div>
          <br />
          <p>Please click on a Tutorial...</p>
        </div>
      )}
    </div>
  );
}

export default OneTutorial;
