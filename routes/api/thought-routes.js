const router = require('express').Router();

const {
    getAllThoughts,
    getThoughtById,
    addThought,
    updateThought,
    deleteThought,
    addReaction,
    deleteReaction
} = require('../../controllers/thought-controller');

// get all thoughts
router.route('/')
    .get(getAllThoughts);

// for a specific thought, get, update or delete it.
router.route('/:id')
    .get(getThoughtById)
    .put(updateThought)
    .delete(deleteThought);

// create a thought with the userId
router.route('/:userId')
    .post(addThought);

// create a reaction to a certain thought
    router.route('/:thoughtId/reactions')
    .post(addReaction);

//delete a reaction of a certain thought
router.route('/:thoughtId/reactions/:reactionId')
    .delete(deleteReaction);

module.exports = router;