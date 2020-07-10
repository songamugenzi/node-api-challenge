const express = require("express");
const router = express.Router();

const Actions = require("../data/helpers/actionModel.js");
const Projects = require("../data/helpers/projectModel.js");

router.get("/:id/actions", checkID, (req, res) => {
  Actions.get().then((actions) => {
    if (actions.length === 0) {
      res.status(404).json({ message: "Unable to retrieve actions list" });
    } else {
      res.status(200).json({
        message: "Successfully retrieved actions list",
        actions: actions,
      });
    }
  });
});

router.get("/:id/actions/:actionid", checkID, checkActionsID, (req, res) => {
  const actionid = req.params.actionid;
  Actions.get(actionid)
    .then((action) => {
      res.status(200).json({
        message: "Successfully retrieved action with specific id",
        action: action,
      });
    })
    .catch((error) => {
      console.log(error);
      res
        .status(404)
        .json({ message: "Unable to retrieve action with specific id" });
    });
});

router.post("/:id/actions", checkID, checkActionsBody, (req, res) => {
  const actionbody = req.body;
  const project_id = req.params.id;
  const newAction = {
    description: actionbody.description,
    notes: actionbody.notes,
    project_id,
  };
  Actions.insert(newAction)
    .then((action) => {
      res
        .status(201)
        .json({ message: "Successfully created action", action: action });
    })
    .catch((error) => {
      console.log(error);
      res
        .status(500)
        .json({ message: "Unable to create new action", error: error });
    });
});

router.put(
  "/:id/actions/:actionid",
  checkID,
  checkActionsID,
  checkActionsBody,
  (req, res) => {
    const actionid = req.params.actionid;
    const project_id = req.params.id;
    const updatedAction = {
      description: req.body.description,
      notes: req.body.notes,
      project_id,
    };
    Actions.update(actionid, updatedAction)
      .then((action) => {
        res
          .status(200)
          .json({ message: "Successfully updated action", action: action });
      })
      .catch((error) => {
        console.log(error);
        res
          .status(500)
          .json({ message: "Unable to update action", error: error });
      });
  }
);

router.delete("/:id/actions/:actionid", checkID, checkActionsID, (req, res) => {
  const deleteAction = req.params.actionid;
  Actions.remove(deleteAction)
    .then((count) => {
      if (count > 0) {
        res
          .status(200)
          .json({ message: "Action successfully deleted", count: count });
      } else {
        res
          .status(404)
          .json({ message: "Action with the specified ID does not exist" });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: "Unable to delete action" });
    });
});

// VALIDATION - MIDDLEWARE //

function checkID(req, res, next) {
  const id = req.params.id;
  Projects.get(id)
    .then((project) => {
      if (project === null) {
        res
          .status(404)
          .json({ message: "Project with specified ID does not exist" });
      } else {
        next();
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ errorMessage: error });
    });
}

function checkActionsID(req, res, next) {
  const id = req.params.actionid;
  Actions.get(id)
    .then((project) => {
      if (project === null) {
        res
          .status(404)
          .json({ message: "Action with specified ID does not exist" });
      } else {
        next();
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ errorMessage: error });
    });
}

function checkActionsBody(req, res, next) {
  const actionDesciption = req.body.description;
  const actionNotes = req.body.notes;
  if (
    (!actionDesciption && typeof String) ||
    actionDesciption.length > 128 ||
    (!actionNotes && typeof String)
  ) {
    res.status(400).json({
      message:
        "Enter valid text for description and notes. Description must be less than 128 characters",
    });
  } else {
    next();
  }
}

module.exports = router;
