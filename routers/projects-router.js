const express = require("express");
const router = express.Router();

const Projects = require("../data/helpers/projectModel");

router.get("/", (req, res) => {
  Projects.get()
    .then((projects) => {
      res.status(200).json({
        Message: "Successfully retrieved projects list",
        projects: projects,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Unable to retrieve projects list",
        error: error,
      });
    });
});

router.get("/:id", checkID, (req, res) => {
  const id = req.params.id;
  Projects.get(id)
    .then((project) => {
      res.status(200).json({
        message: "Successfully retrieved project with specific id",
        project: project,
      });
    })
    .catch((error) => {
      console.log(error);
      res
        .status(404)
        .json({ message: "Unable to retrieve project with specific id" });
    });
});

router.post("/", checkProjectBody, (req, res) => {
  const newProject = req.body;
  Projects.insert(newProject)
    .then((project) => {
      res.status(201).json({
        message: "Successfully created project",
        project: project,
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Unable to create new project",
        error: error,
      });
    });
});

router.put("/:id", checkID, checkProjectBody, (req, res) => {
  const id = req.params.id;
  const updatedProject = req.body;
  Projects.update(id, updatedProject)
    .then((project) => {
      res.status(200).json({
        message: "Successfully updated project",
        project: project,
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Unable to update project",
        error: error,
      });
    });
});

router.delete("/:id", checkID, (req, res) => {
  const deleteProject = req.params.id;
  Projects.remove(deleteProject)
    .then((count) => {
      if (count > 0) {
        res.status(200).json({
          message: "Project successfully deleted",
          count: count,
        });
      } else {
        res.status(404).json({
          message: "Project with the specified ID does not exist",
        });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: "Unable to delete project" });
    });
});

// VALIDATION - MIDDLEWARE //

function checkID(req, res, next) {
  const id = req.params.id;
  Projects.get(id)
    .then((project) => {
      if (project === null) {
        res.status(404).json({
          message: "Project with specified ID does not exist",
        });
      } else {
        next();
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        errorMessage: error,
      });
    });
}

function checkProjectBody(req, res, next) {
  const projectName = req.body.name;
  const projectDescription = req.body.description;
  if (!projectName || !projectDescription) {
    res.status(400).json({
      message: "Name and description are required fields",
    });
  }
  if (
    typeof projectName !== "string" ||
    typeof projectDescription !== "string"
  ) {
    res.status(400).json({
      message: "Enter valid text for name and description",
    });
  } else {
    next();
  }
}

module.exports = router;
