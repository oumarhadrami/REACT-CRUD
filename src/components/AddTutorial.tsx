import { ChangeEvent, useState } from "react";
import ITutorialData from "../@types/Tutorial";
import TutorialService from "../services/TutorialService";

function AddTutorial() {
  const initialTutorialState = {
    id: null,
    title: "",
    description: "",
    published: false,
  };
  const [tutorial, setTutorial] = useState<ITutorialData>(initialTutorialState);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setTutorial({ ...tutorial, [name]: value });
    console.log(tutorial);
  };

  const saveTutorial = async () => {
    var data = {
      title: tutorial.title,
      description: tutorial.description,
    };

    try {
      let response = await TutorialService.create(data);
      console.log(response.data);
      setSubmitted(true);
    } catch (error) {
      console.log(error);
    }
  };

  const newTutorial = () => {
    setSubmitted(false);
    setTutorial(initialTutorialState);
  };

  return (
    <>
      <div className="submit-form">
        {submitted ? (
          <div>
            <h4>You submitted successfully!</h4>
            <button className="btn btn-success" onClick={newTutorial}>
              Add
            </button>
          </div>
        ) : (
          <div>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                className="form-control"
                id="title"
                required
                value={tutorial.title}
                onChange={handleInputChange}
                name="title"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <input
                type="text"
                className="form-control"
                id="description"
                required
                value={tutorial.description}
                onChange={handleInputChange}
                name="description"
              />
            </div>

            <button onClick={saveTutorial} className="btn btn-success">
              Submit
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default AddTutorial;
